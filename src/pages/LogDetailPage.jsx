import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Input from '../components/common/Input';
import logService from '../services/logService';
import authService from '../services/authService';
import api from '../api/axios';
import { useUsers } from '../context/UsersContext';

function LogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usersMap, usersLoading } = useUsers();
  const [log, setLog] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const currentUser = authService.getUser();
  const BASE_URL = 'https://scoopadive.com';

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const result = await logService.getLogById(id);
        setLog({
          ...result,
          likes_count: result.likes_count ?? 0,
          liked_by_current_user: result.liked_by_current_user ?? false,
        });
        setForm({
          dive_title: result.dive_title || '',
          dive_site: result.dive_site || '',
          dive_date: result.dive_date || '',
          max_depth: result.max_depth || '',
          bottom_time: result.bottom_time || '',
          weather: result.weather || 'sunny',
          type_of_dive: result.type_of_dive || 'fun',
          weight: result.weight || '',
          start_pressure: result.start_pressure || '',
          end_pressure: result.end_pressure || '',
          equipment: result.equipment.map((e) => e.name) || [],
          dive_center: result.dive_center_name || '',
        });

        if (result.dive_image) {
          const isFullURL = result.dive_image.startsWith('http');
          setImagePreview(isFullURL ? result.dive_image : `${BASE_URL}${result.dive_image}`);
        }
      } catch {
        navigate('/mypage');
      }
    };
    fetchLog();
  }, [id, navigate]);

  const isOwner = String(currentUser.id) === String(log?.user);

  const handleLike = async () => {
    if (!log) return;
    try {
      let res;
      if (log.liked_by_current_user) {
        res = await api.delete(`/logbooks/${log.id}/like/`);
      } else {
        res = await api.post(`/logbooks/${log.id}/like/`);
      }
      setLog((prev) => ({
        ...prev,
        liked_by_current_user: !prev.liked_by_current_user,
        likes_count: res.data.likes_count ?? prev.likes_count,
      }));
    } catch (err) {
      console.error('❌ Failed to toggle like', err);
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      form.equipment.forEach((eq) => formData.append('equipment', eq));
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'equipment') return;
        if (value !== null && value !== '') {
          formData.append(key, value);
        }
      });
      await logService.updateLog(log.id, formData);
      alert('✅ Log updated successfully!');
      setIsEditing(false);
      const updated = await logService.getLogById(id);
      setLog({
        ...updated,
        likes_count: updated.likes_count ?? 0,
        liked_by_current_user: updated.liked_by_current_user ?? false,
      });
    } catch (err) {
      alert('❌ Update failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  if (usersLoading || !log) {
    return (
      <Layout>
        <div className="text-center mt-10 text-gray-500">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto space-y-4">
        {/* 카드 */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <div className="flex justify-between items-center">
            <button onClick={() => navigate(-1)} className="text-blue-600 underline mb-2">
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-blue-700 mb-2">{log.dive_title}</h1>
          </div>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Dive"
              className="w-full rounded mb-4 max-h-[400px] object-cover"
            />
          )}

          {/* Edit / Read 모드 */}
          {isEditing ? (
            <div className="space-y-2">
              <Input
                label="Dive Title"
                value={form.dive_title}
                onChange={handleChange('dive_title')}
              />
              <Input
                label="Dive Site"
                value={form.dive_site}
                onChange={handleChange('dive_site')}
              />
              <Input
                label="Dive Date"
                type="date"
                value={form.dive_date}
                onChange={handleChange('dive_date')}
              />
              <Input
                label="Max Depth"
                type="number"
                value={form.max_depth}
                onChange={handleChange('max_depth')}
              />
              <Input
                label="Bottom Time"
                value={form.bottom_time}
                onChange={handleChange('bottom_time')}
              />
              <Input
                label="Weight"
                type="number"
                value={form.weight}
                onChange={handleChange('weight')}
              />
              <Input
                label="Start Pressure"
                type="number"
                value={form.start_pressure}
                onChange={handleChange('start_pressure')}
              />
              <Input
                label="End Pressure"
                type="number"
                value={form.end_pressure}
                onChange={handleChange('end_pressure')}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-400 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <p>
                <strong>Diver:</strong> {usersMap?.[log.user] ?? 'Unknown'}
              </p>
              <p>
                <strong>Buddy:</strong> {usersMap?.[log.buddy] ?? log.buddy ?? 'Unknown'}
              </p>
              <p>
                <strong>Dive Center:</strong> {log.dive_center_name}
              </p>
              <p>
                <strong>Title:</strong> {log.dive_title}
              </p>
              <p>
                <strong>Site:</strong> {log.dive_site}
              </p>
              <p>
                <strong>Date:</strong> {log.dive_date}
              </p>
              <p>
                <strong>Max Depth:</strong> {log.max_depth}m
              </p>
              <p>
                <strong>Bottom Time:</strong> {log.bottom_time}
              </p>
              <p>
                <strong>Weather:</strong> {log.weather}
              </p>
              <p>
                <strong>Dive Type:</strong> {log.type_of_dive}
              </p>
              <p>
                <strong>Weight:</strong> {log.weight}kg
              </p>
              <p>
                <strong>Start Pressure:</strong> {log.start_pressure}
              </p>
              <p>
                <strong>End Pressure:</strong> {log.end_pressure}
              </p>
              <p>
                <strong>Equipment:</strong> {log.equipment.map((e) => e.name).join(', ')}
              </p>
            </div>
          )}

          {/* 카드 안 버튼: 작성자만 */}
          {/* 카드 안: 작성자만 */}
          {isOwner && !isEditing && (
            <div className="flex gap-6 mt-6 text-sm font-medium">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 underline hover:text-blue-800 transition-colors"
              >
                ✏️ Edit
              </button>

              <button
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this log?')) {
                    await logService.deleteLog(log.id);
                    navigate('/mypage');
                  }
                }}
                className="text-red-600 underline hover:text-red-800 transition-colors"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>

        {/* Like 버튼 별도 카드 */}
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              log.liked_by_current_user
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
            }`}
            onClick={handleLike}
          >
            {log.liked_by_current_user ? '👍 Liked' : '👍 Like'} {log.likes_count}
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default LogDetailPage;
