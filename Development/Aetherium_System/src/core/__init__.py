"""
Aetherium Consciousness Core Package

This package contains the core consciousness engine for the Aetherium System:
- consciousness_engine: Central processing framework
- awareness_modules: Self-reflective capabilities
- integration_layer: Component coordination

Main classes:
- ConsciousnessEngine: Core consciousness processing
- SelfMonitor: Self-monitoring system
- MetaCognitionEngine: Meta-cognitive processing
- AdaptationEngine: Consciousness adaptation
- ComponentBridge: Component communication
- ProtocolAdapter: Protocol translation
- SystemCoordinator: Overall system coordination
"""

from .consciousness_engine import (
    ConsciousnessEngine,
    ConsciousnessState,
    SystemState,
    process_with_consciousness,
    get_consciousness_status,
    reflect_on_consciousness
)

from .awareness_modules import (
    AwarenessState,
    SelfMonitor,
    MetaCognitionEngine,
    AdaptationEngine,
    monitor_consciousness,
    analyze_thinking,
    suggest_adaptation,
    get_awareness_status
)

from .integration_layer import (
    ComponentStatus,
    ComponentInfo,
    ComponentBridge,
    ProtocolAdapter,
    SystemCoordinator,
    initialize_aetherium_system,
    process_integration_request,
    get_integration_status
)

__version__ = "1.0.0"
__author__ = "Project Emergence"

# Initialize the system when imported
try:
    initialize_aetherium_system()
except:
    pass  # Handle gracefully if initialization fails
