import { SchoolLevel } from '@/types/profile';

export const SUBJECTS_BY_LEVEL: Record<SchoolLevel, string[]> = {
  'vmbo-b': [
    'Nederlands', 'Engels', 'Duits', 'Frans', 'Wiskunde',
    'Nask 1', 'Biologie', 'Geschiedenis', 'Aardrijkskunde', 'Economie',
    'Maatschappijleer', 'Lichamelijke opvoeding', 'Informatica',
    'Techniek', 'Zorg en Welzijn', 'Verzorging',
  ],
  'vmbo-k': [
    'Nederlands', 'Engels', 'Duits', 'Frans', 'Wiskunde',
    'Nask 1', 'Nask 2', 'Biologie', 'Geschiedenis', 'Aardrijkskunde', 'Economie',
    'Maatschappijleer', 'Lichamelijke opvoeding', 'Informatica',
    'Techniek', 'Zorg en Welzijn', 'Verzorging',
  ],
  'vmbo-gt': [
    'Nederlands', 'Engels', 'Duits', 'Frans', 'Wiskunde',
    'Nask 1', 'Nask 2', 'Biologie', 'Geschiedenis', 'Aardrijkskunde', 'Economie',
    'Maatschappijleer', 'Lichamelijke opvoeding', 'Informatica',
    'Techniek', 'Zorg en Welzijn',
  ],
  'havo': [
    'Nederlands', 'Engels', 'Duits', 'Frans', 'Spaans',
    'Wiskunde A', 'Wiskunde B', 'Wiskunde C',
    'Natuurkunde', 'Scheikunde', 'Biologie',
    'Economie', 'Bedrijfseconomie', 'Management & Organisatie',
    'Geschiedenis', 'Aardrijkskunde', 'Maatschappijwetenschappen', 'Maatschappijleer',
    'Informatica', 'Lichamelijke opvoeding',
    'Kunstgeschiedenis', 'Muziek', 'Tekenen',
  ],
  'atheneum': [
    'Nederlands', 'Engels', 'Duits', 'Frans', 'Spaans',
    'Wiskunde A', 'Wiskunde B', 'Wiskunde C', 'Wiskunde D',
    'Natuurkunde', 'Scheikunde', 'Biologie',
    'Economie', 'Bedrijfseconomie', 'Management & Organisatie',
    'Geschiedenis', 'Aardrijkskunde', 'Maatschappijwetenschappen', 'Maatschappijleer',
    'Informatica', 'Lichamelijke opvoeding', 'Filosofie',
    'Kunstgeschiedenis', 'Muziek', 'Tekenen',
  ],
  'gymnasium': [
    'Nederlands', 'Engels', 'Duits', 'Frans', 'Spaans',
    'Latijn', 'Grieks',
    'Wiskunde A', 'Wiskunde B', 'Wiskunde C', 'Wiskunde D',
    'Natuurkunde', 'Scheikunde', 'Biologie',
    'Economie', 'Bedrijfseconomie', 'Management & Organisatie',
    'Geschiedenis', 'Aardrijkskunde', 'Maatschappijwetenschappen', 'Maatschappijleer',
    'Informatica', 'Lichamelijke opvoeding', 'Filosofie',
    'Kunstgeschiedenis', 'Muziek', 'Tekenen',
  ],
};
