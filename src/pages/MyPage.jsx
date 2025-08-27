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
import bucketService from "../services/bucketService";
import userService from "../services/userService";

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
  const [spots, setSpots] = useState([]);
  const [mapCenter, setMapCenter] = useState([20, 100]);
  const fileInputRef = useRef(null);

  const friends = ["Suzy", "Mina", "Jisoo", "Luca"];

  const getField = (obj, keys) => {
    for (const k of keys) {
      if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
    }
    return undefined;
  };

  const loadGeocodeCache = () => {
    try {
      const raw = localStorage.getItem("geocode_cache_v1");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveGeocodeCache = (cache) => {
    try {
      localStorage.setItem("geocode_cache_v1", JSON.stringify(cache));
    } catch {}
  };

  const geocodeSite = async (site) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(site)}&limit=1`;
    const res = await fetch(url, { headers: { "Accept-Language": "en" } });
    if (!res.ok) throw new Error("geocode failed");
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const { lat, lon } = data[0];
    return { lat: parseFloat(lat), lng: parseFloat(lon) };
  };

  const buildSpotsFromLogs = async (logsData) => {
    const direct = [];
    const needGeocode = [];
    for (const log of logsData) {
      const lat = parseFloat(getField(log, ["lat", "latitude", "site_lat", "dive_site_lat"]));
      const lng = parseFloat(getField(log, ["lng", "lon", "longitude", "site_lng", "dive_site_lng"]));
      const site = getField(log, ["dive_site", "site", "spot", "location", "dive_title"]) || "Unknown";
      if (!isNaN(lat) && !isNaN(lng)) {
        direct.push({ site: String(site), lat, lng });
      } else {
        const nameOnly = String(site).trim();
        if (nameOnly) needGeocode.push(nameOnly);
      }
    }

    const uniqueNames = Array.from(new Set(needGeocode));
    const cache = loadGeocodeCache();
    const results = [];
    for (const name of uniqueNames) {
      if (cache[name]) {
        results.push({ site: name, lat: cache[name].lat, lng: cache[name].lng });
        continue;
      }
      try {
        const pos = await geocodeSite(name);
        if (pos) {
          cache[name] = pos;
          results.push({ site: name, lat: pos.lat, lng: pos.lng });
        }
      } catch {}
    }
    saveGeocodeCache(cache);

    const merged = [...direct, ...results];
    const dedupKey = (s) => `${s.site}-${s.lat.toFixed(4)}-${s.lng.toFixed(4)}`;
    const final = Array.from(new Map(merged.map((s) => [dedupKey(s), s])).values());

    if (final.length > 0) {
      const avgLat = final.reduce((a, b) => a + b.lat, 0) / final.length;
      const avgLng = final.reduce((a, b) => a + b.lng, 0) / final.length;
      setMapCenter([avgLat, avgLng]);
    } else {
      setMapCenter([20, 100]);
    }

    setSpots(final);
  };

  useEffect(() => {
    const dummyUser = {
      id: storeUser?.id ?? null,
      username: storeUser?.name || storeUser?.username || "Guest",
      email: storeUser?.email || "guest@example.com",
      license: storeUser?.country || "Open Water Diver",
      profilePhoto:
        storeUser?.profilePhoto ||
        storeUser?.profile_image ||
        "https://via.placeholder.com/100",
      intro: storeUser?.intro || "Welcome to your scuba profile!",
      specialties: storeUser?.specialties || [],
    };

    setUser(isOwnPage ? dummyUser : "not-found");

    const fetchLogs = async () => {
      try {
        const res = await logService.getMyLogs();
        const arr = Array.isArray(res) ? res : [];
        setLogs(arr);
        await buildSpotsFromLogs(arr);
      } catch {
        setLogs([]);
        setSpots([]);
        setMapCenter([20, 100]);
      }
    };

    const fetchBuckets = async () => {
      try {
        const list = await bucketService.getList(1);
        setBucketList(Array.isArray(list) ? list : []);
      } catch {
        setBucketList([]);
      }
    };

    fetchLogs();
    fetchBuckets();
  }, [username, isOwnPage, storeUser]);

  const handleChange = (field) => (e) => {
    setUser((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const toggleEdit = () => setIsEditing((prev) => !prev);
  const toggleBucketInput = () => setShowBucketInput((prev) => !prev);

  const handleSaveProfile = async () => {
    try {
      if (user?.id) {
        let payload = {
          username: user.username || "",
          email: user.email || "",
          country: user.license || "",
          intro: user.intro || "",
        };
        try {
          await userService.updateProfile(user.id, payload);
        } catch {}
      }

      updateUser({
        id: storeUser?.id,
        email: user.email,
        name: user.username,
        country: user.license,
        profilePhoto: user.profilePhoto,
        profile_image: user.profilePhoto,
        intro: user.intro,
        username: user.username,
        specialties: user.specialties,
      });

      setIsEditing(false);
      alert("Profile saved successfully.");
    } catch {
      alert("Failed to save profile.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleAddBucket = async () => {
    const title = newBucketTitle.trim();
    if (!title) return alert("Please enter a title.");
    try {
      const created = await bucketService.create(title, storeUser?.id ?? null);
      setBucketList((prev) => [created, ...prev]);
      setNewBucketTitle("");
      setShowBucketInput(false);
    } catch {
      alert("Failed to add bucket item.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
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
        <div className="text-center text-red-500 mt-10 text-lg">
          User not found.
        </div>
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
                  placeholder="Enter username"
                  value={user.username}
                  onChange={handleChange("username")}
                />
                <input
                  className="border p-2 w-full rounded"
                  placeholder="Enter email"
                  value={user.email}
                  onChange={handleChange("email")}
                />
                <input
                  className="border p-2 w-full rounded"
                  placeholder="Enter license"
                  value={user.license}
                  onChange={handleChange("license")}
                />
                <textarea
                  className="border p-2 w-full rounded"
                  placeholder="Enter introduction"
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
                <h2 className="text-xl font-semibold text-gray-800">
                  {user.username}
                </h2>
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
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              📌 Bucket List
            </h3>
            {bucketList.length === 0 ? (
              <p className="text-gray-500">No items added yet.</p>
            ) : (
              <ul className="list-disc list-inside text-gray-700 mb-2">
                {bucketList.map((item) => (
                  <li key={item.id ?? item}>{item.title ?? item}</li>
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
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                👥 Friends
              </h3>
              <ul className="list-disc list-inside text-gray-700">
                {friends.map((friend, idx) => (
                  <li key={idx}>
                    <Link
                      to={`/user/${friend}`}
                      className="text-blue-600 hover:underline"
                    >
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
              title: "🏅 My Skills",
              level: user.license,
              specialties: user.specialties,
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
                onClick={() => navigate("/logs")}
                className="text-blue-600 hover:underline text-sm"
              >
                View All →
              </button>
            </div>
          </div>

          <ChartBox logs={logs} />
          <DiveMapBox spots={spots} center={mapCenter} zoom={spots.length ? 3 : 2} height="h-72" />
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
