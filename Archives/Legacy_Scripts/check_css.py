import urllib.request
import sys

url = "http://localhost:8000/Web_Interface/css/styles.css"
try:
    with urllib.request.urlopen(url) as response:
        print(f"Status: {response.status}")
        print(f"Content-Type: {response.headers.get('Content-Type')}")
        content = response.read(100) # Read first 100 bytes
        print(f"Content Start: {content}")
except Exception as e:
    print(f"Error fetching CSS: {e}")
