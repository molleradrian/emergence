import type { GraphNode, GraphLink, Project } from './types';

export class GraphEngine {
    canvas: HTMLCanvasElement | null = null;
    ctx: CanvasRenderingContext2D | null = null;
    nodes: GraphNode[] = [];
    links: GraphLink[] = [];
    width: number = 0;
    height: number = 0;
    animationId: number | null = null;

    // Interaction state
    draggedNode: GraphNode | null = null;
    hoveredNode: GraphNode | null = null;
    selectedNode: GraphNode | null = null;
    offset: { x: number; y: number } = { x: 0, y: 0 };
    isDragging: boolean = false;
    lastMouse: { x: number; y: number } = { x: 0, y: 0 };

    onNodeSelected: ((node: GraphNode) => void) | null = null;
    emergenceState: any = null;

    setEmergenceState(state: any) {
        this.emergenceState = state;
        // Optionally trigger a visual "burst" or pulse when state changes
        console.log(`[GraphEngine] System Emergence State: ${state.result}`);
    }

    init(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.resize();

        // Mouse Events
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.onMouseUp());
        this.canvas.addEventListener('wheel', () => this.onWheel());

        this.animate();
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    resize() {
        if (!this.canvas) return;
        const parent = this.canvas.parentElement;
        if (!parent) return;

        this.width = parent.clientWidth;
        this.height = parent.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    updateData(projects: Project[]) {
        // Keep existing positions if IDs match
        const existingNodes = new Map(this.nodes.map(n => [n.id, n]));

        this.nodes = [];
        this.links = [];

        // Create Nodes
        projects.forEach(p => {
            // Project Node
            let pNode = existingNodes.get(p.id);
            if (!pNode) {
                pNode = {
                    id: p.id,
                    type: 'PROJECT',
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    vx: 0,
                    vy: 0,
                    radius: 20,
                    color: '#ff9900', // Neon Orange
                    label: p.name,
                    data: p
                };
            } else {
                pNode.label = p.name;
                pNode.data = p;
            }
            this.nodes.push(pNode);

            // Task Nodes
            if (p.tasks) {
                p.tasks.forEach(t => {
                    let tNode = existingNodes.get(t.id);
                    if (!tNode) {
                        tNode = {
                            id: t.id,
                            type: 'TASK',
                            x: pNode!.x + (Math.random() - 0.5) * 100,
                            y: pNode!.y + (Math.random() - 0.5) * 100,
                            vx: 0,
                            vy: 0,
                            radius: 8,
                            color: t.done ? '#10b981' : '#3b82f6', // Green if done, Blue if pending
                            label: t.desc.substring(0, 15) + (t.desc.length > 15 ? '...' : ''),
                            data: t,
                            parentId: p.id
                        };
                    } else {
                        tNode.label = t.desc.substring(0, 15) + (t.desc.length > 15 ? '...' : '');
                        tNode.data = t;
                        tNode.color = t.done ? '#10b981' : '#3b82f6';
                    }
                    this.nodes.push(tNode);
                    this.links.push({ source: pNode!, target: tNode, type: 'HIERARCHY' });
                });
            }
        });

        // Semantic Links (projects with shared tags)
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const n1 = this.nodes[i];
                const n2 = this.nodes[j];
                if (n1.type === 'PROJECT' && n2.type === 'PROJECT') {
                    const tags1 = (n1.data as any).tags || [];
                    const tags2 = (n2.data as any).tags || [];
                    const shared = tags1.filter((t: string) => tags2.includes(t));
                    if (shared.length > 0) {
                        this.links.push({ source: n1, target: n2, type: 'SEMANTIC' });
                    }
                }
            }
        }
    }

    animate() {
        this.computeLayout();
        this.render();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    computeLayout() {
        const k = 100; // Ideal link length
        const centerForce = 0.05;
        const repulsion = 500;

        // Repulsion between all nodes
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const n1 = this.nodes[i];
                const n2 = this.nodes[j];
                const dx = n1.x - n2.x;
                const dy = n1.y - n2.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const force = repulsion / (dist * dist);
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;

                if (!this.draggedNode || this.draggedNode !== n1) { n1.vx += fx; n1.vy += fy; }
                if (!this.draggedNode || this.draggedNode !== n2) { n2.vx -= fx; n2.vy -= fy; }
            }
        }

        // Attraction along links
        this.links.forEach(l => {
            const dx = l.target.x - l.source.x;
            const dy = l.target.y - l.source.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = (dist - k) * 0.05;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (!this.draggedNode || this.draggedNode !== l.source) { l.source.vx += fx; l.source.vy += fy; }
            if (!this.draggedNode || this.draggedNode !== l.target) { l.target.vx -= fx; l.target.vy -= fy; }
        });

        // Center force & damping
        this.nodes.forEach(n => {
            if (this.draggedNode === n) return;

            const dx = (this.width / 2) - n.x;
            const dy = (this.height / 2) - n.y;
            n.vx += dx * centerForce;
            n.vy += dy * centerForce;

            n.vx *= 0.9; // Damping
            n.vy *= 0.9;
            n.x += n.vx * 0.1; // Time step
            n.y += n.vy * 0.1;
        });
    }

    render() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw Emergence Background Effect
        if (this.emergenceState) {
            const result = this.emergenceState.result;
            const alpha = 0.05 + (Math.sin(Date.now() / 1000) + 1) * 0.02; // Slow pulse

            let bgColor = 'rgba(0, 240, 255, 0.05)'; // Default blue
            if (result === "PROTECTIVE_STATE") bgColor = `rgba(220, 53, 69, ${alpha})`;
            else if (result === "COLLAPSE_PROTOCOL") bgColor = `rgba(255, 193, 7, ${alpha})`;
            else if (result === "OPTIMIZED_STATE") bgColor = `rgba(40, 167, 69, ${alpha})`;

            this.ctx.fillStyle = bgColor;
            this.ctx.fillRect(0, 0, this.width, this.height);

            // Add center glow
            const grad = this.ctx.createRadialGradient(
                this.width / 2, this.height / 2, 0,
                this.width / 2, this.height / 2, Math.max(this.width, this.height) / 2
            );
            grad.addColorStop(0, bgColor);
            grad.addColorStop(1, 'transparent');
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        this.ctx.save();
        this.ctx.translate(this.offset.x, this.offset.y);

        // Draw Links
        this.links.forEach(l => {
            this.ctx!.beginPath();
            this.ctx!.moveTo(l.source.x, l.source.y);
            this.ctx!.lineTo(l.target.x, l.target.y);
            
            let strokeStyle = l.type === 'HIERARCHY' ? 'rgba(255,255,255,0.2)' : 'rgba(0,240,255,0.1)';
            if (this.emergenceState && this.emergenceState.result === "OPTIMIZED_STATE") {
                strokeStyle = 'rgba(0, 240, 255, 0.3)'; // Brighter links in optimized state
            }
            
            this.ctx!.strokeStyle = strokeStyle;
            if (l.type === 'SEMANTIC') this.ctx!.setLineDash([5, 5]);
            else this.ctx!.setLineDash([]);
            this.ctx!.lineWidth = 1;
            this.ctx!.stroke();
        });

        // Draw Nodes
        this.nodes.forEach(n => {
            this.ctx!.beginPath();
            this.ctx!.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
            
            let color = n.color;
            if (this.emergenceState) {
                // Shift node colors slightly based on system valence
                const valence = this.emergenceState.context.valence;
                if (valence > 0.5) {
                    this.ctx!.shadowBlur = 15 + Math.sin(Date.now() / 500) * 5;
                }
            }
            this.ctx!.shadowColor = color;
            this.ctx!.fill();
            this.ctx!.shadowBlur = 0;

            // Label
            if (n.type === 'PROJECT' || n === this.hoveredNode) {
                this.ctx!.fillStyle = 'white';
                this.ctx!.font = '10px Inter';
                this.ctx!.fillText(n.label, n.x + 12, n.y + 4);
            }
        });

        this.ctx.restore();
    }

    // Interaction Handlers
    onMouseDown(e: MouseEvent) {
        const pos = this.getMousePos(e);
        const node = this.findNode(pos);
        if (node) {
            this.draggedNode = node;
            this.selectedNode = node;
            if (this.onNodeSelected) this.onNodeSelected(node);
        } else {
            this.isDragging = true;
            this.lastMouse = pos;
        }
    }

    onMouseMove(e: MouseEvent) {
        const pos = this.getMousePos(e);
        const node = this.findNode(pos);
        this.hoveredNode = node || null;

        if (this.draggedNode) {
            this.draggedNode.x = pos.x - this.offset.x;
            this.draggedNode.y = pos.y - this.offset.y;
            this.draggedNode.vx = 0;
            this.draggedNode.vy = 0;
        } else if (this.isDragging) {
            this.offset.x += e.clientX - this.lastMouse.x;
            this.offset.y += e.clientY - this.lastMouse.y;
            this.lastMouse = { x: e.clientX, y: e.clientY };
        }
    }

    onMouseUp() {
        this.draggedNode = null;
        this.isDragging = false;
    }

    onWheel() {
        // Zoom logic could go here
    }

    getMousePos(e: MouseEvent): { x: number; y: number } {
        if (!this.canvas) return { x: 0, y: 0 };
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    findNode(pos: { x: number; y: number }): GraphNode | undefined {
        const x = pos.x - this.offset.x;
        const y = pos.y - this.offset.y;
        return this.nodes.find(n => {
            const dx = n.x - x;
            const dy = n.y - y;
            return dx * dx + dy * dy < n.radius * n.radius;
        });
    }
}
