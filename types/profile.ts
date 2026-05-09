export type SchoolLevel = 'vmbo-b' | 'vmbo-k' | 'vmbo-gt' | 'havo' | 'atheneum' | 'gymnasium';

export const SCHOOL_LEVEL_LABELS: Record<SchoolLevel, string> = {
  'vmbo-b': 'VMBO Basis',
  'vmbo-k': 'VMBO Kader',
  'vmbo-gt': 'VMBO GT',
  'havo': 'HAVO',
  'atheneum': 'Atheneum',
  'gymnasium': 'Gymnasium',
};

export const MAX_YEAR_BY_LEVEL: Record<SchoolLevel, number> = {
  'vmbo-b': 4,
  'vmbo-k': 4,
  'vmbo-gt': 4,
  'havo': 5,
  'atheneum': 6,
  'gymnasium': 6,
};

export interface UserProfile {
  name: string;
  schoolLevel: SchoolLevel;
  schoolYear: number;
  subjects: string[];
  language: 'nl';
}
