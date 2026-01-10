/**
 * @fileOverview Simulation Models
 * 
 * This file contains the implementation of the simulation models.
 */

export interface Agent {
    id: number;
    x: number;
    y: number;
}

export class BasicAgentModel {
    private agents: Agent[] = [];
    private gridSize: number;

    constructor(numAgents: number, gridSize: number) {
        this.gridSize = gridSize;
        for (let i = 0; i < numAgents; i++) {
            this.agents.push({
                id: i,
                x: Math.floor(Math.random() * gridSize),
                y: Math.floor(Math.random() * gridSize),
            });
        }
    }

    public runStep() {
        for (const agent of this.agents) {
            agent.x += Math.floor(Math.random() * 3) - 1;
            agent.y += Math.floor(Math.random() * 3) - 1;

            // Clamp position to grid
            agent.x = Math.max(0, Math.min(this.gridSize - 1, agent.x));
            agent.y = Math.max(0, Math.min(this.gridSize - 1, agent.y));
        }
    }

    public getAgents(): Agent[] {
        return this.agents;
    }
}
