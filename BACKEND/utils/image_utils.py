import os
import requests
from urllib.parse import urlparse
from fastapi import HTTPException

def validate_and_process_image_url(url: str) -> str:
    """
    Validates an image URL and returns a processed version that will work reliably.
    If it's a Google thumbnail URL, attempts to get the original image URL.
    """
    try:
        # Check if it's a Google thumbnail URL
        parsed_url = urlparse(url)
        if 'encrypted-tbn' in parsed_url.netloc:
            raise HTTPException(
                status_code=400,
                detail="Please provide the original image URL instead of a Google thumbnail. Right-click the image and select 'Open image in new tab' to get the correct URL."
            )
        
        # Validate that the URL is accessible
        response = requests.head(url)
        if response.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail="The provided URL is not accessible. Please provide a direct link to the image."
            )
        
        # Check content type
        content_type = response.headers.get('content-type', '')
        if not content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail="The URL does not point to a valid image file."
            )
            
        return url
        
    except requests.RequestException:
        raise HTTPException(
            status_code=400,
            detail="Failed to access the provided URL. Please check if the URL is correct and accessible."
        )