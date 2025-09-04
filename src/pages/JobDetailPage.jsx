import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/layout/Layout';

function JobDetailPage() {
  const { id } = useParams();
  const location = useLocation(); // <-- 여기서 state를 가져옴
  const usersMap = location.state?.usersMap || {}; // HomePage에서 넘어온 usersMap
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/home/jobs/${id}/`);
        setJob(res.data);
      } catch (err) {
        console.error('Failed to fetch job detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!job) return <p className="text-center mt-8">Job not found.</p>;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">💼 {job.title}</h2>
        <p>
          <span className="font-semibold">User:</span> {usersMap[job.user] ?? 'Unknown'}
        </p>
        <p>
          <span className="font-semibold">Location:</span> {job.location}
        </p>
        <p>
          <span className="font-semibold">Description:</span> {job.description}
        </p>
        <p className="text-xs text-gray-500">
          <span className="font-semibold">Created At:</span>{' '}
          {new Date(job.created_at).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </Layout>
  );
}

export default JobDetailPage;
