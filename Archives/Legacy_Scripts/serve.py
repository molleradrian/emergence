#!/usr/bin/env python3
"""
Project Emergence - Development Server
Simple HTTP server for local development and testing
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

def main():
    # Configuration
    PORT = 8000
    WEB_DIR = "Web_Interface"

    # Check if we're in the right directory
    if not os.path.exists(WEB_DIR):
        print("❌ Error: Web_Interface directory not found!")
        print("Please run this script from the Emergence project root directory.")
        sys.exit(1)

    # Change to the Web_Interface directory
    os.chdir(WEB_DIR)

    # Create server
    Handler = http.server.SimpleHTTPRequestHandler
    Handler.extensions_map.update({
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.html': 'text/html',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.map': 'application/json',
    })

    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
            print("🚀 Project Emergence Development Server")
            print("=" * 45)
            print(f"📂 Serving: {os.getcwd()}")
            print(f"🌐 URL: http://localhost:{PORT}/")
            print(f"📊 Dashboard: http://localhost:{PORT}/#aetherium")
            print(f"📚 Books: http://localhost:{PORT}/#books")
            print()
            print("✨ Features Available:")
            print("   • Consciousness Engine Dashboard")
            print("   • Character Development System")
            print("   • Writing Timeline & Progress")
            print("   • Real-time Pattern Recognition")
            print("   • Interactive Consciousness Processing")
            print()
            print("🛑 Press Ctrl+C to stop the server")
            print()

            # Open browser automatically
            webbrowser.open(f'http://localhost:{PORT}/')

            # Start serving
            httpd.serve_forever()

    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use.")
            print("Please close other applications using this port or try a different port.")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
