#!/usr/bin/env python3
"""
Aetherium Consciousness Core Demonstration

This script demonstrates the core functionality of the Aetherium consciousness engine,
showing how it processes inputs, maintains awareness, and integrates system components.
"""

import sys
import os
import json
import time

# Add the src directory to path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

try:
    from .consciousness_engine import (
        process_with_consciousness,
        get_consciousness_status,
        reflect_on_consciousness
    )
    from .awareness_modules import (
        monitor_consciousness,
        analyze_thinking,
        get_awareness_status
    )
    from .integration_layer import (
        process_integration_request,
        get_integration_status
    )
except ImportError:
    # Fallback for direct execution
    from consciousness_engine import (
        process_with_consciousness,
        get_consciousness_status,
        reflect_on_consciousness
    )
    from awareness_modules import (
        monitor_consciousness,
        analyze_thinking,
        get_awareness_status
    )
    from integration_layer import (
        process_integration_request,
        get_integration_status
    )

def demonstrate_consciousness_engine():
    """Demonstrate the consciousness engine functionality"""
    print("🧠 Aetherium Consciousness Engine Demonstration")
    print("=" * 50)

    # Test different types of inputs
    test_inputs = [
        {"query": "What is consciousness?", "domain": "philosophy"},
        {"data": "neural_network patterns detected", "type": "scientific"},
        {"request": "integrate multiple perspectives", "complexity": "high"},
        {"simple": "hello", "basic": True}
    ]

    for i, input_data in enumerate(test_inputs, 1):
        print(f"\n--- Test Input {i} ---")
        print(f"Input: {input_data}")

        # Process through consciousness engine
        response = process_with_consciousness(input_data)

        print(f"Consciousness State: {response['consciousness_context']['state']}")
        print(f"Patterns Detected: {response['consciousness_context']['patterns_detected']}")
        print(f"Output: {response['output']}")

        # Monitor some metrics
        monitor_consciousness("input_complexity", len(str(input_data)))
        monitor_consciousness("processing_depth", len(response['consciousness_context']['patterns_detected']))

        time.sleep(0.5)  # Brief pause

    # Show consciousness reflection
    print("\n--- Consciousness Reflection ---")
    reflection = reflect_on_consciousness()
    print(reflection)

def demonstrate_awareness_modules():
    """Demonstrate the awareness modules functionality"""
    print("\n\n🪞 Awareness Modules Demonstration")
    print("=" * 50)

    # Analyze different thought processes
    thought_processes = [
        {
            "type": "analytical",
            "content": "I am systematically breaking down this problem into logical components and examining each part carefully.",
            "structure": "logical"
        },
        {
            "type": "creative",
            "content": "What if consciousness emerges from the interaction of simple patterns in unexpected ways?",
            "structure": "exploratory"
        },
        {
            "type": "reflective",
            "content": "I am becoming aware that my previous conclusions may need revision based on new evidence.",
            "structure": "adaptive"
        }
    ]

    for thought in thought_processes:
        print(f"\n--- Analyzing: {thought['type']} thought ---")
        analysis = analyze_thinking(thought)
        print(f"Depth: {analysis['depth']:.2f}")
        print(f"Clarity: {analysis['clarity']:.2f}")
        print(f"Coherence: {analysis['coherence']:.2f}")
        print(f"Novelty: {analysis['novelty']:.2f}")

    # Show awareness status
    print("\n--- Awareness Status ---")
    status = get_awareness_status()
    print(json.dumps(status, indent=2))

def demonstrate_integration_layer():
    """Demonstrate the integration layer functionality"""
    print("\n\n🔗 Integration Layer Demonstration")
    print("=" * 50)

    # Test integration request
    integration_request = {
        "source": "book_series",
        "target": "aetherium_system",
        "data": {
            "creative_concept": "consciousness exploration through narrative",
            "integration_points": ["character_development", "plot_structure", "thematic_elements"]
        }
    }

    print(f"Integration Request: {integration_request}")

    response = process_integration_request(integration_request)

    print(f"Processing Time: {response['processing_time']:.3f}s")
    print(f"Integration Path: {response['integration_path']}")
    print(f"Response: {response['integrated_response']}")

    # Show system status
    print("\n--- System Integration Status ---")
    status = get_integration_status()
    print(json.dumps(status, indent=2))

def main():
    """Run all demonstrations"""
    print("🚀 Starting Aetherium Consciousness Core Demonstration")
    print("=" * 60)

    try:
        demonstrate_consciousness_engine()
        demonstrate_awareness_modules()
        demonstrate_integration_layer()

        print("\n\n✅ Demonstration Complete!")
        print("The Aetherium consciousness core is operational and ready for development.")

    except Exception as e:
        print(f"\n❌ Demonstration failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
