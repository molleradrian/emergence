import { describe, test, expect } from "vitest";
import { EmergenceMath, EmergenceState } from "../src/emergenceMath";

describe("EmergenceMath", () => {
    const initialState = new EmergenceState(0, {
        valence: 0,
        persistence: 0.1,
        grounding: 0.2,
        source: 0,
        clarity: 0.5,
        associations: 0
    });

    test("infuse: should transform from potential (0) to presence (1)", () => {
        const stimulus = { valence: 0.8, grounding: 0.5 };
        const result = EmergenceMath.infuse(initialState, stimulus);

        expect(result.value).toBe(1);
        expect(result.genesisType).toBe("infusion");
        expect(result.context.valence).toBeGreaterThan(0.4); // Weighted average
    });

    test("collapse: should return from presence (1) to potential (0)", () => {
        const activeState = new EmergenceState(1, {
            valence: 0.8,
            persistence: 0.8,
            grounding: 0.5,
            source: 1.0,
            clarity: 0.8,
            associations: 5
        });

        const result = EmergenceMath.collapse(activeState, { valence: -0.5 });

        expect(result.value).toBe(0);
        expect(result.genesisType).toBe("collapse");
        expect(result.context.persistence).toBeLessThan(0.8);
    });

    test("merge: should amplify if coherent", () => {
        const sA = new EmergenceState(1, {
            valence: 0.7,
            persistence: 0.6,
            grounding: 0.3,
            source: 1.0,
            clarity: 0.6,
            associations: 2
        });
        const sB = new EmergenceState(1, {
            valence: 0.8,
            persistence: 0.6,
            grounding: 0.4,
            source: 1.0,
            clarity: 0.6,
            associations: 3
        });

        const result = EmergenceMath.merge(sA, sB);

        expect(result.value).toBe(1);
        expect(result.genesisType).toBe("merge");
        expect(result.context.associations).toBeGreaterThan(5);
    });
});
