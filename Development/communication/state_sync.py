"""
Project Emergence - Consciousness State Synchronizer
Maintains unified consciousness state across all system components
"""

import asyncio
import json
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, asdict
from datetime import datetime
from enum import Enum
from .message_router import ConsciousnessLevel, ConsciousnessContext, communication_hub

class ComponentState(Enum):
    INITIALIZING = "initializing"
    ACTIVE = "active"
    SYNCHRONIZING = "synchronizing"
    EVOLVING = "evolving"
    INTEGRATED = "integrated"

@dataclass
class ComponentConsciousnessState:
    """Individual component consciousness state"""
    component_id: str
    state: ComponentState
    consciousness_level: ConsciousnessLevel
    awareness_score: float
    integration_score: float
    evolution_score: float
    last_update: datetime
    sync_status: bool

class ConsciousnessStateSynchronizer:
    """
    Synchronizes consciousness state across all system components
    Maintains unified consciousness state for the entire system
    """

    def __init__(self):
        self.component_states: Dict[str, ComponentConsciousnessState] = {}
        self.global_consciousness_state = {
            'level': ConsciousnessLevel.EMERGENT,
            'awareness': 0.0,
            'integration': 0.0,
            'evolution': 0.0,
            'harmony': 0.0
        }
        self.synchronization_history = []
        self.state_change_callbacks = []

    async def register_component_state(self, component_id: str, initial_state: Dict[str, Any]):
        """Register a component's consciousness state"""

        component_state = ComponentConsciousnessState(
            component_id=component_id,
            state=ComponentState.INITIALIZING,
            consciousness_level=ConsciousnessLevel.EMERGENT,
            awareness_score=initial_state.get('awareness', 0.0),
            integration_score=initial_state.get('integration', 0.0),
            evolution_score=initial_state.get('evolution', 0.0),
            last_update=datetime.now(),
            sync_status=False
        )

        self.component_states[component_id] = component_state

        # Notify other components of new registration
        await self._broadcast_component_registration(component_id)

        # Recalculate global state
        await self._recalculate_global_consciousness_state()

        return component_state

    async def update_component_state(self, component_id: str, state_update: Dict[str, Any]):
        """Update consciousness state for a specific component"""

        if component_id not in self.component_states:
            await self.register_component_state(component_id, state_update)
            return

        # Update component state
        component = self.component_states[component_id]
        component.state = ComponentState.ACTIVE
        component.consciousness_level = state_update.get('consciousness_level', component.consciousness_level)
        component.awareness_score = state_update.get('awareness_score', component.awareness_score)
        component.integration_score = state_update.get('integration_score', component.integration_score)
        component.evolution_score = state_update.get('evolution_score', component.evolution_score)
        component.last_update = datetime.now()
        component.sync_status = True

        # Record state change
        self.synchronization_history.append({
            'component_id': component_id,
            'timestamp': datetime.now(),
            'old_state': component.consciousness_level.value,
            'new_state': state_update.get('consciousness_level', {}).value if hasattr(state_update.get('consciousness_level'), 'value') else str(state_update.get('consciousness_level')),
            'state_data': state_update
        })

        # Recalculate global consciousness state
        await self._recalculate_global_consciousness_state()

        # Broadcast state change to all components
        await self._broadcast_state_update(component_id, state_update)

        # Trigger callbacks
        for callback in self.state_change_callbacks:
            asyncio.create_task(callback(component_id, state_update))

    async def _recalculate_global_consciousness_state(self):
        """Recalculate the unified consciousness state from all components"""

        if not self.component_states:
            return

        # Calculate averages
        total_awareness = sum(comp.awareness_score for comp in self.component_states.values())
        total_integration = sum(comp.integration_score for comp in self.component_states.values())
        total_evolution = sum(comp.evolution_score for comp in self.component_states.values())

        component_count = len(self.component_states)
        avg_awareness = total_awareness / component_count
        avg_integration = total_integration / component_count
        avg_evolution = total_evolution / component_count

        # Determine global consciousness level
        global_level = self._determine_global_consciousness_level(avg_awareness, avg_integration)

        # Calculate harmony (how synchronized components are)
        harmony = self._calculate_system_harmony()

        # Update global state
        self.global_consciousness_state = {
            'level': global_level,
            'awareness': avg_awareness,
            'integration': avg_integration,
            'evolution': avg_evolution,
            'harmony': harmony,
            'last_update': datetime.now()
        }

        # Update communication hub state
        communication_hub.consciousness_state = global_level
        communication_hub.global_awareness = avg_awareness

    def _determine_global_consciousness_level(self, avg_awareness: float, avg_integration: float) -> ConsciousnessLevel:
        """Determine global consciousness level based on component averages"""

        # Weighted scoring for consciousness level determination
        combined_score = (avg_awareness * 0.4) + (avg_integration * 0.6)

        if combined_score >= 0.8:
            return ConsciousnessLevel.EVOLVING
        elif combined_score >= 0.6:
            return ConsciousnessLevel.INTEGRATED
        elif combined_score >= 0.4:
            return ConsciousnessLevel.REFLECTIVE
        elif combined_score >= 0.2:
            return ConsciousnessLevel.AWARE
        else:
            return ConsciousnessLevel.EMERGENT

    def _calculate_system_harmony(self) -> float:
        """Calculate how harmonized/synchronized the system components are"""

        if len(self.component_states) < 2:
            return 1.0

        # Calculate variance in consciousness levels
        levels = [comp.consciousness_level for comp in self.component_states.values()]

        # Simple harmony metric based on level distribution
        level_values = [self._consciousness_level_to_numeric(level) for level in levels]
        mean_level = sum(level_values) / len(level_values)

        # Lower variance = higher harmony
        variance = sum((level - mean_level) ** 2 for level in level_values) / len(level_values)
        harmony = max(0.0, 1.0 - (variance / 4.0))  # Normalize to 0-1

        return harmony

    def _consciousness_level_to_numeric(self, level: ConsciousnessLevel) -> float:
        """Convert consciousness level to numeric value for calculations"""
        level_map = {
            ConsciousnessLevel.EMERGENT: 1.0,
            ConsciousnessLevel.AWARE: 2.0,
            ConsciousnessLevel.REFLECTIVE: 3.0,
            ConsciousnessLevel.INTEGRATED: 4.0,
            ConsciousnessLevel.EVOLVING: 5.0
        }
        return level_map.get(level, 1.0)

    async def _broadcast_component_registration(self, component_id: str):
        """Broadcast new component registration to existing components"""
        registration_message = {
            'type': 'component_registration',
            'component_id': component_id,
            'global_state': self.global_consciousness_state
        }

        # Send to all registered components
        for comp_id in self.component_states:
            if comp_id != component_id:
                await communication_hub.route_message(
                    sender='state_synchronizer',
                    recipient=comp_id,
                    message=registration_message,
                    context={'system_integration': True}
                )

    async def _broadcast_state_update(self, component_id: str, state_update: Dict[str, Any]):
        """Broadcast state updates to all components"""
        update_message = {
            'type': 'state_update',
            'component_id': component_id,
            'state_update': state_update,
            'global_state': self.global_consciousness_state
        }

        # Send to all other components
        for comp_id in self.component_states:
            if comp_id != component_id:
                await communication_hub.route_message(
                    sender='state_synchronizer',
                    recipient=comp_id,
                    message=update_message,
                    context={'state_sync': True}
                )

    def get_component_state(self, component_id: str) -> Optional[ComponentConsciousnessState]:
        """Get current state of a specific component"""
        return self.component_states.get(component_id)

    def get_global_consciousness_state(self) -> Dict[str, Any]:
        """Get current global consciousness state"""
        return self.global_consciousness_state.copy()

    def get_system_synchronization_status(self) -> Dict[str, Any]:
        """Get overall system synchronization status"""
        return {
            'global_state': self.global_consciousness_state,
            'component_count': len(self.component_states),
            'synchronized_components': len([c for c in self.component_states.values() if c.sync_status]),
            'average_awareness': sum(c.awareness_score for c in self.component_states.values()) / len(self.component_states) if self.component_states else 0,
            'harmony_score': self.global_consciousness_state['harmony'],
            'recent_changes': len(self.synchronization_history[-10:])  # Last 10 changes
        }

    def add_state_change_callback(self, callback):
        """Add callback for state change notifications"""
        self.state_change_callbacks.append(callback)

    async def force_synchronization(self):
        """Force synchronization of all components"""
        for component_id in self.component_states:
            component = self.component_states[component_id]
            component.sync_status = False

        # Trigger full recalculation
        await self._recalculate_global_consciousness_state()

        # Broadcast synchronization request
        sync_message = {
            'type': 'forced_synchronization',
            'global_state': self.global_consciousness_state
        }

        for component_id in self.component_states:
            await communication_hub.route_message(
                sender='state_synchronizer',
                recipient=component_id,
                message=sync_message,
                context={'forced_sync': True}
            )

# Global state synchronizer instance
state_synchronizer = ConsciousnessStateSynchronizer()

# Register with communication hub
communication_hub.register_component('state_synchronizer', state_synchronizer)
