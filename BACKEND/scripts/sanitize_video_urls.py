#!/usr/bin/env python3
"""
One-off script to sanitize video URLs stored in the DB.
It will decode URL-encoded filenames, replace characters that are invalid on
Windows (for example ':'), and update Video.url to point to the sanitized filename
under `/static/uploads/`.

Run from the project root (or from BACKEND/) with the same Python env used to run the app:

    python BACKEND/scripts/sanitize_video_urls.py

This script DOES NOT attempt to rename files on disk (safer). If you want to rename
files too, run a careful offline migration.
"""

import os
import re
import urllib.parse

from db.session import SessionLocal
from models.videos import Video

# sanitize function should match the one used in the controller
def _sanitize_filename(name: str) -> str:
    name = name.replace('\\', '_').replace('/', '_')
    name = re.sub(r'[<>:"/\\|?*]', '_', name)
    name = re.sub(r'\s+', '_', name).strip('_')
    return name


def main():
    print("Starting sanitize-video-urls script...")
    db = SessionLocal()
    try:
        videos = db.query(Video).all()
        changed = 0
        for v in videos:
            if not v.url:
                continue
            # expect URLs like /static/uploads/<filename>
            parts = v.url.split('/')
            if len(parts) < 3:
                continue
            basename = parts[-1]
            # decode percent-encoding
            decoded = urllib.parse.unquote(basename)
            safe = _sanitize_filename(decoded or 'upload')
            if safe != decoded:
                new_url = f"/static/uploads/{safe}"
                print(f"Updating video id={v.id}: {v.url} -> {new_url}")
                v.url = new_url
                db.add(v)
                changed += 1
        if changed > 0:
            db.commit()
        print(f"Done. {changed} video url(s) updated.")
    finally:
        db.close()


if __name__ == '__main__':
    main()
