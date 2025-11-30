#!/usr/bin/env python3
"""
Safe helper to rename files in static/uploads to sanitized filenames and update DB Video.url entries.

USAGE (dry-run):
    python BACKEND/scripts/fix_upload_filenames.py

To actually rename files and update DB rows, pass --apply:
    python BACKEND/scripts/fix_upload_filenames.py --apply

This script is cautious: by default it only prints proposed changes. When --apply is
provided it will attempt to rename files and update the database. It will skip files
it cannot rename and will avoid overwriting existing files by adding a uuid suffix
when necessary.

Run from the project root using the same Python environment as the app.
"""

import os
import re
import sys
import uuid
import urllib.parse

from db.session import SessionLocal
from models.videos import Video


UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'static', 'uploads')


def _sanitize_filename(name: str) -> str:
    # keep consistent with controller sanitizer (operates on decoded filename)
    name = name.replace('\\', '_')
    # replace characters invalid on Windows (note: do NOT replace path separators here)
    name = re.sub(r'[<>:\\"|?*]', '_', name)
    name = re.sub(r'\s+', '_', name).strip('_')
    if not name:
        name = 'upload'
    return name


def find_db_videos_for_basename(db, basename):
    # Return videos whose url basename when percent-decoded equals basename or equals quoted basename
    matches = []
    videos = db.query(Video).all()
    for v in videos:
        if not v.url:
            continue
        url_basename = v.url.rsplit('/', 1)[-1]
        decoded = urllib.parse.unquote(url_basename)
        if decoded == basename or url_basename == basename or url_basename == urllib.parse.quote(basename):
            matches.append(v)
    return matches


def main(apply_changes=False):
    uploads = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'uploads'))
    uploads = os.path.normpath(uploads)
    print(f"Uploads dir: {uploads}")
    if not os.path.isdir(uploads):
        print("Uploads directory does not exist. Exiting.")
        return

    db = SessionLocal()
    try:
        files = os.listdir(uploads)
        if not files:
            print("No files found in uploads directory.")
            return

        changes = []
        for fname in files:
            # consider both percent-decoded and raw name
            decoded = urllib.parse.unquote(fname)
            safe = _sanitize_filename(decoded)
            if safe == fname:
                # already safe
                continue

            target = safe
            target_path = os.path.join(uploads, target)
            # avoid clobbering existing file
            if os.path.exists(target_path):
                # append uuid prefix to avoid overwrite
                uid = uuid.uuid4().hex
                target = f"{uid}__{safe}"
                target_path = os.path.join(uploads, target)

            changes.append((fname, decoded, target))

        if not changes:
            print("No files need renaming.")
            return

        print("Planned changes:")
        for old, decoded, new in changes:
            print(f"  {old}  ->  {new}  (decoded: {decoded})")

        if not apply_changes:
            print('\nDry-run mode. No files were renamed. Rerun with --apply to perform changes and update the DB.')
            return

        # perform renames and update DB rows
        applied = 0
        for old, decoded, new in changes:
            old_path = os.path.join(uploads, old)
            new_path = os.path.join(uploads, new)
            try:
                os.rename(old_path, new_path)
                print(f"Renamed: {old} -> {new}")
            except Exception as e:
                print(f"Failed to rename {old} -> {new}: {e}")
                continue

            # update DB rows referring to this basename
            vids = find_db_videos_for_basename(db, decoded)
            for v in vids:
                old_url = v.url
                v.url = f"/static/uploads/{new}"
                db.add(v)
                print(f"  Updated DB video id={v.id}: {old_url} -> {v.url}")
                applied += 1

        if applied > 0:
            db.commit()
        print(f"Done. Renames applied: {len(changes)}; DB video rows updated: {applied}")

    finally:
        db.close()


if __name__ == '__main__':
    apply_flag = '--apply' in sys.argv
    main(apply_changes=apply_flag)
