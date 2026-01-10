export interface Character {
    id: string;
    name: string;
    archetype: string;
    traits: string[];
    arc: string;
    description: string;
}

export const characters: Character[] = [
    {
        id: 'aria-chen',
        name: 'Aria Chen',
        archetype: 'The Awakened Observer',
        traits: ['curious', 'analytical', 'empathetic'],
        arc: 'awakening',
        description: 'A neuroscientist who undergoes a consciousness awakening, bridging the gap between clinical observation and lived experience.'
    },
    {
        id: 'michael-torres',
        name: 'Michael Torres',
        archetype: 'The Shadow Integrator',
        traits: ['introspective', 'courageous', 'healer'],
        arc: 'shadow integration',
        description: 'A psychologist specializing in shadow work who must confront his own deepest fears to help others integrate their consciousness.'
    }
];
