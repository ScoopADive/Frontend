import { useState } from "react";
import Layout from "../components/layout/Layout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

function LogCreatePage() {
  const [log, setLog] = useState({
    title: "",
    site: "",
    date: "",
    depth: "",
    time: "",
    weather: "Clear",
    temperature: "",
    equipment: "",
    mood: "",
    notes: "",
  });

  const handleChange = (field) => (e) => {
    setLog({ ...log, [field]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("New Dive Log:", log);
    alert("📝 로그가 작성되었습니다! (실제 저장은 미구현)");
    // 추후 백엔드 연동 예정
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Dive Log</h1>
        <Input label="Dive Title" value={log.title} onChange={handleChange("title")} />
        <Input label="Dive Site" value={log.site} onChange={handleChange("site")} />
        <Input label="Date" value={log.date} onChange={handleChange("date")} type="date" />
        <Input label="Max Depth (m)" value={log.depth} onChange={handleChange("depth")} />
        <Input label="Bottom Time (min)" value={log.time} onChange={handleChange("time")} />
        
        <label className="block text-sm font-medium text-gray-700">Weather</label>
        <select
          value={log.weather}
          onChange={handleChange("weather")}
          className="border p-2 w-full rounded mb-2"
        >
          <option value="Clear">Clear</option>
          <option value="Cloudy">Cloudy</option>
          <option value="Rainy">Rainy</option>
        </select>

        <Input label="Water Temperature (°C)" value={log.temperature} onChange={handleChange("temperature")} />
        <Input label="Equipment" value={log.equipment} onChange={handleChange("equipment")} />
        <Input label="Mood" value={log.mood} onChange={handleChange("mood")} />
        <Input label="Notes" value={log.notes} onChange={handleChange("notes")} />

        <Button text="Publish" onClick={handleSubmit} />
      </div>
    </Layout>
  );
}

export default LogCreatePage;


