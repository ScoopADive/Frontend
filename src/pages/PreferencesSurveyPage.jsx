// src/pages/PreferencesSurveyPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import {
  fetchMyPreferences,
  createPreferences,
  updatePreferences,
} from '../api/preferences';
import { triggerAiUpdate } from '../api/ai';

const initialForm = {
  birthday: '',
  residence: '',
  budget_min: '',
  budget_max: '',
  gender: '',
  preferred_depth_range: '',
  hobbies: '',
  preferred_activities: '',
  preferred_atmosphere: '',
  last_dive_date: '',
  preferred_diving: '',
};

function PreferencesSurveyPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [prefId, setPrefId] = useState(null); // 기존 설문 id
  const [skipModalOpen, setSkipModalOpen] = useState(false); // 스킵 모달
  const navigate = useNavigate();

  // 기존 설문 있으면 불러와서 폼에 채우기
  useEffect(() => {
    const load = async () => {
      try {
        const prefs = await fetchMyPreferences();
        if (prefs) {
          setPrefId(prefs.id || null);
          setForm((prev) => ({
            ...prev,
            birthday: prefs.birthday || '',
            residence: prefs.residence || '',
            budget_min: prefs.budget_min || '',
            budget_max: prefs.budget_max || '',
            gender: prefs.gender || '',
            preferred_depth_range: prefs.preferred_depth_range || '',
            hobbies: prefs.hobbies || '',
            preferred_activities: prefs.preferred_activities || '',
            preferred_atmosphere: prefs.preferred_atmosphere || '',
            last_dive_date: prefs.last_dive_date || '',
            preferred_diving: prefs.preferred_diving || '',
          }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setError('');

    // 1️⃣ 먼저 preferences 저장부터 확실히
    try {
      let currentPrefId = prefId;

      if (currentPrefId) {
        await updatePreferences(currentPrefId, form);
      } else {
        const created = await createPreferences(form);
        if (created && created.id) {
          currentPrefId = created.id;
          setPrefId(created.id);
        }
      }
    } catch (err) {
      console.error('❌ Failed to save preferences:', err);
      setError('Failed to save your preferences. Please try again.');
      setSaving(false);
      return;
    }

    // 2️⃣ AI 추천 재생성은 "되면 좋은" 옵션 — 실패해도 넘어감
    try {
      await triggerAiUpdate();
    } catch (err) {
      console.error('⚠️ AI update failed, but preferences are saved:', err);
      // 여기서는 별도 오류 메시지 안 띄움
    }

    // 3️⃣ 어쨌든 설문은 저장됐으니 홈으로 이동
    setSaving(false);
    navigate('/home');
  };

  // 스킵: 이번만
  const handleSkipOnce = () => {
    setSkipModalOpen(false);
    navigate('/home');
  };

  // 스킵: 다시 보지 않기 (localStorage 플래그)
  const handleSkipForever = () => {
    try {
      localStorage.setItem('survey_never_show', '1');
    } catch (e) {
      console.error('failed to store survey_never_show', e);
    }
    setSkipModalOpen(false);
    navigate('/home');
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-10 text-center text-slate-600">
          Loading your preferences...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Dive Preferences Survey
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-600">
              Tell us how and where you like to dive. We&apos;ll use this to
              personalize recommended spots on your home page.
            </p>
          </div>

          {/* 🔹 설문 스킵 버튼 */}
          <button
            type="button"
            onClick={() => setSkipModalOpen(true)}
            className="mt-1 inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-xs md:text-sm font-semibold text-slate-700 hover:bg-gray-50"
          >
            Skip survey
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6"
        >
          {/* Basic profile */}
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Basic Profile
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Residence
                </label>
                <input
                  type="text"
                  value={form.residence}
                  onChange={handleChange('residence')}
                  placeholder="e.g. Seoul, Korea"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Birthday
                </label>
                <input
                  type="text"
                  value={form.birthday}
                  onChange={handleChange('birthday')}
                  placeholder="YYYY-MM-DD (optional)"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Gender
                </label>
                <input
                  type="text"
                  value={form.gender}
                  onChange={handleChange('gender')}
                  placeholder="optional"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Last dive date
                </label>
                <input
                  type="text"
                  value={form.last_dive_date}
                  onChange={handleChange('last_dive_date')}
                  placeholder="YYYY-MM-DD (optional)"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
            </div>
          </section>

          {/* Budget */}
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Budget
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Budget min
                </label>
                <input
                  type="text"
                  value={form.budget_min}
                  onChange={handleChange('budget_min')}
                  placeholder="e.g. 100"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Budget max
                </label>
                <input
                  type="text"
                  value={form.budget_max}
                  onChange={handleChange('budget_max')}
                  placeholder="e.g. 500"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
            </div>
          </section>

          {/* Diving style */}
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Diving Style
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Preferred depth range
                </label>
                <input
                  type="text"
                  value={form.preferred_depth_range}
                  onChange={handleChange('preferred_depth_range')}
                  placeholder="e.g. 10–18m, 18–30m"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Preferred diving
                </label>
                <input
                  type="text"
                  value={form.preferred_diving}
                  onChange={handleChange('preferred_diving')}
                  placeholder="e.g. shore, boat, wreck, macro"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
            </div>
          </section>

          {/* Atmosphere & activities */}
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Atmosphere & Activities
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Preferred atmosphere
                </label>
                <input
                  type="text"
                  value={form.preferred_atmosphere}
                  onChange={handleChange('preferred_atmosphere')}
                  placeholder="e.g. quiet, resort, local town vibe"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Preferred activities
                </label>
                <input
                  type="text"
                  value={form.preferred_activities}
                  onChange={handleChange('preferred_activities')}
                  placeholder="e.g. macro photo, big animals, night dive"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700">
                Hobbies (outside of diving)
              </label>
              <textarea
                value={form.hobbies}
                onChange={handleChange('hobbies')}
                placeholder="e.g. hiking, photography, cafe hopping"
                rows={3}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
          </section>

          {error && (
            <p className="text-sm text-red-600 mt-2">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-md border border-gray-200 text-sm font-semibold text-slate-700 hover:bg-gray-50"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-md bg-slate-900 text-white text-sm font-semibold hover:opacity-95 hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save & update recommendations'}
            </button>
          </div>
        </form>
      </div>

      {/* 🔹 스킵 선택 모달 */}
      {skipModalOpen && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setSkipModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-[360px] max-w-[92vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-slate-900">
              Skip this survey?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              You can skip for now or choose not to see this survey again.
              You can always fill it later from Settings.
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleSkipOnce}
                className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm font-semibold text-slate-800 hover:bg-gray-50"
              >
                Skip only this time
              </button>
              <button
                type="button"
                onClick={handleSkipForever}
                className="w-full px-3 py-2 rounded-md bg-slate-900 text-white text-sm font-semibold hover:opacity-95 hover:shadow"
              >
                Don&apos;t show again
              </button>
              <button
                type="button"
                onClick={() => setSkipModalOpen(false)}
                className="w-full px-3 py-2 rounded-md text-sm text-slate-500 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default PreferencesSurveyPage;
