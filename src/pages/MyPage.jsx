import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ChartBox from "../components/sections/ChartBox";
import SkillCard from "../components/cards/SkillCard";
import DiveMapBox from "../components/sections/DiveMapBox";
import TimelineBox from "../components/sections/TimelineBox";
import LogCard from "../components/cards/LogCard";
import DiveHeatmapBox from "../components/sections/DiveHeatmapBox";
import ExperienceBox from "../components/sections/ExperienceBox";
import MarineLifeStatsBox from "../components/sections/MarineLifeStatsBox";
import useUserStore from "../store/userStore";
import PropTypes from "prop-types";
import logService from "../services/logService";

function MyPage({ isOwnPage = true }) {
  const { username } = useParams();
  const navigate = useNavigate();
  const storeUser = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showBucketInput, setShowBucketInput] = useState(false);
  const [bucketList, setBucketList] = useState([]);
  const [newBucketTitle, setNewBucketTitle] = useState("");
  const [logs, setLogs] = useState([]);
  const fileInputRef = useRef(null);

  const friends = ["Suzy", "Mina", "Jisoo", "Luca"];

  useEffect(() => {
    const dummyUser = {
      username: storeUser?.name || storeUser?.username || "Guest",
      email: storeUser?.email || "guest@example.com",
      license: storeUser?.country || "Open Water Diver",
      profilePhoto: "https://via.placeholder.com/100",
      intro: "Welcome to your scuba profile!",
    };

    setUser(isOwnPage ? dummyUser : "not-found");

    const fetchLogs = async () => {
      try {
        const allLogs = await logService.getAllLogs();
        const myLogs = allLogs.filter((log) => {
          const buddyId = log?.buddy?.id || log?.buddy;
          return buddyId === storeUser?.id;
        });
        setLogs(myLogs);
      } catch (err) {
        console.error("로그 불러오기 실패", err);
      }
    };

    fetchLogs();

    setBucketList(["Maldives Diving", "Night Diving", "Current Diving Challenge"]);
  }, [username, isOwnPage, storeUser]);

  const handleChange = (field) => (e) => {
    setUser((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const toggleEdit = () => setIsEditing((prev) => !prev);
  const toggleBucketInput = () => setShowBucketInput((prev) => !prev);

  const handleSaveProfile = () => {
    try {
      updateUser({
        id: storeUser?.id,
        email: user.email,
        name: user.username,
        country: user.license,
        profilePhoto: user.profilePhoto,
      });
      setIsEditing(false);
      alert("Profile saved successfully.");
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save profile.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleAddBucket = () => {
    if (!newBucketTitle.trim()) return alert("Please enter a title.");
    setBucketList((prev) => [...prev, newBucketTitle]);
    setNewBucketTitle("");
    setShowBucketInput(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUser((prev) => ({ ...prev, profilePhoto: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  if (user === "not-found") {
    return (
      <Layout>
        <div className="text-center text-red-500 mt-10 text-lg">User not found.</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="text-center mt-10 text-gray-500">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
        <div className="w-full lg:w-[320px] space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4 text-center">
            <img
              src={user.profilePhoto}
              alt="Profile"
              className="w-24 h-24 mx-auto rounded-full object-cover"
            />
            {isOwnPage && isEditing ? (
              <>
                <div className="flex flex-col items-center space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Change Photo
                  </button>
                </div>
                <input
                  className="border p-2 w-full rounded"
                  value={user.username}
                  onChange={handleChange("username")}
                />
                <input
                  className="border p-2 w-full rounded"
                  value={user.email}
                  onChange={handleChange("email")}
                />
                <input
                  className="border p-2 w-full rounded"
                  value={user.license}
                  onChange={handleChange("license")}
                />
                <textarea
                  className="border p-2 w-full rounded"
                  value={user.intro}
                  onChange={handleChange("intro")}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800">{user.username}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm">
                  <strong>License:</strong> {user.license}
                </p>
                <p className="text-gray-600">{user.intro}</p>
                {isOwnPage ? (
                  <button
                    onClick={toggleEdit}
                    className="mt-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/chat/${user.username}`)}
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                  >
                    💬 Send Message
                  </button>
                )}
              </>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">📌 Bucket List</h3>
            {bucketList.length === 0 ? (
              <p className="text-gray-500">No items added yet.</p>
            ) : (
              <ul className="list-disc list-inside text-gray-700 mb-2">
                {bucketList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
            {isOwnPage && (
              <div className="mt-2 space-y-2">
                {showBucketInput ? (
                  <>
                    <input
                      className="w-full border rounded p-2"
                      placeholder="Add new bucket item..."
                      value={newBucketTitle}
                      onChange={(e) => setNewBucketTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddBucket()}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddBucket}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-semibold"
                      >
                        Add
                      </button>
                      <button
                        onClick={toggleBucketInput}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={toggleBucketInput}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold"
                  >
                    Add Item
                  </button>
                )}
              </div>
            )}
          </div>

          {isOwnPage && (
            <div className="bg-white p-4 rounded-xl shadow-md space-y-2">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">👥 Friends</h3>
              <ul className="list-disc list-inside text-gray-700">
                {friends.map((friend, idx) => (
                  <li key={idx}>
                    <Link to={`/user/${friend}`} className="text-blue-600 hover:underline">
                      {friend}
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => alert("Friend adding functionality coming soon.")}
                className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold"
              >
                Add Friend
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-6">
          <SkillCard
            skill={{
              title: "My Skills",
              level: user.license,
              logs: logs.length,
              remainingToMaster: Math.max(0, 50 - logs.length),
            }}
          />

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              📘 {isOwnPage ? "My" : `${user.username}'s`} Dive Logs
            </h3>
            {logs.length === 0 ? (
              <div className="w-full bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-600">
                No logs available.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {logs.slice(0, 4).map((log) => (
                  <LogCard key={log.id} log={log} />
                ))}
              </div>
            )}
            <div className="text-right mt-2">
              <button
                onClick={() => alert("Coming soon")}
                className="text-blue-600 hover:underline text-sm"
              >
                View All →
              </button>
            </div>
          </div>

          <ChartBox />
          <DiveMapBox />
          <TimelineBox />
          <DiveHeatmapBox />
          <ExperienceBox />
          <MarineLifeStatsBox />
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

MyPage.propTypes = {
  isOwnPage: PropTypes.bool,
};

export default MyPage;

