// src/pages/SettingsPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { fetchMyPreferences } from '../api/preferences';

const SettingsPage = () => {
  const [language, setLanguage] = useState('ko');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [email] = useState('rim@gmail.com'); // TODO: replace with real user email

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  const [prefs, setPrefs] = useState(null);
  const [prefsLoading, setPrefsLoading] = useState(true);

  // load local UI settings (for now, still localStorage)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('user_settings'));
    if (saved) {
      setLanguage(saved.language || 'ko');
      setTheme(saved.theme || 'light');
      setNotifications(
        typeof saved.notifications === 'boolean' ? saved.notifications : true
      );
    }
  }, []);

  // load preferences summary from backend
  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const data = await fetchMyPreferences();
        setPrefs(data);
      } catch (e) {
        console.error(e);
      } finally {
        setPrefsLoading(false);
      }
    };
    loadPrefs();
  }, []);

  const handleSave = () => {
    const payload = { language, theme, notifications };
    localStorage.setItem('user_settings', JSON.stringify(payload));
    alert('Settings have been saved.');
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This cannot be undone.'
    );
    if (confirmDelete) {
      alert('Account deletion is not implemented yet.');
    }
  };

  const passwordType = showPasswords ? 'text' : 'password';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

        {/* Preferences summary */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Dive Preferences
            </h2>
            <Link
              to="/settings/preferences"
              className="inline-flex items-center px-3 py-1.5 rounded-md border border-gray-200 text-xs font-semibold text-slate-800 hover:bg-gray-50"
            >
              Edit survey
            </Link>
          </div>
          {prefsLoading ? (
            <p className="text-sm text-gray-500">Loading your preferences...</p>
          ) : !prefs ? (
            <p className="text-sm text-gray-500">
              You haven&apos;t filled out the survey yet. Take the survey to get
              personalized dive spot recommendations on your home page.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
              <div>
                <p>
                  <span className="font-medium">Residence:</span>{' '}
                  {prefs.residence || '-'}
                </p>
                <p>
                  <span className="font-medium">Preferred diving:</span>{' '}
                  {prefs.preferred_diving || '-'}
                </p>
                <p>
                  <span className="font-medium">Preferred depth:</span>{' '}
                  {prefs.preferred_depth_range || '-'}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">Budget:</span>{' '}
                  {prefs.budget_min || prefs.budget_max
                    ? `${prefs.budget_min || '?'} - ${prefs.budget_max || '?'}`
                    : '-'}
                </p>
                <p>
                  <span className="font-medium">Atmosphere:</span>{' '}
                  {prefs.preferred_atmosphere || '-'}
                </p>
                <p>
                  <span className="font-medium">Activities:</span>{' '}
                  {prefs.preferred_activities || '-'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Account email */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-2">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Account</h2>
          <label className="text-gray-600 text-sm">Email</label>
          <input
            type="text"
            value={email}
            disabled
            className="w-full border rounded p-2 bg-gray-100 text-gray-700"
          />
        </div>

        {/* Password change */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Password
            </h2>
            <label className="flex items-center gap-1 text-xs text-gray-500">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
              />
              Show passwords
            </label>
          </div>

          <input
            type={passwordType}
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border p-2 rounded text-sm"
          />

          <div>
            <input
              type={passwordType}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border p-2 rounded text-sm"
            />
            <p className="text-sm text-gray-500 mt-1">
              Password must contain at least one uppercase and lowercase letter,
              and be at least 6 characters long.
            </p>
          </div>

          <input
            type={passwordType}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 rounded text-sm"
          />

          <div className="pt-2">
            <button
              type="button"
              disabled={
                !currentPassword ||
                !newPassword ||
                newPassword !== confirmPassword
              }
              className={`w-full py-2 rounded font-semibold ${
                currentPassword &&
                newPassword &&
                newPassword === confirmPassword
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Update password
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Language</h2>
          <div className="flex items-center justify-between">
            <label className="text-gray-600 font-medium">
              Interface language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border p-2 rounded w-40 text-sm"
            >
              <option value="ko">Korean</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Theme</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 p-3 rounded text-sm font-medium border ${
                theme === 'light'
                  ? 'bg-gray-100 border-gray-400'
                  : 'bg-white border-gray-200'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 p-3 rounded text-sm font-medium border ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white border-gray-600'
                  : 'bg-white border-gray-200'
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Email notifications
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium text-sm">
              Receive email alerts
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-full transition" />
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="text-right">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
          >
            Save settings
          </button>
        </div>

        {/* Account deletion */}
        <div className="bg-gray-50 border border-red-200 rounded-xl p-6 mt-6">
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            Delete account
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            All your logs and posts will be permanently removed. This action
            cannot be undone.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded"
          >
            Delete account
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
