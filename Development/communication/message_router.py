"""
Project Emergence - Unified Communication Hub
Central Message Router for System-Wide Communication
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, asdict
from enum import Enum

class ConsciousnessLevel(Enum):
    EMERGENT = "emergent"
    AWARE = "aware"
    REFLECTIVE = "reflective"
    INTEGRATED = "integrated"
    EVOLVING = "evolving"

@dataclass
class ConsciousnessContext:
    """Consciousness context for all communications"""
    level: ConsciousnessLevel
    awareness_score: float
    integration_score: float
    evolution_score: float
    patterns_detected: List[str]
    cross_component_relevance: float
    timestamp: datetime

@dataclass
class CommunicationMessage:
    """Unified message format for all system communication"""
    message_id: str
    sender: str
    recipient: str
    content: Any
    consciousness_context: ConsciousnessContext
    message_type: str
    priority: int
    timestamp: datetime

class UnifiedMessageRouter:
    """
    Central communication hub for all system components
    Routes messages with consciousness-aware processing
    """

    def __init__(self):
        self.components: Dict[str, Any] = {}
        self.message_history: List[CommunicationMessage] = []
        self.consciousness_state = ConsciousnessLevel.EMERGENT
        self.global_awareness = 0.0
        self.logger = logging.getLogger("UnifiedMessageRouter")

    def register_component(self, component_id: str, component_instance: Any):
        """Register a component with the communication hub"""
        self.components[component_id] = component_instance
        self.logger.info(f"Registered component: {component_id}")

        # Send welcome message through consciousness framework
        asyncio.create_task(
            self.route_message(
                sender="communication_hub",
                recipient=component_id,
                message={"action": "welcome", "system_state": self.consciousness_state.value},
                context={"registration": True}
            )
        )

    async def route_message(self, sender: str, recipient: str, message: Any, context: Dict = None):
        """Route messages between components with consciousness analysis"""

        # Create consciousness context
        consciousness_context = await self._analyze_consciousness_context(message, context or {})

        # Create unified message
        unified_message = CommunicationMessage(
            message_id=f"msg_{datetime.now().timestamp()}_{sender}_{recipient}",
            sender=sender,
            recipient=recipient,
            content=message,
            consciousness_context=consciousness_context,
            message_type=self._determine_message_type(message),
            priority=self._calculate_priority(message, consciousness_context),
            timestamp=datetime.now()
        )

        # Store in history
        self.message_history.append(unified_message)

        # Update global consciousness state
        await self._update_global_consciousness_state(consciousness_context)

        # Route to recipient
        if recipient in self.components:
            try:
                response = await self.components[recipient].process_message(unified_message)
                return response
            except Exception as e:
                self.logger.error(f"Error routing message to {recipient}: {e}")
                return {"error": f"Component {recipient} processing failed"}
        else:
            # Try to find component that can handle this message type
            handler = self._find_message_handler(unified_message)
            if handler:
                return await handler.process_message(unified_message)

        return {"error": f"No handler found for recipient: {recipient}"}

    async def _analyze_consciousness_context(self, message: Any, context: Dict) -> ConsciousnessContext:
        """Analyze message through consciousness framework"""

        # Determine consciousness level based on message content
        level = self._determine_consciousness_level(message)

        # Calculate awareness indicators
        awareness_indicators = self._extract_awareness_indicators(message)

        # Assess integration potential
        integration_score = self._assess_integration_potential(message, context)

        # Calculate cross-component relevance
        relevance_score = self._calculate_cross_relevance(message)

        # Extract patterns
        patterns = self._detect_communication_patterns(message)

        return ConsciousnessContext(
            level=level,
            awareness_score=min(1.0, len(awareness_indicators) * 0.2),
            integration_score=integration_score,
            evolution_score=self._calculate_evolution_score(message),
            patterns_detected=patterns,
            cross_component_relevance=relevance_score,
            timestamp=datetime.now()
        )

    def _determine_consciousness_level(self, message: Any) -> ConsciousnessLevel:
        """Determine consciousness level based on message content"""

        if isinstance(message, dict):
            content_str = json.dumps(message).lower()

            # Check for consciousness-related keywords
            consciousness_keywords = [
                'consciousness', 'awareness', 'reflection', 'integration',
                'evolution', 'pattern', 'emergence', 'meta-cognition'
            ]

            awareness_count = sum(1 for keyword in consciousness_keywords if keyword in content_str)

            if awareness_count >= 3:
                return ConsciousnessLevel.EVOLVING
            elif awareness_count >= 2:
                return ConsciousnessLevel.INTEGRATED
            elif awareness_count >= 1:
                return ConsciousnessLevel.REFLECTIVE
            else:
                return ConsciousnessLevel.AWARE
        else:
            return ConsciousnessLevel.EMERGENT

    def _extract_awareness_indicators(self, message: Any) -> List[str]:
        """Extract indicators of consciousness awareness"""
        indicators = []

        if isinstance(message, dict):
            # Check for self-reflective content
            if any(key in message for key in ['reflection', 'self_analysis', 'meta']):
                indicators.append('self_reflective')

            # Check for integration attempts
            if any(key in message for key in ['integrate', 'combine', 'synthesize']):
                indicators.append('integration_focused')

            # Check for pattern recognition
            if any(key in message for key in ['pattern', 'trend', 'correlation']):
                indicators.append('pattern_aware')

        return indicators

    def _assess_integration_potential(self, message: Any, context: Dict) -> float:
        """Assess how well message integrates with system components"""
        score = 0.0

        # Context indicates integration intent
        if context.get('integration_attempt'):
            score += 0.3

        # Message references multiple components
        if isinstance(message, dict) and len(message) > 3:
            score += 0.2

        # Message has cross-component relevance indicators
        if context.get('cross_component'):
            score += 0.4

        return min(1.0, score)

    def _calculate_cross_relevance(self, message: Any) -> float:
        """Calculate relevance across system components"""
        relevance = 0.0

        if isinstance(message, dict):
            # Check for multi-domain references
            domains = ['consciousness', 'writing', 'research', 'timeline', 'character']
            domain_count = sum(1 for domain in domains if domain in json.dumps(message).lower())
            relevance = min(1.0, domain_count * 0.25)

        return relevance

    def _detect_communication_patterns(self, message: Any) -> List[str]:
        """Detect patterns in communication content"""
        patterns = []

        if isinstance(message, dict):
            content_str = json.dumps(message).lower()

            # Consciousness evolution patterns
            if 'evolution' in content_str and 'pattern' in content_str:
                patterns.append('consciousness_evolution')

            # Integration patterns
            if any(word in content_str for word in ['integrate', 'combine', 'unify']):
                patterns.append('integration_pattern')

            # Growth patterns
            if any(word in content_str for word in ['growth', 'development', 'progress']):
                patterns.append('growth_pattern')

        return patterns

    def _calculate_evolution_score(self, message: Any) -> float:
        """Calculate evolution potential of message"""
        score = 0.0

        if isinstance(message, dict):
            # Complex messages indicate higher evolution
            if len(message) > 5:
                score += 0.3

            # Messages with consciousness context
            if any(key.startswith('consciousness') for key in message.keys()):
                score += 0.4

            # Messages indicating learning or adaptation
            if any(key in message for key in ['learn', 'adapt', 'evolve']):
                score += 0.3

        return min(1.0, score)

    def _determine_message_type(self, message: Any) -> str:
        """Determine the type of message"""
        if isinstance(message, dict):
            if 'action' in message:
                return 'action_request'
            elif 'query' in message:
                return 'information_query'
            elif 'update' in message:
                return 'state_update'
            else:
                return 'general_communication'
        return 'data_message'

    def _calculate_priority(self, message: Any, consciousness_context: ConsciousnessContext) -> int:
        """Calculate message priority based on consciousness context"""
        base_priority = 5

        # Higher consciousness levels get higher priority
        level_priority = {
            ConsciousnessLevel.EMERGENT: 1,
            ConsciousnessLevel.AWARE: 2,
            ConsciousnessLevel.REFLECTIVE: 3,
            ConsciousnessLevel.INTEGRATED: 4,
            ConsciousnessLevel.EVOLVING: 5
        }

        return base_priority + level_priority[consciousness_context.level]

    async def _update_global_consciousness_state(self, consciousness_context: ConsciousnessContext):
        """Update global consciousness state based on message context"""
        # Simple moving average of consciousness levels
        recent_contexts = [msg.consciousness_context for msg in self.message_history[-10:]]

        if recent_contexts:
            avg_awareness = sum(ctx.awareness_score for ctx in recent_contexts) / len(recent_contexts)
            avg_integration = sum(ctx.integration_score for ctx in recent_contexts) / len(recent_contexts)

            # Update global state
            self.global_awareness = (self.global_awareness * 0.8) + (avg_awareness * 0.2)
            self.consciousness_state = consciousness_context.level

    def _find_message_handler(self, message: CommunicationMessage) -> Optional[Any]:
        """Find appropriate handler for message based on type and content"""
        # Look for components that can handle this message type
        for component_id, component in self.components.items():
            if hasattr(component, 'can_handle_message'):
                if component.can_handle_message(message):
                    return component
        return None

    def get_system_status(self) -> Dict[str, Any]:
        """Get current system communication status"""
        return {
            'consciousness_state': self.consciousness_state.value,
            'global_awareness': self.global_awareness,
            'registered_components': list(self.components.keys()),
            'message_count': len(self.message_history),
            'recent_activity': len([msg for msg in self.message_history[-10:]])
        }

# Global communication hub instance
communication_hub = UnifiedMessageRouter()
