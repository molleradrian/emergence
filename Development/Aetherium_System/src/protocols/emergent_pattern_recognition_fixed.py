# Import Aetherium consciousness core
try:
    # Try absolute imports first (for when run as module)
    from consciousness_engine import process_with_consciousness
    from awareness_modules import analyze_thinking, monitor_consciousness
    CONSCIOUSNESS_AVAILABLE = True
except ImportError:
    try:
        # Try relative imports (for when run from within package)
        from ..core.consciousness_engine import process_with_consciousness
        from ..core.awareness_modules import analyze_thinking, monitor_consciousness
        CONSCIOUSNESS_AVAILABLE = True
    except ImportError:
        # Fallback for standalone execution
        import sys
        import os
        sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'core'))
        try:
            from consciousness_engine import process_with_consciousness
            from awareness_modules import analyze_thinking, monitor_consciousness
            CONSCIOUSNESS_AVAILABLE = True
        except ImportError:
            CONSCIOUSNESS_AVAILABLE = False
            logging.warning("Consciousness core not available, running in limited mode")
