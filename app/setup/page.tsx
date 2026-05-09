'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SchoolLevel, SCHOOL_LEVEL_LABELS, MAX_YEAR_BY_LEVEL, UserProfile } from '@/types/profile';
import { SUBJECTS_BY_LEVEL } from '@/lib/subjects';
import { saveProfile, getProfile } from '@/lib/profile';

export default function SetupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>('havo');
  const [schoolYear, setSchoolYear] = useState(1);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  useEffect(() => {
    const existing = getProfile();
    if (existing) {
      setName(existing.name);
      setSchoolLevel(existing.schoolLevel);
      setSchoolYear(existing.schoolYear);
      setSelectedSubjects(existing.subjects);
    }
  }, []);

  useEffect(() => {
    const max = MAX_YEAR_BY_LEVEL[schoolLevel];
    if (schoolYear > max) setSchoolYear(max);
    setSelectedSubjects([]);
  }, [schoolLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  const availableSubjects = SUBJECTS_BY_LEVEL[schoolLevel];
  const maxYear = MAX_YEAR_BY_LEVEL[schoolLevel];

  function toggleSubject(subject: string) {
    setSelectedSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || selectedSubjects.length === 0) return;

    const profile: UserProfile = {
      name: name.trim(),
      schoolLevel,
      schoolYear,
      subjects: selectedSubjects,
      language: 'nl',
    };
    saveProfile(profile);
    router.push('/chat');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-start justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">HomeworkAI</h1>
          <p className="text-gray-500 mt-1">Maak je profiel aan om te beginnen</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Voornaam</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Bijv. Emma"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* School level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Schoolniveau</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(SCHOOL_LEVEL_LABELS) as SchoolLevel[]).map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSchoolLevel(level)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    schoolLevel === level
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-gray-300 text-gray-700 hover:border-indigo-400'
                  }`}
                >
                  {SCHOOL_LEVEL_LABELS[level]}
                </button>
              ))}
            </div>
          </div>

          {/* School year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leerjaar</label>
            <select
              value={schoolYear}
              onChange={e => setSchoolYear(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Array.from({ length: maxYear }, (_, i) => i + 1).map(year => (
                <option key={year} value={year}>Jaar {year}</option>
              ))}
            </select>
          </div>

          {/* Subjects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vakken{' '}
              <span className="text-gray-400 font-normal">({selectedSubjects.length} geselecteerd)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableSubjects.map(subject => (
                <label
                  key={subject}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${
                    selectedSubjects.includes(subject)
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subject)}
                    onChange={() => toggleSubject(subject)}
                    className="accent-indigo-600"
                  />
                  {subject}
                </label>
              ))}
            </div>
            {selectedSubjects.length === 0 && (
              <p className="text-sm text-red-500 mt-1">Selecteer minimaal één vak</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!name.trim() || selectedSubjects.length === 0}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Begin met leren
          </button>
        </form>
      </div>
    </div>
  );
}
