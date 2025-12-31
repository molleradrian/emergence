import http.server
import socketserver
import json
import sys
import os
from urllib.parse import urlparse

# Add backend to path
BACKEND_PATH = os.path.join(os.getcwd(), 'Development', 'Aetherium_System', 'src')
sys.path.append(BACKEND_PATH)

try:
    from core.consciousness_engine import process_with_consciousness
    BACKEND_AVAILABLE = True
    print("Backend module loaded successfully")
except ImportError as e:
    BACKEND_AVAILABLE = False
    print(f"Backend module not found: {e}")
    print(f"Search path: {BACKEND_PATH}")

PORT = 8000
WEB_DIR = "Web_Interface"

class EmergenceRequestHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = http.server.SimpleHTTPRequestHandler.extensions_map.copy()
    extensions_map.update({
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.html': 'text/html',
        '.json': 'application/json',
        '.svg': 'image/svg+xml',
    })

    def do_GET(self):
        # Serve from Web_Interface directory
        if self.path == '/' or self.path == '':
            self.path = '/index.html'
        
        # Adjust path to map to Web_Interface
        # If the path doesn't start with /Web_Interface, map it there for convenience
        # But SimpleHTTPRequestHandler usually serves from CWD. 
        # I will change CWD to root in main(), so I need to translate paths.
        
        # Actually, let's keep it simple. The user usually opens /Web_Interface/index.html
        # Or I can just serve everything from root, and let the browser ask for /Web_Interface/...
        return super().do_GET()

    def do_POST(self):
        if self.path == '/api/analyze':
            self.handle_analyze()
        else:
            self.send_error(404, "API Endpoint not found")

    def handle_analyze(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            text = data.get('text', '')
            
            response_data = {
                "success": False,
                "message": "Backend unavailable"
            }

            if BACKEND_AVAILABLE:
                # Call the actual Python backend
                # Reshape input to match what consciousness_engine expects
                # It usually expects a dict, e.g. {"query": text}
                engine_input = {"query": text, "type": "user_input"}
                engine_response = process_with_consciousness(engine_input)
                
                response_data = {
                    "success": True,
                    "patterns": engine_response['consciousness_context']['patterns_detected'],
                    "state": engine_response['consciousness_context']['state'],
                    "output": engine_response['output'],
                    "raw": engine_response
                }
            else:
                # Mock response if backend fails
                response_data = {
                    "success": True,
                    "patterns": ["mock_pattern_backend_missing"],
                    "state": "simulated",
                    "output": "Backend logic not found, using simulation."
                }

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode('utf-8'))

        except Exception as e:
            print(f"Error processing request: {e}")
            self.send_error(500, str(e))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def main():
    # Fix for Windows MIME types
    import mimetypes
    mimetypes.add_type('application/javascript', '.js')
    mimetypes.add_type('text/css', '.css')
    
    # Make sure we are in the root directory
    print(f"Starting Emergence API Server on port {PORT}")
    print(f"Root Directory: {os.getcwd()}")
    
    with socketserver.TCPServer(("", PORT), EmergenceRequestHandler) as httpd:
        print("Server running at http://localhost:8000")
        print("   -> Frontend: http://localhost:8000/Web_Interface/")
        print("   -> API:      http://localhost:8000/api/analyze")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    main()
