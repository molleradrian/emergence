-- SQL Migration for Aetherium Nexus v1.0
-- Run this in your Supabase SQL Editor

-- 1. Artifacts Table
CREATE TABLE IF NOT EXISTS public.artifacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    category TEXT NOT NULL DEFAULT 'insight',
    tags TEXT[] DEFAULT '{}',
    source_type TEXT NOT NULL DEFAULT 'chat',
    parent_ids UUID[] DEFAULT '{}',
    "sourceLink" TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    modified_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Vessels Table
CREATE TABLE IF NOT EXISTS public.vessels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    faculty TEXT NOT NULL,
    guild TEXT NOT NULL,
    description TEXT,
    emoji TEXT,
    status TEXT NOT NULL DEFAULT 'idle',
    capabilities TEXT[] DEFAULT '{}',
    memory TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    last_active TIMESTAMPTZ DEFAULT now()
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    directives JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. VCP Signals Table
CREATE TABLE IF NOT EXISTS public.vcp_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    signal_type TEXT NOT NULL,
    source_vessel_id TEXT NOT NULL,
    target_vessel_id TEXT,
    payload JSONB DEFAULT '{}',
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. H_log Events Table
CREATE TABLE IF NOT EXISTS public.hlog_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    history JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT now(),
    modified_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Simulations Table
CREATE TABLE IF NOT EXISTS public.simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    parameters JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Simulation Runs Table
CREATE TABLE IF NOT EXISTS public.simulation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "simulationId" UUID REFERENCES public.simulations(id),
    status TEXT NOT NULL DEFAULT 'running',
    results JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vcp_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hlog_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_runs ENABLE ROW LEVEL SECURITY;

-- Simple permissive policies for v1.0 (Restrict these in production!)
CREATE POLICY "Allow All" ON public.artifacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All" ON public.vessels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All" ON public.vcp_signals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All" ON public.hlog_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All" ON public.simulations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All" ON public.simulation_runs FOR ALL USING (true) WITH CHECK (true);
