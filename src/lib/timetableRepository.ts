import type { ScheduledClass, TimetableVersion } from '../types/schedule';
import { supabase } from './supabase';

function requireClient() {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.');
  return supabase;
}

function fromRow(row: any): TimetableVersion {
  return {
    id: row.id,
    version: row.version_label ?? 'v1',
    name: row.name,
    type: row.type,
    timestamp: row.created_at ? new Date(row.created_at).toLocaleString() : new Date().toLocaleString(),
    fitness: Number(row.fitness ?? 0),
    hardViolations: Number(row.hard_violations ?? 0),
    softPenalties: Number(row.soft_penalties ?? 0),
    generation: Number(row.generation ?? 0),
    isLive: Boolean(row.is_live),
    notes: row.notes ?? '',
    schedule: (row.schedule ?? []) as ScheduledClass[],
    cohort: row.cohort,
  };
}

export async function listSavedTimetables(): Promise<TimetableVersion[]> {
  const client = requireClient();
  const { data, error } = await client.from('timetables').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function saveTimetableVersion(version: TimetableVersion, activate: boolean): Promise<TimetableVersion> {
  const client = requireClient();
  const { data: inserted, error: insertError } = await client
    .from('timetables')
    .insert({
      name: version.name,
      cohort: version.cohort ?? 'Div A',
      version_label: version.version,
      type: version.type,
      fitness: version.fitness,
      hard_violations: version.hardViolations,
      soft_penalties: version.softPenalties,
      generation: version.generation,
      is_live: false,
      notes: version.notes ?? null,
      schedule: version.schedule ?? [],
    })
    .select('*')
    .single();
  if (insertError) throw insertError;

  if (activate) {
    const { error: clearError } = await client.from('timetables').update({ is_live: false }).neq('id', inserted.id);
    if (clearError) throw clearError;
    const { data: activated, error: activateError } = await client.from('timetables').update({ is_live: true }).eq('id', inserted.id).select('*').single();
    if (activateError) throw activateError;
    return fromRow(activated);
  }
  return fromRow(inserted);
}

export async function activateSavedTimetable(id: string): Promise<void> {
  const client = requireClient();
  const { error: clearError } = await client.from('timetables').update({ is_live: false }).neq('id', id);
  if (clearError) throw clearError;
  const { error } = await client.from('timetables').update({ is_live: true }).eq('id', id);
  if (error) throw error;
}
