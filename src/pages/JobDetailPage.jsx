import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/layout/Layout';
import { useUsers } from '../context/UsersContext'; // ✅ Context 불러오기

function JobDetailPage() {
  const { id } = useParams();
  const { usersMap } = useUsers();
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
