// src/pages/MyPage.jsx
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

// keep: limited message composer only
import MessageComposer from "../components/messages/MessageComposer";

/* -------------------------------------------------------
   Dropdown options sent as-is to the server
------------------------------------------------------- */
const COUNTRY_OPTIONS = [
  { label: "Select country", value: "" },
  { label: "Korea (Republic of)", value: "Korea" },
  { label: "Japan", value: "Japan" },
  { label: "United States", value: "United States" },
  { label: "Australia", value: "Australia" },
  { label: "Indonesia", value: "Indonesia" },
  { label: "Philippines", value: "Philippines" },
  { label: "Malaysia", value: "Malaysia" },
  { label: "Vietnam", value: "Vietnam" },
  { label: "Thailand", value: "Thailand" },
];

const LICENSE_OPTIONS = [
  { label: "Select license", value: "" },
  { label: "PADI Scuba Diver", value: "PADI Scuba Diver" },
  { label: "PADI Open Water Diver", value: "PADI Open Water Diver" },
  { label: "PADI Advanced Open Water Diver", value: "PADI Advanced Open Water Diver" },
  { label: "PADI Adventure Diver", value: "PADI Adventure Diver" },
  { label: "PADI Rescue Diver", value: "PADI Rescue Diver" },
  { label: "Emergency First Response (EFR)", value: "Emergency First Response (EFR)" },
  { label: "PADI Deep Diver", value: "PADI Deep Diver" },
  { label: "PADI Night Diver", value: "PADI Night Diver" },
  { label: "PADI Wreck Diver", value: "PADI Wreck Diver" },
  { label: "Peak Performance Buoyancy", value: "Peak Performance Buoyancy" },
  { label: "Enriched Air Diver (Nitrox)", value: "Enriched Air Diver (Nitrox)" },
  { label: "PADI Digital Underwater Photographer", value: "PADI Digital Underwater Photographer" },
  { label: "PADI Divemaster", value: "PADI Divemaster" },
  { label: "PADI Assistant Instructor", value: "PADI Assistant Instructor" },
  { label: "PADI Open Water Scuba Instructor (OWSI)", value: "PADI Open Water Scuba Instructor (OWSI)" },
  { label: "PADI Specialty Instructor", value: "PADI Specialty Instructor" },
  { label: "PADI Master Scuba Diver Trainer (MSDT)", value: "PADI Master Scuba Diver Trainer (MSDT)" },
  { label: "PADI IDC Staff Instructor", value: "PADI IDC Staff Instructor" },
  { label: "PADI Master Instructor", value: "PADI Master Instructor" },
  { label: "PADI Course Director", value: "PADI Course Director" },
  { label: "Tec 40", value: "Tec 40" },
  { label: "Tec 45", value: "Tec 45" },
  { label: "Tec 50", value: "Tec 50" },
  { label: "Tec Trimix 65", value: "Tec Trimix 65" },
  { label: "Tec Trimix Diver", value: "Tec Trimix Diver" },
  { label: "Tec Sidemount Diver", value: "Tec Sidemount Diver" },
  { label: "Tec Gas Blender", value: "Tec Gas Blender" },
  { label: "PADI Rebreather Diver", value: "PADI Rebreather Diver" },
  { label: "Advanced Rebreather Diver", value: "Advanced Rebreather Diver" },
];

