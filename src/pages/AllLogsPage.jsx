import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import LogCard from "../components/cards/LogCard";
import logService from "../services/logService";

function AllLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // ✅ 여기서 getAllLogs → getMyLogs 로 교체
        const data = await logService.getMyLogs();
        let rawLogs = [];

        if (Array.isArray(data)) {
          rawLogs = data;
        } else if (Array.isArray(data.results)) {
          rawLogs = data.results;
        }

        const sorted = sortLogs(rawLogs, sortOrder);
        setLogs(sorted);
      } catch (error) {
        console.error("❌ 내 로그 불러오기 실패:", error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [sortOrder]);

  const sortLogs = (logs, order) => {
    return [...logs].sort((a, b) => {
      const dateA = new Date(a.dive_date);
      const dateB = new Date(b.dive_date);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  const handleSortChange = (e) => {
    const newOrder = e.target.value;
    setSortOrder(newOrder);
    setLogs((prev) => sortLogs(prev, newOrder));
  };

  return (
    <Layout>
      <div className="py-8 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">My Dive Logs</h1>
          <div>
            <label className="text-sm font-medium text-gray-600 mr-2">
              Sort by:
            </label>
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="border rounded px-3 py-1 text-sm bg-white shadow-sm"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-600 text-center">No logs found.</p>
        ) : (
          <div className="flex flex-col">
            {logs.map((log) => (
              <div
                key={log.id}
                className="w-full max-w-4xl mx-auto [&>*]:!max-w-full"
              >
                <LogCard log={log} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AllLogsPage;
