// src/pages/MyPage.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ChartBox from "../components/sections/ChartBox";
import SkillCard from "../components/cards/SkillCard";
import DiveMapBox from "../components/sections/DiveMapBox";
import TimelineBox from "../components/sections/TimelineBox";
import LogCard from "../components/cards/LogCard";
import DiveHeatmapBox from "../components/sections/DiveHeatmapBox";
import useUserStore from "../store/userStore";
import PropTypes from "prop-types";
import logService from "../services/logService";
import bucketService from "../services/bucketService";
import userService from "../services/userService";
import MessageComposer from "../components/messages/MessageComposer";
import {
  Waves,
  Anchor,
  Clock,
  Globe,
  User as UserIcon,
  Award,
  Edit3,
  Calendar,
  MessageSquare,
} from "lucide-react";

const COUNTRY_OPTIONS = [
  { label: "Select country", value: "" },
  { label: "Korea (Republic of)", value: "Korea (Republic of)" },
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
  { label: "PADI Master Scuba Diver", value: "PADI Master Scuba Diver" },
  { label: "Deep Diver", value: "Deep Diver" },
  { label: "Night Diver", value: "Night Diver" },
  { label: "Wreck Diver", value: "Wreck Diver" },
  { label: "Underwater Navigation", value: "Underwater Navigation" },
  { label: "Peak Performance Buoyancy", value: "Peak Performance Buoyancy" },
  { label: "Enriched Air Diver (Nitrox)", value: "Enriched Air Diver (Nitrox)" },
  { label: "Dry Suit Diver", value: "Dry Suit Diver" },
  { label: "Search and Recovery Diver", value: "Search and Recovery Diver" },
  { label: "Drift Diver", value: "Drift Diver" },
  { label: "Altitude Diver", value: "Altitude Diver" },
  { label: "Boat Diver", value: "Boat Diver" },
  { label: "Sidemount Diver", value: "Sidemount Diver" },
  { label: "Digital Underwater Photographer", value: "Digital Underwater Photographer" },
  { label: "Underwater Naturalist", value: "Underwater Naturalist" },
  { label: "Multilevel Diver", value: "Multilevel Diver" },
  { label: "Fish Identification", value: "Fish Identification" },
  { label: "Ice Diver", value: "Ice Diver" },
  { label: "Cavern Diver", value: "Cavern Diver" },
  { label: "Self-Reliant Diver (for experienced divers)", value: "Self-Reliant Diver (for experienced divers)" },
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

  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const selectedFileRef = useRef(null);
  const [errors, setErrors] = useState({});

  const friends = [
    { id: 11, username: "Suzy", displayName: "Suzy" },
    { id: 12, username: "Mina", displayName: "Mina" },
    { id: 13, username: "Jisoo", displayName: "Jisoo" },
    { id: 14, username: "Luca", displayName: "Luca" },
  ];

  const [composerOpen, setComposerOpen] = useState(false);
  const [composerReceiver, setComposerReceiver] = useState(null);

  const getField = (obj, keys) => {
    for (const k of keys) {
      if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
    }
    return undefined;
  };

  const getLogThumb = (log) => {
    const url =
      getField(log, ["cover", "thumbnail", "image_url", "photo_url", "image", "photo"]) ||
      "https://picsum.photos/640/360?blur=2";
    return String(url);
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
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      site
    )}&limit=1`;
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
    setLoading(true);
    try {
      const data = await userService.getMyProfile();
      const profile = Array.isArray(data) ? data[0] : data;

      setProfileId(profile?.id ?? null);

      const mapped = {
        id: profile?.user_id ?? storeUser?.id ?? null,
        username: profile?.username ?? storeUser?.name ?? storeUser?.username ?? "",
        email: profile?.email ?? storeUser?.email ?? "",
        country: profile?.country ?? "",
        license: profile?.license ?? "",
        introduction: profile?.introduction ?? "",
        profile_image_url:
          profile?.profile_image ?? storeUser?.profile_image ?? "https://via.placeholder.com/100",
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
        license: "",
        introduction: "",
        profile_image_url: storeUser?.profile_image || "https://via.placeholder.com/100",
        specialties: [],
      };
      setUser(fallback);
      setProfileId(null);
    } finally {
      setLoading(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, isOwnPage]);

  const handleChange = (field) => (e) => {
    setUser((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const e = {};
    const uname = (user.username || "").trim();
    const email = (user.email || "").trim();
    const country = user.country || "";
    const license = user.license || "";

    if (uname.length < 3) e.username = "Username must be at least 3 characters.";
    if (email.length < 4 || email.length > 30) e.email = "Email length must be 4-30.";
    if (country && country.length > 20) e.country = "Country must be ≤ 20 characters.";
    if (license && !LICENSE_OPTIONS.some((o) => o.value === license)) e.license = "Invalid license value.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!profileId) {
      alert("Profile is not ready. Try again.");
      return;
    }
    if (!validate()) return;

    try {
      const payload = {
        username: user.username.trim(),
        email: user.email.trim(),
        country: user.country || undefined,
        license: user.license || undefined,
        introduction: user.introduction?.trim() || undefined,
        profile_image: selectedFileRef.current || undefined,
      };

      await userService.updateProfile(profileId, payload);
      selectedFileRef.current = null;
      await hydrateFromServer();
      setIsEditing(false);
      alert("Profile saved successfully.");
    } catch (err) {
      alert(typeof err === "object" ? JSON.stringify(err, null, 2) : String(err));
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

  const openComposerFor = (friend) => {
    setComposerReceiver(friend);
    setComposerOpen(true);
  };

  const openComposerForProfileUser = () => {
    if (!user) return;
    openComposerFor({ id: user.id, username: user.username, displayName: user.username });
  };

  const totalDives = logs?.length || 0;
  const maxDepth = Math.max(0, ...logs.map((l) => Number(getField(l, ["max_depth"])) || 0));
  const totalTime = logs.reduce((acc, l) => acc + (Number(getField(l, ["bottom_time"])) || 0), 0);
  const uniqueCountries = new Set(logs.map((l) => l.country).filter(Boolean)).size;

  const metricStats = [
    { label: "Total Dives", value: totalDives, Icon: Waves },
    { label: "Max Depth", value: `${maxDepth}m`, Icon: Anchor },
    { label: "Total Time", value: `${Math.round(totalTime)}h`, Icon: Clock },
    { label: "Countries", value: uniqueCountries, Icon: Globe },
  ];

  const skillData = useMemo(() => {
    return {
      title: "My Skills & Level",
      level: user?.license || "Open Water Diver",
      specialties: Array.isArray(user?.specialties) ? user.specialties : [],
      logs: totalDives,
    };
  }, [user, totalDives]);

  const timelineItems = useMemo(() => {
    const items = [];
    if (user?.license) {
      items.push({ title: user.license, date: "—", note: "Current license" });
    }
    (Array.isArray(user?.specialties) ? user.specialties : []).forEach((sp) =>
      items.push({ title: sp, date: "—", note: "Specialty" })
    );
    return items;
  }, [user]);

  if (loading || !user) {
    return (
      <Layout>
        <div className="text-center mt-10 text-gray-500">Loading...</div>
      </Layout>
    );
  }

  // 공통 스타일 토큰
  const SOFT_SHADOW = "shadow-[0_1px_3px_rgba(2,6,23,0.06),0_0_0_1px_rgba(2,6,23,0.04)]";
  const CARD = `rounded-lg bg-white ${SOFT_SHADOW}`;
  const SECTION_HEAD = "px-6 pt-5 pb-3";
  // 라이트 톤 버튼(기본 연한색 → hover 더 진하게)
  const BTN_LIGHT_BASE =
    "rounded-lg bg-slate-200 text-slate-900 px-3 py-2 text-sm font-semibold transition-colors";
  const BTN_LIGHT = `${BTN_LIGHT_BASE} hover:bg-slate-400`;

  return (
    <Layout>
      {/* ▼▼▼ 스코프 오버라이드: MyPage 내부의 .rounded-2xl / .rounded-xl 을 전부 rounded-lg 로 강제 ▼▼▼ */}
      <div className="[&_.rounded-2xl]:rounded-lg [&_.rounded-xl]:rounded-lg">
        {/* 상단 메트릭 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {metricStats.map(({ label, value, Icon }) => (
            <MetricTile key={label} label={label} value={value} Icon={Icon} />
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
          {/* 좌측 칼럼 */}
          <div className="w-full lg:w-[320px] space-y-6">
            {/* 프로필 카드 */}
            <div className={`rounded-lg border border-slate-200 bg-gradient-to-br from-[#eef1f5] via-[#eef2f7] to-[#e7efff] ${SOFT_SHADOW}`}>
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-slate-800" />
                  <h3 className="text-sm font-semibold text-slate-800">Profile</h3>
                </div>

                <div className="mt-4 flex flex-col items-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-white/70 border-2 border-white shadow">
                    <img src={user.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <h2 className="text-xl font-extrabold text-slate-900">{user.username}</h2>
                  <p className="text-sm text-slate-600">{user.email}</p>
                </div>

                {!isEditing && (
                  <p className="mt-3 text-[13px] leading-5 text-slate-600 text-center">
                    {user.introduction?.trim()
                      ? user.introduction
                      : "Passionate diver exploring Asia's beautiful underwater world. Love photographing marine life and discovering new dive sites."}
                  </p>
                )}

                <div className="mt-4 space-y-2">
                  {!isEditing ? (
                    <>
                      <div className={`rounded-lg border border-slate-200 bg-white/60 backdrop-blur-sm px-3 py-2 ${SOFT_SHADOW}`}>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Globe className="w-3.5 h-3.5 shrink-0" />
                          <span>Country</span>
                        </div>
                        <div className="mt-0.5 text-sm font-medium text-slate-800">
                          {user.country || "-"}
                        </div>
                      </div>

                      <div className={`rounded-lg border border-slate-200 bg-white/60 backdrop-blur-sm px-3 py-2 ${SOFT_SHADOW}`}>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Award className="w-3.5 h-3.5 shrink-0" />
                          <span>License</span>
                        </div>
                        <div className="mt-0.5 text-sm font-medium text-slate-800">
                          {user.license || "-"}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Change Photo
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>

                      <input
                        className="border p-2 w-full rounded bg-white/90"
                        placeholder="Enter username"
                        value={user.username}
                        onChange={handleChange("username")}
                      />
                      {errors.username && <p className="text-xs text-red-500 -mt-1 mb-1">{errors.username}</p>}

                      <input
                        className="border p-2 w-full rounded bg-white/90"
                        placeholder="Enter email"
                        value={user.email}
                        onChange={handleChange("email")}
                      />
                      {errors.email && <p className="text-xs text-red-500 -mt-1 mb-1">{errors.email}</p>}

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
                      {errors.country && <p className="text-xs text-red-500 -mt-1 mb-1">{errors.country}</p>}

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
                      {errors.license && <p className="text-xs text-red-500 -mt-1 mb-1">{errors.license}</p>}

                      <textarea
                        className="border p-2 w-full rounded bg-white/90"
                        placeholder="Enter introduction"
                        value={user.introduction}
                        onChange={handleChange("introduction")}
                      />
                    </>
                  )}
                </div>

                <div className="mt-4">
                  {isOwnPage ? (
                    isEditing ? (
                      <div className="flex gap-2">
                        {/* 저장/취소는 Primary 유지 */}
                        <button
                          type="button"
                          onClick={handleSaveProfile}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="flex-1 bg-gray-200 hover:bg-gray-300 text-slate-800 font-semibold py-2 px-4 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      // ⬇ 모양(폭/패딩/아이콘 정렬)은 유지, 색만 라이트 → hover 진하게
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className={`w-full inline-flex items-center justify-center gap-2 ${BTN_LIGHT}`}
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Profile
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={openComposerForProfileUser}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      Send Message
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ▼▼ Bucket List: 버튼 톤 통일(라이트 → hover 더 진하게) ▼▼ */}
            <section className={CARD}>
              <div className={SECTION_HEAD}>
                <h3 className="text-sm font-semibold text-slate-800">Bucket List</h3>
              </div>
              <div className="px-6 pb-6">
                {bucketList.length === 0 ? (
                  <div className="rounded-md bg-slate-50 px-3 py-3 text-slate-500">
                    No items added yet.
                  </div>
                ) : (
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    {bucketList.map((item) => (
                      <li key={item.id ?? item}>{item.title ?? item}</li>
                    ))}
                  </ul>
                )}

                {isOwnPage && (
                  <div className="mt-3 space-y-2">
                    {showBucketInput ? (
                      <>
                        <input
                          className="w-full border border-slate-300 rounded px-3 py-2"
                          placeholder="Add new bucket item..."
                          value={newBucketTitle}
                          onChange={(e) => setNewBucketTitle(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddBucket()}
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleAddBucket}
                            className={`${BTN_LIGHT} flex-1`}
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowBucketInput(false)}
                            className={`${BTN_LIGHT} flex-1`}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowBucketInput(true)}
                        className={`${BTN_LIGHT} w-full`}
                      >
                        Add Item
                      </button>
                    )}
                  </div>
                )}
              </div>
            </section>
            {/* ▲▲ Bucket List 끝 ▲▲ */}

            {/* ▼▼ Friends: 메시지 아이콘 버튼, Add Friend 없음 ▼▼ */}
            {isOwnPage && (
              <section className={CARD}>
                <div className={SECTION_HEAD}>
                  <h3 className="text-sm font-semibold text-slate-800">Friends</h3>
                </div>
                <div className="px-6 pb-6">
                  <ul className="divide-y divide-slate-200">
                    {friends.map((friend) => (
                      <li key={friend.id} className="flex items-center justify-between py-2">
                        <Link
                          to={`/user/${friend.username}`}
                          className="text-sm font-medium text-slate-800 hover:underline"
                        >
                          {friend.displayName}
                        </Link>
                        <button
                          type="button"
                          aria-label={`Message ${friend.displayName}`}
                          onClick={() => openComposerFor(friend)}
                          className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-50"
                          title="Message"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
            {/* ▲▲ Friends 끝 ▲▲ */}
          </div>

          {/* 중앙 칼럼 */}
          <div className="flex-1 space-y-6 lg:-ml-4">
            {/* My Skills */}
            <section className={CARD}>
              <div className={SECTION_HEAD}>
                <h3 className="text-sm font-semibold text-slate-800">My Skills</h3>
              </div>
              <div className="px-6 pb-6">
                <div className="mx-auto w-full">
                  <SkillCard skill={skillData} />
                </div>
              </div>
            </section>

           {/* ===== Recent Dives (header + up to 3 cards) ===== */}
          <section className={CARD}>
            {/* 섹션 헤더 (다른 섹션과 동일 크기/톤) */}
            <div className={`${SECTION_HEAD} flex items-center justify-between`}>
              <h3 className="text-sm font-semibold text-slate-800">Recent Dives</h3>
              <button
                type="button"
                onClick={() => navigate("/logs")}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                View All →
              </button>
            </div>

            {/* 카드 리스트 */}
            <div className="px-6 pb-6">
              {Array.isArray(logs) && logs.length > 0 ? (
                <ul className="space-y-4">
                  {logs.slice(0, 3).map((log) => {
                    const normalized = {
                      id: log.id ?? log.uuid ?? String(Math.random()),
                      dive_title: (getField(log, ["title", "dive_title"]) || "Untitled Dive"),
                      dive_site: (getField(log, ["dive_site", "site", "spot", "location"]) || "-"),
                      dive_date: (getField(log, ["date", "dive_date", "logged_at"]) || ""),
                      max_depth: getField(log, ["max_depth", "depth"]) ?? "",
                      bottom_time: getField(log, ["bottom_time", "dive_time", "duration"]) ?? "",
                    };
                    return (
                      <li key={normalized.id}>
                        <LogCard log={normalized} />
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="rounded-lg bg-slate-50 p-6 text-center text-slate-500 shadow-inner">
                  No logs yet.
                </div>
              )}
            </div>
          </section>
          {/* ===== /Recent Dives ===== */}


            {/* Dive Depth Trend */}
            <section className={CARD}>
              <div className={SECTION_HEAD}>
                <h3 className="text-sm font-semibold text-slate-800">Dive Depth Trend</h3>
              </div>
              <div className="px-6 pb-6">
                <ChartBox logs={logs} />
              </div>
            </section>

            {/* Certification Timeline */}
            <section className={CARD}>
              <div className={SECTION_HEAD}>
                <h3 className="text-sm font-semibold text-slate-800">Certification Timeline</h3>
              </div>
              <div className="px-6 pb-6">
                <TimelineBox milestones={timelineItems} />
              </div>
            </section>

            {/* Dive Spots Map */}
            <section className={CARD}>
              <div className={SECTION_HEAD}>
                <h3 className="text-sm font-semibold text-slate-800">Dive Spots Map</h3>
              </div>
              <div className="px-6 pb-6">
                <div className={`rounded-lg bg-white p-3 ${SOFT_SHADOW}`}>
                  <DiveMapBox spots={spots} center={mapCenter} />
                </div>
              </div>
            </section>

            {/* Dive Heatmap */}
            <section className={CARD}>
              <div className={SECTION_HEAD}>
                <h3 className="text-sm font-semibold text-slate-800">Dive Heatmap</h3>
              </div>
              <div className="px-6 pb-6">
                <DiveHeatmapBox data={[]} />
              </div>
            </section>
          </div>
        </div>
      </div>
      {/* ▲▲▲ 스코프 오버라이드 끝 ▲▲▲ */}

      {isOwnPage && (
        <button
          type="button"
          onClick={() => navigate("/log/new")}
          className="fixed bottom-8 right-8 bg-gray-500 hover:bg-gray-400 text-white text-lg font-bold py-3 px-5 rounded-full shadow-lg"
        >
          ✍️ Add Log
        </button>
      )}

      <MessageComposer
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        defaultReceiver={composerReceiver}
      />
    </Layout>
  );
}

function MetricTile({ label, value, Icon }) {
  const SOFT_SHADOW = "shadow-[0_1px_3px_rgba(2,6,23,0.06),0_0_0_1px_rgba(2,6,23,0.04)]";
  return (
    <div className={`rounded-lg bg-white px-5 py-4 text-center ${SOFT_SHADOW}`}>
      {Icon && <Icon className="w-4 h-4 text-slate-900 mx-auto mb-0.5" />}
      <div className="text-xl font-extrabold text-slate-900 leading-tight">{value}</div>
      <div className="text-[12px] text-slate-600 mt-0.5 leading-tight">{label}</div>
    </div>
  );
}
MetricTile.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  Icon: PropTypes.elementType,
};

MyPage.propTypes = {
  isOwnPage: PropTypes.bool,
};

export default MyPage;
