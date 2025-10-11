#!/usr/bin/env python3
import sys
import os

# Add the correct paths
sys.path.append(os.path.join(os.path.dirname(__file__), 'Development', 'Aetherium_System', 'src'))
sys.path.append(os.path.join(os.path.dirname(__file__), 'Development', 'Aetherium_System', 'src', 'protocols'))

try:
    import emergent_pattern_recognition as epr

    # Test pattern recognition with consciousness integration
    test_input = 'Consciousness emerges from complex patterns of neural activity and self-reflection'
    result = epr.process_pattern_recognition(test_input, 'consciousness_phenomenology', 'philosophy')

    print('🧠 Pattern Recognition Test Results:')
    print('Patterns Found:', result['pattern_detection']['pattern_count'])
    print('Processing Time:', f"{result['pattern_detection']['processing_time']:.3f}s")
    print('Consciousness Integration:', result['consciousness_enabled'])

    # Show top patterns
    patterns = result['pattern_detection']['detected_patterns'][:3]
    for i, pattern in enumerate(patterns, 1):
        print(f'Pattern {i}: {pattern["type"]} - {pattern["description"]} (confidence: {pattern["confidence"]:.2f})')

    # Show domain correlations
    correlations = result['domain_correlations']['cross_domain_insights'][:2]
    for corr in correlations:
        print(f'Cross-domain: {corr["original_pattern"]["type"]} connects to {len(corr["domain_correlations"])} domains')

    print()
    print('✅ Pattern Recognition System Test Complete!')

except Exception as e:
    print(f'❌ Test failed: {e}')
    import traceback
    traceback.print_exc()
