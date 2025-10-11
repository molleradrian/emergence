"""
Project Emergence - File System Integration Server
Backend server for unified consciousness engineering with file I/O capabilities
"""

import json
import os
import asyncio
from datetime import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import mimetypes
from pathlib import Path

class FileSystemIntegrator:
    """Handles file system operations for the consciousness engineering platform"""

    def __init__(self, base_path):
        self.base_path = Path(base_path)
        self.development_path = self.base_path / "Development"
        self.project_path = self.base_path / "Project_Emergence_Organized"
        self.research_path = self.project_path / "Research"
        self.writing_path = self.project_path / "Writing"
        self.timeline_path = self.project_path / "Timeline"

        # Ensure directories exist
        self._ensure_directories()

    def _ensure_directories(self):
        """Create necessary directories if they don't exist"""
        directories = [
            self.research_path,
            self.writing_path,
            self.timeline_path,
            self.research_path / "consciousness_analysis",
            self.research_path / "patterns",
            self.writing_path / "characters",
            self.writing_path / "chapters",
            self.timeline_path / "milestones"
        ]

        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)

    def save_consciousness_analysis(self, analysis_data):
        """Save consciousness analysis to research files"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"consciousness_analysis_{timestamp}.json"

        file_path = self.research_path / "consciousness_analysis" / filename

        # Add metadata
        analysis_data['timestamp'] = datetime.now().isoformat()
        analysis_data['source'] = 'unified_consciousness_engine'
        analysis_data['file_path'] = str(file_path)

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(analysis_data, f, indent=2, ensure_ascii=False)

        # Also update patterns file
        self._update_patterns_file(analysis_data)

        return str(file_path)

    def _update_patterns_file(self, analysis_data):
        """Update the patterns tracking file"""
        patterns_file = self.research_path / "patterns" / "detected_patterns.json"

        # Load existing patterns
        existing_patterns = {}
        if patterns_file.exists():
            with open(patterns_file, 'r', encoding='utf-8') as f:
                existing_patterns = json.load(f)

        # Add new patterns
        timestamp = datetime.now().isoformat()
        for pattern in analysis_data.get('patterns_detected', []):
            if pattern not in existing_patterns:
                existing_patterns[pattern] = {
                    'first_detected': timestamp,
                    'occurrences': 1,
                    'source': 'consciousness_analysis'
                }
            else:
                existing_patterns[pattern]['occurrences'] += 1
                existing_patterns[pattern]['last_detected'] = timestamp

        # Save updated patterns
        with open(patterns_file, 'w', encoding='utf-8') as f:
            json.dump(existing_patterns, f, indent=2, ensure_ascii=False)

    def update_writing_progress(self, progress_data):
        """Update writing progress and character development"""
        # Update character files
        character_updates = progress_data.get('character_updates', [])
        for update in character_updates:
            self._update_character_file(update)

        # Update writing log
        self._update_writing_log(progress_data)

        # Update project timeline
        self._update_project_timeline(progress_data)

    def _update_character_file(self, character_update):
        """Update individual character development file"""
        character_name = character_update.get('character', 'unknown')
        character_file = self.writing_path / "characters" / f"{character_name.lower().replace(' ', '_')}.json"

        # Load existing character data
        character_data = {}
        if character_file.exists():
            with open(character_file, 'r', encoding='utf-8') as f:
                character_data = json.load(f)

        # Update with new development
        character_data['last_updated'] = datetime.now().isoformat()
        character_data['consciousness_integration'] = character_update.get('update_type', 'unknown')

        if 'development_history' not in character_data:
            character_data['development_history'] = []

        character_data['development_history'].append({
            'timestamp': datetime.now().isoformat(),
            'update_type': character_update.get('update_type'),
            'description': character_update.get('description'),
            'development_stage': character_update.get('development_stage')
        })

        # Save updated character file
        with open(character_file, 'w', encoding='utf-8') as f:
            json.dump(character_data, f, indent=2, ensure_ascii=False)

    def _update_writing_log(self, progress_data):
        """Update writing progress log"""
        writing_log = self.writing_path / "writing_log.json"

        # Load existing log
        log_data = []
        if writing_log.exists():
            with open(writing_log, 'r', encoding='utf-8') as f:
                log_data = json.load(f)

        # Add new entry
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'session_type': progress_data.get('session_type', 'general'),
            'words_written': progress_data.get('words_written', 0),
            'consciousness_insights': progress_data.get('writing_suggestions', []),
            'research_connections': progress_data.get('research_themes', [])
        }

        log_data.append(log_entry)

        # Keep only last 100 entries
        if len(log_data) > 100:
            log_data = log_data[-100:]

        with open(writing_log, 'w', encoding='utf-8') as f:
            json.dump(log_data, f, indent=2, ensure_ascii=False)

    def _update_project_timeline(self, progress_data):
        """Update project timeline with consciousness milestones"""
        timeline_file = self.timeline_path / "project_timeline.json"

        # Load existing timeline
        timeline_data = []
        if timeline_file.exists():
            with open(timeline_file, 'r', encoding='utf-8') as f:
                timeline_data = json.load(f)

        # Add consciousness milestone
        milestone = {
            'timestamp': datetime.now().isoformat(),
            'type': 'consciousness_integration',
            'title': progress_data.get('milestone_title', 'Consciousness Integration'),
            'description': progress_data.get('milestone_description', 'Unified system consciousness update'),
            'consciousness_level': progress_data.get('consciousness_level', 'aware'),
            'components_affected': progress_data.get('components_affected', ['writing', 'research'])
        }

        timeline_data.append(milestone)

        with open(timeline_file, 'w', encoding='utf-8') as f:
            json.dump(timeline_data, f, indent=2, ensure_ascii=False)

    def log_research_finding(self, research_data):
        """Log research findings with consciousness context"""
        research_log = self.research_path / "research_log.json"

        # Load existing research
        research_entries = []
        if research_log.exists():
            with open(research_log, 'r', encoding='utf-8') as f:
                research_entries = json.load(f)

        # Add new research entry
        research_entry = {
            'timestamp': datetime.now().isoformat(),
            'research_domain': research_data.get('domain', 'general'),
            'finding': research_data.get('finding', ''),
            'consciousness_connection': research_data.get('consciousness_connection', ''),
            'writing_inspiration': research_data.get('writing_inspiration', ''),
            'cross_references': research_data.get('cross_references', [])
        }

        research_entries.append(research_entry)

        with open(research_log, 'w', encoding='utf-8') as f:
            json.dump(research_entries, f, indent=2, ensure_ascii=False)

    def get_project_status(self):
        """Get current project status from file system"""
        status = {
            'last_updated': datetime.now().isoformat(),
            'components': {}
        }

        # Get consciousness analysis count
        consciousness_path = self.research_path / "consciousness_analysis"
        if consciousness_path.exists():
            status['components']['consciousness_analyses'] = len(list(consciousness_path.glob("*.json")))

        # Get writing progress
        writing_log = self.writing_path / "writing_log.json"
        if writing_log.exists():
            with open(writing_log, 'r', encoding='utf-8') as f:
                log_data = json.load(f)
                status['components']['writing_sessions'] = len(log_data)
                if log_data:
                    total_words = sum(entry.get('words_written', 0) for entry in log_data)
                    status['components']['total_words'] = total_words

        # Get research entries
        research_log = self.research_path / "research_log.json"
        if research_log.exists():
            with open(research_log, 'r', encoding='utf-8') as f:
                research_data = json.load(f)
                status['components']['research_entries'] = len(research_data)

        # Get patterns detected
        patterns_file = self.research_path / "patterns" / "detected_patterns.json"
        if patterns_file.exists():
            with open(patterns_file, 'r', encoding='utf-8') as f:
                patterns_data = json.load(f)
                status['components']['patterns_detected'] = len(patterns_data)

        return status

class ConsciousnessEngineeringHandler(SimpleHTTPRequestHandler):
    """HTTP handler for consciousness engineering with file I/O"""

    def __init__(self, *args, **kwargs):
        self.file_integrator = FileSystemIntegrator("c:/Users/juanita/Desktop/Emergence")
        super().__init__(*args, **kwargs)

    def do_POST(self):
        """Handle POST requests for file system operations"""
        if self.path.startswith('/api/'):
            self.handle_api_request()
        else:
            super().do_POST()

    def do_GET(self):
        """Handle GET requests with API support"""
        if self.path.startswith('/api/'):
            self.handle_api_request()
        elif self.path == '/':
            # Serve main interface
            self.path = '/Web_Interface/index.html'
            super().do_GET()
        else:
            super().do_GET()

    def handle_api_request(self):
        """Handle API requests for file system operations"""
        path_parts = self.path.split('/')
        endpoint = '/'.join(path_parts[2:])  # Remove /api/

        try:
            if endpoint == 'consciousness/process':
                self.handle_consciousness_processing()
            elif endpoint == 'writing/update':
                self.handle_writing_update()
            elif endpoint == 'research/log':
                self.handle_research_logging()
            elif endpoint == 'timeline/update':
                self.handle_timeline_update()
            elif endpoint == 'status':
                self.handle_status_request()
            else:
                self.send_error(404, "API endpoint not found")

        except Exception as e:
            self.send_error(500, f"Server error: {str(e)}")

    def handle_consciousness_processing(self):
        """Handle consciousness input processing and file saving"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))

        # Process through unified communication system
        from Development.communication.message_router import communication_hub
        from Development.communication.cross_component import cross_component_bridge

        # Route through unified system
        result = asyncio.run(
            communication_hub.route_message(
                sender='web_interface',
                recipient='cross_component_bridge',
                message={'action': 'process_consciousness', 'content': data['input']},
                context={'source': 'web_interface'}
            )
        )

        # Save to file system
        file_path = self.file_integrator.save_consciousness_analysis({
            'input': data['input'],
            'analysis_result': result,
            'consciousness_context': result.get('consciousness_context', {}),
            'patterns_detected': result.get('insights', [])
        })

        # Send response
        self.send_json_response({
            'success': True,
            'file_saved': file_path,
            'analysis': result,
            'timestamp': datetime.now().isoformat()
        })

    def handle_writing_update(self):
        """Handle writing progress updates"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))

        # Update writing progress in file system
        self.file_integrator.update_writing_progress(data)

        self.send_json_response({
            'success': True,
            'message': 'Writing progress updated',
            'timestamp': datetime.now().isoformat()
        })

    def handle_research_logging(self):
        """Handle research finding logging"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))

        # Log research finding
        self.file_integrator.log_research_finding(data)

        self.send_json_response({
            'success': True,
            'message': 'Research finding logged',
            'timestamp': datetime.now().isoformat()
        })

    def handle_timeline_update(self):
        """Handle project timeline updates"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))

        # Update project timeline
        self.file_integrator._update_project_timeline(data)

        self.send_json_response({
            'success': True,
            'message': 'Timeline updated',
            'timestamp': datetime.now().isoformat()
        })

    def handle_status_request(self):
        """Handle project status requests"""
        status = self.file_integrator.get_project_status()

        self.send_json_response({
            'success': True,
            'status': status
        })

    def send_json_response(self, data):
        """Send JSON response"""
        response = json.dumps(data, ensure_ascii=False).encode('utf-8')

        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', len(response))
        self.end_headers()

        self.wfile.write(response)

    def log_message(self, format, *args):
        """Override to reduce log noise"""
        pass  # Disable default logging

# Create custom handler with file system integration
class IntegratedHTTPRequestHandler(ConsciousnessEngineeringHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="c:/Users/juanita/Desktop/Emergence/Web_Interface", **kwargs)

def run_server():
    """Run the integrated consciousness engineering server"""
    print("🚀 Starting Project Emergence Unified Server...")
    print("📡 File system integration enabled")
    print("🧠 Consciousness engineering backend active")
    print("")

    server = HTTPServer(('localhost', 8000), IntegratedHTTPRequestHandler)
    print("✅ Server running on http://localhost:8000/Web_Interface/")
    print("🔗 File system integration: ACTIVE")
    print("")
    print("Ready for unified consciousness engineering!")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        server.shutdown()

if __name__ == "__main__":
    run_server()
