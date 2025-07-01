import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import logService from "../services/logService";
import userService from "../services/userService";
import Select from "react-select";
import useUserStore from "../store/userStore";

const BASE_URL = "http://13.125.160.47";

function LogCreatePage() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const storeUser = useUserStore((state) => state.user);

  const [form, setForm] = useState({
    dive_image: null,
    feeling: "",
    buddy: "",
    dive_title: "",
    dive_site: "",
    dive_date: "",
    max_depth: "",
    bottom_time: "",
    weather: "sunny",
    type_of_dive: "fun",
    equipment: [],
    weight: "",
    start_pressure: "",
    end_pressure: "",
    dive_center: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        const options = data.map((user) => ({
          value: user.id,
          label: `${user.username} (#${user.id})`,
        }));
        setUserOptions(options);
      } catch (err) {
        console.error("유저 목록 불러오기 실패", err);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, dive_image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddEquipment = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const value = e.target.value.trim();
      if (!form.equipment.includes(value)) {
        setForm((prev) => ({
          ...prev,
          equipment: [...prev.equipment, value],
        }));
      }
      e.target.value = "";
    }
  };

  const handleRemoveEquipment = (item) => {
    setForm((prev) => ({
      ...prev,
      equipment: prev.equipment.filter((eq) => eq !== item),
    }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // 배열 필드
      form.equipment.forEach((eq) => formData.append("equipment", eq));

      // 나머지 필드
      Object.entries(form).forEach(([key, value]) => {
        if (key === "equipment") return;

        if (key === "buddy") {
          const safeValue = value || storeUser?.id;
          formData.append("buddy", `${BASE_URL}/users/${safeValue}/`);
        } else if (key === "dive_center" && value) {
          formData.append("dive_center", `${BASE_URL}/dive-centers/${value}/`);
        } else if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      console.log("📦 제출된 FormData:", [...formData.entries()]);

      const result = await logService.createLog(formData);

      if (!result?.id) {
        alert("✅ 로그는 작성되었지만 상세 페이지로 이동할 수 없습니다.");
        navigate("/mypage");
        return;
      }

      alert("✅ 로그가 성공적으로 작성되었습니다!");
      navigate(`/log/${result.id}`);
    } catch (err) {
      console.error("🚨 로그 작성 실패:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      const detail = err.response?.data?.detail || err.message;
      alert("❌ 로그 작성 실패: " + detail);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Dive Log</h1>

        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
        {imagePreview && <img src={imagePreview} alt="미리보기" className="w-full rounded" />}

        <label className="block text-sm font-medium text-gray-700">Buddy</label>
        <Select
          options={userOptions}
          onChange={(selected) => setForm((prev) => ({ ...prev, buddy: selected.value }))}
          className="mb-2"
        />

        <Input label="Dive Title" value={form.dive_title} onChange={handleChange("dive_title")} />
        <Input label="Dive Site" value={form.dive_site} onChange={handleChange("dive_site")} />
        <Input label="Dive Date" type="date" value={form.dive_date} onChange={handleChange("dive_date")} />
        <Input label="Max Depth (m)" type="number" value={form.max_depth} onChange={handleChange("max_depth")} />
        <Input label="Bottom Time (e.g. 00:35:00)" value={form.bottom_time} onChange={handleChange("bottom_time")} />

        <label className="block text-sm font-medium text-gray-700">Weather</label>
        <select value={form.weather} onChange={handleChange("weather")} className="border p-2 w-full rounded mb-2">
          <option value="sunny">Sunny ☀️</option>
          <option value="cloudy">Cloudy ☁️</option>
          <option value="rainy">Rainy 🌧️</option>
          <option value="stormy">Stormy 🌩️</option>
        </select>

        <label className="block text-sm font-medium text-gray-700">Type of Dive</label>
        <select value={form.type_of_dive} onChange={handleChange("type_of_dive")} className="border p-2 w-full rounded mb-2">
          <option value="fun">Fun</option>
          <option value="training">Training</option>
          <option value="night">Night</option>
          <option value="deep">Deep</option>
          <option value="wreck">Wreck</option>
        </select>

        <label className="block text-sm font-medium text-gray-700">Equipment (Enter로 추가)</label>
        <input
          type="text"
          onKeyDown={handleAddEquipment}
          placeholder="BCD, Octopus 등 입력 후 Enter"
          className="border p-2 w-full rounded"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {form.equipment.map((item) => (
            <span
              key={item}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm cursor-pointer"
              onClick={() => handleRemoveEquipment(item)}
            >
              {item} ✕
            </span>
          ))}
        </div>

        <Input label="Weight (kg)" type="number" value={form.weight} onChange={handleChange("weight")} />
        <Input label="Start Pressure" type="number" value={form.start_pressure} onChange={handleChange("start_pressure")} />
        <Input label="End Pressure" type="number" value={form.end_pressure} onChange={handleChange("end_pressure")} />
        <Input label="Dive Center (ID)" value={form.dive_center} onChange={handleChange("dive_center")} />
        <Input label="Feeling" value={form.feeling} onChange={handleChange("feeling")} />

        <Button text="Publish" onClick={handleSubmit} />
      </div>
    </Layout>
  );
}

export default LogCreatePage;
