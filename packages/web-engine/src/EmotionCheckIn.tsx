// src/EmotionCheckIn.tsx - E-Motion check-in component
import React, { useState } from "react";
import { invokeEmergenceFlow } from "./GenkitClient";
import type { ContextMatrix, EmergenceResponse } from "./GenkitClient";
import type { HistoryEntry } from "./emergenceFlow";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { GENESIS_HISTORY } from "./genesisHistory";

interface EmotionState {
    feeling: string;
    intensity: number;
    persistence: number;
    grounding: number;
    clarity: number;
    notes: string;
}

export const EmotionCheckIn: React.FC<{ onResult?: (res: EmergenceResponse) => void }> = ({ onResult }) => {
    const [state, setState] = useState<EmotionState>({
        feeling: "",
        intensity: 0.5,
        persistence: 0.5,
        grounding: 0.5,
        clarity: 0.5,
        notes: "",
    });

    const [result, setResult] = useState<EmergenceResponse | null>(null);
    const [history, setHistory] = useState(GENESIS_HISTORY);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const feelings = [
        "calm",
        "energized",
        "anxious",
        "focused",
        "overwhelmed",
        "peaceful",
        "excited",
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const matrix: ContextMatrix = {
            I_vec: `Sovereign Check-in: ${state.feeling}`,
            E_vec: state.intensity,
            H_log: history,
            D_pot: state.grounding,
            context: {
                persistence: state.persistence,
                clarity: state.clarity
            }
        };

        try {
            const response = await invokeEmergenceFlow(matrix);
            setResult(response);
            if (response.new_entry) {
                setHistory([...history, response.new_entry as HistoryEntry]);
            }
            if (onResult) onResult(response);
        } catch (error) {
            console.error("Check-in failed:", error);
            // Fallback to a neutral "ERROR" state representation
            setResult({
                state: -1,
                result: "SYSTEM_ERROR",
                context: {
                    valence: 0,
                    grounding: 0,
                    persistence: 0,
                    clarity: 0,
                    source: 0,
                    associations: 0
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getChartData = (ctx: any) => [
        { subject: 'Valence', A: ctx.valence, fullMark: 1 },
        { subject: 'Persistence', A: ctx.persistence, fullMark: 1 },
        { subject: 'Grounding', A: ctx.grounding, fullMark: 1 },
        { subject: 'Clarity', A: ctx.clarity, fullMark: 1 },
        { subject: 'Source', A: ctx.source, fullMark: 1 },
        { subject: 'Assoc', A: Math.min(ctx.associations / 10, 1), fullMark: 1 },
    ];

    return (
        <div className="emotion-checkin">
            <h2>E-Motion Check-In</h2>
            <p className="description">
                Map your current volatility to the Contextual Matrix.
            </p>

            <form onSubmit={handleSubmit} className="checkin-form">
                <div className="form-group">
                    <label htmlFor="feeling">How are you feeling?</label>
                    <select
                        id="feeling"
                        value={state.feeling}
                        onChange={(e) => setState({ ...state, feeling: e.target.value })}
                        required
                    >
                        <option value="">-- Select --</option>
                        {feelings.map((f) => (
                            <option key={f} value={f}>
                                {f}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="intensity">Intensity (Valence): {state.intensity.toFixed(2)}</label>
                    <input
                        id="intensity"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={state.intensity}
                        onChange={(e) =>
                            setState({ ...state, intensity: parseFloat(e.target.value) })
                        }
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="persistence">Persistence: {state.persistence.toFixed(2)}</label>
                    <input
                        id="persistence"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={state.persistence}
                        onChange={(e) =>
                            setState({ ...state, persistence: parseFloat(e.target.value) })
                        }
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="grounding">Grounding (D_pot): {state.grounding.toFixed(2)}</label>
                    <input
                        id="grounding"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={state.grounding}
                        onChange={(e) =>
                            setState({ ...state, grounding: parseFloat(e.target.value) })
                        }
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="clarity">Clarity: {state.clarity.toFixed(2)}</label>
                    <input
                        id="clarity"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={state.clarity}
                        onChange={(e) =>
                            setState({ ...state, clarity: parseFloat(e.target.value) })
                        }
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Notes (Optional)</label>
                    <textarea
                        id="notes"
                        rows={3}
                        value={state.notes}
                        onChange={(e) => setState({ ...state, notes: e.target.value })}
                        placeholder="What is influencing your field today?"
                    />
                </div>

                <button type="submit" disabled={isSubmitting} className="checkin-button">
                    {isSubmitting ? "Processing..." : "Submit Check-In"}
                </button>
            </form>

            {result && (
                <div className={`result ${result.result.toLowerCase()}`}>
                    <strong>System State: {result.result}</strong>
                    <div className="grounding-meter">
                        <label>Groundedness: {(result.context.grounding * 100).toFixed(0)}%</label>
                        <div className="meter-bar" style={{ width: '100%', height: 10, background: '#eee', marginTop: 5 }}>
                            <div style={{ width: `${result.context.grounding * 100}%`, height: '100%', background: result.context.grounding > 0.8 ? '#28a745' : '#ffc107' }}></div>
                        </div>
                    </div>
                    {result.result === "PROTECTIVE_STATE" && (
                        <p className="result-description">High volatility detected. The system recommends rest and grounding practices.</p>
                    )}
                    {result.result === "COLLAPSE_PROTOCOL" && (
                        <p className="result-description">Low directive potential. Conserve energy and focus on essential tasks.</p>
                    )}
                    {result.result === "OPTIMIZED_STATE" && (
                        <p className="result-description">Harmonious emergence achieved. Direct focus toward creative synthesis.</p>
                    )}

                    {/* Phase 4: Context Vector Visualization */}
                    <div className="vector-container" style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getChartData(result.context)}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 1]} />
                                <Radar
                                    name="Emergence Context"
                                    dataKey="A"
                                    stroke="#8884d8"
                                    fill="#8884d8"
                                    fillOpacity={0.6}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="context-metrics">
                        <div className="metric-item">
                            <span className="metric-label">Persistence</span>
                            <span className="metric-value">{result.context.persistence.toFixed(3)}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Clarity</span>
                            <span className="metric-value">{result.context.clarity.toFixed(3)}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Source</span>
                            <span className="metric-value">{result.context.source.toFixed(1)}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Entropy</span>
                            <span className="metric-value">{(1 - result.context.grounding).toFixed(3)}</span>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};