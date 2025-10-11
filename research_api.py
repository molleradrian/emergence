from flask import Flask, request, jsonify
from researchSynthesizer import ResearchSynthesizer

app = Flask(__name__)

# Initialize the research synthesizer
synthesizer = ResearchSynthesizer()

@app.route('/synthesize', methods=['POST'])
def synthesize_research():
    data = request.json
    research_data = data.get('research_data')
    synthesis = synthesizer.synthesize_research(research_data)
    return jsonify({"synthesis": synthesis})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
