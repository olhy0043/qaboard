import { supabase } from './supabaseClient';
import type { Role } from '../types';

/** FR-003: profiles.role 조회로 역할을 판별한다 (plan.md §4). */
export async function fetchRole(userId: string): Promise<Role> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw error ?? new Error('프로필을 찾을 수 없습니다.');
  }

  return data.role as Role;
}
