import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
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

  const isOwner = String(currentUser.id) === String(log?.user?.id);

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

  if (usersLoading || !log) {
    return (
      <Layout>
        <div className="text-center mt-10 text-gray-500">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="text-blue-600 underline mb-2">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-blue-700 mb-2">Dive Log Detail</h1>
        </div>

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Dive"
            className="w-full rounded mb-4 max-h-[400px] object-cover"
          />
        )}

        <p>
          <strong>Author:</strong> {usersMap?.[log.user] ?? 'Unknown'}
        </p>
        <p>
          <strong>Buddy:</strong> {usersMap?.[log.buddy] ?? 'Unknown'}
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

        <div className="flex items-center justify-between mt-4">
          <button
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              log.liked_by_current_user
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
            }`}
            onClick={handleLike}
          >
            {log.liked_by_current_user ? '👍 Liked' : '👍 Like'} {log.likes_count}
          </button>

          {isOwner && (
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete this log?')) {
                  await logService.deleteLog(log.id);
                  navigate('/mypage');
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
            >
              Delete Log
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default LogDetailPage;
