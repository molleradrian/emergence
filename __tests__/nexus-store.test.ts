import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VesselStore } from '../src/lib/nexus-store';

// Define mocks before imports
const { mockSupabase } = vi.hoisted(() => {
    return {
        mockSupabase: {
            from: vi.fn(),
            channel: vi.fn(() => ({
                on: vi.fn(() => ({
                    subscribe: vi.fn(),
                })),
            })),
        }
    };
});

vi.mock('../src/lib/supabase', () => ({
    supabase: mockSupabase,
}));

describe('VesselStore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch all vessels', async () => {
        const mockVessels = [{ id: '1', name: 'Daystrom' }];
        
        // Setup the chain: supabase.from('vessels').select('*').order('name')
        const mockOrder = vi.fn().mockResolvedValue({ data: mockVessels, error: null });
        const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
        
        mockSupabase.from.mockReturnValue({ select: mockSelect });

        const vessels = await VesselStore.getAll();

        expect(mockSupabase.from).toHaveBeenCalledWith('vessels');
        expect(mockSelect).toHaveBeenCalledWith('*');
        expect(mockOrder).toHaveBeenCalledWith('name');
        expect(vessels).toEqual(mockVessels);
    });

    it('should handle errors when fetching vessels by returning mock data', async () => {
        const mockOrder = vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } });
        const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
        mockSupabase.from.mockReturnValue({ select: mockSelect });

        const vessels = await VesselStore.getAll();

        // Should return mock vessels per resilience protocol
        expect(vessels.length).toBeGreaterThan(0);
        expect(vessels[0].name).toBe('Daystrom');
    });
});