function MyPage({ isOwnPage = true }) {
  const { username } = useParams();
  const navigate = useNavigate();
  const storeUser = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  const [user, setUser] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showBucketInput, setShowBucketInput] = useState(false);
  const [bucketList, setBucketList] = useState([]);
  const [newBucketTitle, setNewBucketTitle] = useState("");
  const [logs, setLogs] = useState([]);
  const [spots, setSpots] = useState([]);
  const [mapCenter, setMapCenter] = useState([20, 100]);
  const fileInputRef = useRef(null);
  const selectedFileRef = useRef(null);

  // demo friends list
  const friends = [
    { id: 11, username: "Suzy", displayName: "Suzy" },
    { id: 12, username: "Mina", displayName: "Mina" },
    { id: 13, username: "Jisoo", displayName: "Jisoo" },
    { id: 14, username: "Luca", displayName: "Luca" },
  ];

  // message composer state
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerReceiver, setComposerReceiver] = useState(null);

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

  const hydrateFromServer = async () => {
    try {
      const data = await userService.getMyProfile();
      const profile = Array.isArray(data) ? data[0] : data;
      setProfileId(profile?.id ?? null);
      const mapped = {
        id: profile?.user_id ?? storeUser?.id ?? null,
        username: profile?.username ?? storeUser?.name ?? storeUser?.username ?? "",
        email: profile?.email ?? storeUser?.email ?? "",
        country: profile?.country ?? "",
        license: profile?.license ?? "Open Water Diver",
        introduction: profile?.introduction ?? "",
        profile_image_url: profile?.profile_image ?? storeUser?.profile_image ?? "https://via.placeholder.com/100",
        specialties: profile?.specialties ?? [],
      };
      setUser(mapped);
      updateUser({
        id: mapped.id,
        email: mapped.email,
        name: mapped.username,
        country: mapped.country,
        profile_image: mapped.profile_image_url,
        username: mapped.username,
        specialties: mapped.specialties,
      });
    } catch {
      const fallback = {
        id: storeUser?.id ?? null,
        username: storeUser?.name || storeUser?.username || "",
        email: storeUser?.email || "",
        country: storeUser?.country || "",
        license: "Open Water Diver",
        introduction: "",
        profile_image_url: storeUser?.profile_image || "https://via.placeholder.com/100",
        specialties: [],
      };
      setUser(fallback);
      setProfileId(null);
    }
  };

  useEffect(() => {
    hydrateFromServer();
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
  }, [username, isOwnPage]);

  const handleChange = (field) => (e) => {
    setUser((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveProfile = async () => {
    try {
      if (!profileId) {
        alert("Profile is not ready. Try again.");
        return;
      }
      if (!user?.username || !user?.email) {
        alert("Username and email are required.");
        return;
      }
      const payload = {
        username: user.username,
        email: user.email,
        country: user.country || undefined,
        license: user.license || undefined,
        introduction: user.introduction || undefined,
        profile_image: selectedFileRef.current || undefined,
      };
      await userService.updateProfile(profileId, payload);
      await hydrateFromServer();
      setIsEditing(false);
      alert("Profile saved successfully.");
    } catch {
      alert("Failed to save profile.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    hydrateFromServer();
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
    selectedFileRef.current = file;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUser((prev) => ({ ...prev, profile_image_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // message: open composer from a friend card
  const openComposerFor = (friend) => {
    setComposerReceiver(friend);
    setComposerOpen(true);
  };

  // message: open composer for the profile owner
  const openComposerForProfileUser = () => {
    if (!user) return;
    openComposerFor({ id: user.id, username: user.username, displayName: user.username });
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
              src={user.profile_image_url}
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

                <select
                  className="border p-2 w-full rounded bg-white"
                  value={user.country ?? ""}
                  onChange={handleChange("country")}
                >
                  {COUNTRY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <select
                  className="border p-2 w-full rounded bg-white"
                  value={user.license ?? ""}
                  onChange={handleChange("license")}
                >
                  {LICENSE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <textarea
                  className="border p-2 w-full rounded"
                  placeholder="Enter introduction"
                  value={user.introduction}
                  onChange={handleChange("introduction")}
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
                  <strong>Country:</strong> {user.country || "-"}
                </p>
                <p className="text-sm">
                  <strong>License:</strong> {user.license || "-"}
                </p>
                <p className="text-gray-600">{user.introduction}</p>
                {isOwnPage ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={openComposerForProfileUser}
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                  >
                    Send Message
                  </button>
                )}
              </>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Bucket List
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
                        onClick={() => setShowBucketInput(false)}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => setShowBucketInput(true)}
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
                Friends
              </h3>
              <ul className="space-y-2">
                {friends.map((friend) => (
                  <li key={friend.id} className="flex items-center justify-between">
                    <Link
                      to={`/user/${friend.username}`}
                      className="text-blue-600 hover:underline"
                    >
                      {friend.displayName}
                    </Link>
                    <button
                      onClick={() => openComposerFor(friend)}
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md"
                    >
                      Message
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => alert("Friend adding functionality coming soon.")}
                className="mt-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded font-semibold"
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
              specialties: user.specialties,
              logs: logs.length,
              remainingToMaster: Math.max(0, 50 - logs.length),
            }}
          />

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {isOwnPage ? "My" : `${user.username}'s`} Dive Logs
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

      {/* message composer modal */}
      <MessageComposer
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        defaultReceiver={composerReceiver}
      />
    </Layout>
  );
}

MyPage.propTypes = {
  isOwnPage: PropTypes.bool,
};

export default MyPage;
