import React from 'react';
import type { GraphNode } from '../engine/types';

interface InspectorPanelProps {
    node: GraphNode | null;
    onClose: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({ node, onClose }) => {
    if (!node) return null;

    const isProject = node.type === 'PROJECT';
    const data = node.data as any; // Cast to any to avoid TS errors for now, or use type guards

    return (
        <div className="inspector-panel">
            <div className="inspector-header">
                <h3 style={{ color: node.color }}>{isProject ? 'Project Details' : 'Task Details'}</h3>
                <button onClick={onClose} className="close-btn">×</button>
            </div>

            <div className="inspector-body">
                <h2 style={{ margin: '0 0 5px 0' }}>{node.label}</h2>
                <p className="node-id">ID: {node.id}</p>

                {isProject ? (
                    <>
                        <p style={{ fontSize: '14px', lineHeight: '1.5' }}>{data.description || 'No description available.'}</p>
                        <div style={{ marginTop: '20px' }}>
                            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Tags</h4>
                            <div className="tag-list">
                                {(data.tags || []).map((tag: string) => (
                                    <span key={tag} className="tag-badge">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => alert(`Opening Command Deck for ${node.label}...`)}
                            className="command-deck-btn"
                        >
                            Open Command Deck
                        </button>
                    </>
                ) : (
                    <>
                        <p style={{ fontSize: '14px', lineHeight: '1.5' }}>{data.desc}</p>
                        <div className="task-status">
                            <div className="status-dot" style={{
                                background: data.done ? '#10b981' : '#3b82f6'
                            }}></div>
                            <span style={{ fontSize: '12px' }}>{data.done ? 'Completed' : 'Pending'}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
