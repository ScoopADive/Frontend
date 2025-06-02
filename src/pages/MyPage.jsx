import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ChartBox from "../components/sections/ChartBox";
import SkillCard from "../components/cards/SkillCard";
import DiveMapBox from "../components/sections/DiveMapBox";
import TimelineBox from "../components/sections/TimelineBox";
import LogCard from "../components/cards/LogCard";

const dummyUserData = {
  Ruby: {
    username: "Ruby",
    email: "Ruby@example.com",
    license: "Advanced Diver",
    profilePhoto: "https://via.placeholder.com/100",
    intro: "Passionate about diving life!",
    logs: [
      { id: 1, title: "Coral Reef Adventure", site: "Blue Lagoon", date: "2025-05-18", depth: "28m", bottomTime: "38min" },
      { id: 2, title: "Jeju Sunrise", site: "Seogwipo", date: "2025-05-01", depth: "21m", bottomTime: "42min" },
      { id: 3, title: "Night Dive", site: "Okinawa", date: "2025-04-20", depth: "18m", bottomTime: "30min" },
      { id: 4, title: "Shark Encounter", site: "Maldives", date: "2025-03-15", depth: "35m", bottomTime: "50min" },
      { id: 5, title: "Wreck Dive", site: "Truk Lagoon", date: "2025-02-10", depth: "40m", bottomTime: "60min" },
    ],
  },
  Luca: {
    username: "Luca",
    email: "luca@diving.com",
    license: "Rescue Diver",
    profilePhoto: "https://via.placeholder.com/100",
    intro: "Loves deep dives and shipwrecks!",
    logs: [{ id: 3, title: "Wreck Dive", site: "Yonaguni", date: "2025-04-11", depth: "30m", bottomTime: "40min" }],
  },
  Suzy: {
    username: "Suzy",
    email: "suzy@example.com",
    license: "Open Water Diver",
    profilePhoto: "https://via.placeholder.com/100",
    intro: "Beginner diver but full of passion!",
    logs: [{ id: 4, title: "First Dive", site: "Naha, Okinawa", date: "2025-05-10", depth: "12m", bottomTime: "30min" }],
  },
  Mina: {
    username: "Mina",
    email: "mina@example.com",
    license: "Advanced Diver",
    profilePhoto: "https://via.placeholder.com/100",
    intro: "Loves coral reefs!",
    logs: [],
  },
  Jisoo: {
    username: "Jisoo",
    email: "jisoo@example.com",
    license: "Dive Master",
    profilePhoto: "https://via.placeholder.com/100",
    intro: "Scuba instructor & mentor",
    logs: [],
  },
};

const dummySkillData = {
  Ruby: { title: "Ruby's Skills", level: "Rescue Diver", logs: 32, remainingToMaster: 18 },
  Luca: { title: "Luca's Skills", level: "Dive Master", logs: 33, remainingToMaster: 17 },
  Suzy: { title: "Suzy's Skills", level: "Open Water Diver", logs: 9, remainingToMaster: 41 },
  Mina: { title: "Mina's Skills", level: "Advanced Diver", logs: 12, remainingToMaster: 38 },
  Jisoo: { title: "Jisoo's Skills", level: "Open Water Diver", logs: 8, remainingToMaster: 42 },
};

function MyPage({ isOwnPage = true }) {
  const { username } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const bucketList = ["Dive with Whale Sharks", "Explore Blue Hole", "Underwater Photography"];
  const friends = ["Suzy", "Mina", "Jisoo", "Luca"];

  useEffect(() => {
    const targetName = isOwnPage ? "Ruby" : username;
    const userData = dummyUserData[targetName];
    if (!userData) {
      setUser("not-found");
    } else {
      setUser(userData);
    }
  }, [username, isOwnPage]);

  const handleChange = (field) => (e) => {
    setUser({ ...user, [field]: e.target.value });
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  if (user === "not-found") {
    return (
      <Layout>
        <div className="text-center text-red-500 mt-10 text-lg">❌ 유저 정보를 찾을 수 없습니다.</div>
      </Layout>
    );
  }

  if (!user) return <Layout><div className="text-center mt-10">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
        <div className="w-full lg:w-[320px] space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4 text-center">
            <img src={user.profilePhoto} alt="Profile" className="w-24 h-24 mx-auto rounded-full object-cover" />

            {isOwnPage && isEditing ? (
              <>
                <input className="border p-2 w-full rounded" value={user.username} onChange={handleChange("username")} />
                <input className="border p-2 w-full rounded" value={user.email} onChange={handleChange("email")} />
                <input className="border p-2 w-full rounded" value={user.license} onChange={handleChange("license")} />
                <input className="border p-2 w-full rounded" value={user.profilePhoto} onChange={handleChange("profilePhoto")} />
                <textarea className="border p-2 w-full rounded" value={user.intro} onChange={handleChange("intro")} />
                <button onClick={toggleEdit} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Save</button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800">{user.username}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm"><strong>License:</strong> {user.license}</p>
                <p className="text-gray-600">{user.intro}</p>
                {isOwnPage ? (
                  <button onClick={toggleEdit} className="mt-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded">Edit Profile</button>
                ) : (
                  <button onClick={() => navigate(`/chat/${user.username}`)} className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">💬 Send Message</button>
                )}
              </>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">📌 Bucket List</h3>
            <ul className="list-disc list-inside text-gray-700">
              {bucketList.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>

          {isOwnPage && (
            <div className="bg-white p-4 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">👥 Friends</h3>
              <ul className="list-disc list-inside text-gray-700">
                {friends.map((friend, idx) => (
                  <li key={idx}>
                    <Link to={`/user/${friend}`} className="text-blue-600 hover:underline">{friend}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-6">
          <SkillCard skill={dummySkillData[user.username]} />

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              📘 {isOwnPage ? "My" : `${user.username}'s`} Dive Logs
            </h3>

            {user.logs.length === 0 ? (
              <div className="w-full bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-600">
                🪸 등록된 로그가 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.logs.slice(0, 4).map((log) => (
                  <LogCard key={log.id} log={log} />
                ))}
              </div>
            )}

            <div className="text-right mt-2">
              <button
                onClick={() => alert("전체 보기 페이지 준비 중")}
                className="text-blue-600 hover:underline text-sm"
              >
                전체 보기 →
              </button>
            </div>
          </div>

          <ChartBox />
          <DiveMapBox />
          <TimelineBox />
        </div>
      </div>

      {isOwnPage && (
        <button
          onClick={() => navigate("/log/new")}
          className="fixed bottom-8 right-8 bg-gray-500 hover:bg-gray-400 text-white text-lg font-bold py-3 px-5 rounded-full shadow-lg"
        >
          ✍️ Add Log
        </button>
      )}
    </Layout>
  );
}

export default MyPage;






