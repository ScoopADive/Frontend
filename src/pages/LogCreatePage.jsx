import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import logService from "../services/logService";
import useUserStore from "../store/userStore";

function LogCreatePage() {
  const navigate = useNavigate();
  const storeUser = useUserStore((state) => state.user);

  const [imagePreview, setImagePreview] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

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
    if (storeUser?.id && !form.buddy) {
      setForm((prev) => ({
        ...prev,
        buddy: String(storeUser.id),
      }));
    }
  }, [storeUser?.id]);

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
      form.equipment.forEach((eq) => formData.append("equipment", eq));

      Object.entries(form).forEach(([key, value]) => {
        if (key === "equipment") return;
        if (key === "buddy") {
          const buddyId = Number(value);
          if (!buddyId || isNaN(buddyId)) {
            throw new Error("Buddy ID must be a valid number.");
          }
          formData.append("buddy", buddyId);
        } else if (key === "dive_center") {
          const centerId = Number(value);
          if (centerId && !isNaN(centerId)) {
            formData.append("dive_center", centerId);
          }
        } else if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      const result = await logService.createLog(formData);
      if (!result?.id) {
        alert("✅ Log submitted but cannot move to detail page.");
        navigate("/mypage");
        return;
      }

      alert("✅ Log created successfully!");
      navigate(`/log/${result.id}`);
    } catch (err) {
      const detail =
        err.response?.data?.buddy?.[0] ||
        err.response?.data?.dive_center?.[0] ||
        err.response?.data?.detail ||
        err.message;

      alert("❌ Log creation failed: " + detail);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Create Dive Log</h1>

        {[
          { id: "general", title: "General Info (Required)" },
          { id: "depth", title: "Depth / Time (Required)" },
          { id: "equipment", title: "Equipment (Required)" },
          { id: "environment", title: "Environment" },
          { id: "experience", title: "Experience" },
        ].map((section) => (
          <div key={section.id} className="border rounded">
            <button
              className="w-full text-left px-4 py-3 font-semibold bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => toggleSection(section.id)}
            >
              + {section.title}
            </button>

            {openSection === section.id && (
              <div className="p-4 space-y-4 bg-white">

                {section.id === "general" && (
                  <>
                    <label className="block text-sm font-medium text-gray-700">Buddy (user ID)</label>
                    <input
                      type="text"
                      placeholder="Enter buddy user ID (ex. 1)"
                      value={form.buddy}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          buddy: e.target.value.replace(/\D/g, ""),
                        }))
                      }
                      className="border p-2 w-full rounded"
                    />
                    <Input label="Dive Title" value={form.dive_title} onChange={handleChange("dive_title")} />
                    <Input label="Dive Site" value={form.dive_site} onChange={handleChange("dive_site")} />
                    <Input label="Dive Date" type="date" value={form.dive_date} onChange={handleChange("dive_date")} />
                  </>
                )}

                {section.id === "depth" && (
                  <>
                    <Input label="Bottom Time (e.g. 00:35:00)" value={form.bottom_time} onChange={handleChange("bottom_time")} />
                    <Input label="Max Depth (m)" type="number" value={form.max_depth} onChange={handleChange("max_depth")} />
                  </>
                )}

                {section.id === "equipment" && (
                  <>
                    <Input label="Start Pressure" type="number" value={form.start_pressure} onChange={handleChange("start_pressure")} />
                    <Input label="End Pressure" type="number" value={form.end_pressure} onChange={handleChange("end_pressure")} />
                    <Input label="Weight (kg)" type="number" value={form.weight} onChange={handleChange("weight")} />

                    <label className="block text-sm font-medium text-gray-700">Suit (Enter to add)</label>
                    <input
                      type="text"
                      onKeyDown={handleAddEquipment}
                      placeholder="e.g., BCD, Octopus"
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
                  </>
                )}

                {section.id === "environment" && (
                  <>
                    <label className="block text-sm font-medium text-gray-700">Weather</label>
                    <select value={form.weather} onChange={handleChange("weather")} className="border p-2 w-full rounded">
                      <option value="sunny">Sunny</option>
                      <option value="cloudy">Cloudy</option>
                      <option value="rainy">Rainy</option>
                      <option value="stormy">Stormy</option>
                    </select>

                    <label className="block text-sm font-medium text-gray-700">Type of Dive</label>
                    <select value={form.type_of_dive} onChange={handleChange("type_of_dive")} className="border p-2 w-full rounded">
                      <option value="fun">Fun</option>
                      <option value="training">Training</option>
                      <option value="night">Night</option>
                      <option value="deep">Deep</option>
                      <option value="wreck">Wreck</option>
                    </select>
                  </>
                )}

                {section.id === "experience" && (
                  <>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    {imagePreview && <img src={imagePreview} alt="Preview" className="w-full rounded" />}
                    <Input
                      label="Dive Center (ID)"
                      placeholder="Enter dive center ID"
                      value={form.dive_center}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          dive_center: e.target.value.replace(/\D/g, ""),
                        }))
                      }
                    />
                    <Input label="Feeling" value={form.feeling} onChange={handleChange("feeling")} />
                  </>
                )}

              </div>
            )}
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4 mt-8">
          <button className="bg-gray-500 text-white py-3 rounded hover:bg-gray-600 w-full">
            Save as Draft
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700 w-full"
          >
            Publish
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default LogCreatePage;
