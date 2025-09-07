import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Input from '../components/common/Input';
import logService from '../services/logService';
import useUserStore from '../store/userStore';
import DiveSiteSelector from '../components/common/DiveSiteSelector';

function LogCreatePage() {
  const navigate = useNavigate();
  const storeUser = useUserStore((state) => state.user);

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState('');
  const [openSection, setOpenSection] = useState('general');

  const [form, setForm] = useState({
    dive_image: null,
    feeling: '',
    buddy: '',
    dive_title: '',
    dive_site: '',
    dive_coords: null,
    dive_date: '',
    max_depth: '',
    bottom_time: '',
    weather: 'sunny',
    type_of_dive: 'fun',
    equipment: [],
    weight: '',
    start_pressure: '',
    end_pressure: '',
    dive_center: '',
  });

  useEffect(() => {}, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageName(file.name);
      setForm((prev) => ({ ...prev, dive_image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddEquipment = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const value = e.target.value.trim();
      if (!form.equipment.includes(value)) {
        setForm((prev) => ({ ...prev, equipment: [...prev.equipment, value] }));
      }
      e.target.value = '';
    }
  };

  const handleRemoveEquipment = (item) => {
    setForm((prev) => ({ ...prev, equipment: prev.equipment.filter((eq) => eq !== item) }));
  };

  const handleReset = () => {
    if (!window.confirm('Are you sure you want to reset the entire form?')) return;
    setForm({
      dive_image: null,
      feeling: '',
      buddy: '',
      dive_title: '',
      dive_site: '',
      dive_coords: null,
      dive_date: '',
      max_depth: '',
      bottom_time: '',
      weather: 'sunny',
      type_of_dive: 'fun',
      equipment: [],
      weight: '',
      start_pressure: '',
      end_pressure: '',
      dive_center: '',
    });
    setImagePreview(null);
    setSelectedImageName('');
  };

  const requiredFields = [
    'buddy',
    'dive_title',
    'dive_site',
    'dive_date',
    'bottom_time',
    'max_depth',
    'start_pressure',
    'end_pressure',
    'weight',
  ];

  const handleSubmit = async () => {
    const missing = requiredFields.filter((f) => !form[f]);
    if (missing.length > 0) {
      alert(`❌ Missing required fields: ${missing.join(', ')}`);
      return;
    }

    try {
      const formData = new FormData();
      // equipment 배열
      form.equipment.forEach((eq) => formData.append('equipment', eq));

      // 나머지 필드
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'equipment') return;

        if (key === 'buddy') {
          if (value !== null && value !== '') {
            formData.append('buddy', value); // 문자열 그대로 전달
          }
        } else if (key === 'dive_center') {
          const centerId = Number(value);
          if (centerId) formData.append('dive_center', centerId);
        } else if (key === 'dive_coords') {
          if (value && Array.isArray(value)) {
            formData.append('latitude', value[0]);
            formData.append('longitude', value[1]);
          }
        } else if (value !== null && value !== '') {
          formData.append(key, value);
        }
      });

      const result = await logService.createLog(formData);
      alert('✅ Log created successfully!');
      navigate(`/log/${result.id}`);
    } catch (err) {
      const detail = err.response?.data?.detail || err.message;
      alert('❌ Log creation failed: ' + detail);
    }
  };

  const progressCount = requiredFields.filter((field) => form[field] && form[field] !== '').length;
  const progressPercent = Math.floor((progressCount / requiredFields.length) * 100);

  const sections = [
    { id: 'general', title: 'General Info (Required)' },
    { id: 'depth', title: 'Depth / Time (Required)' },
    { id: 'equipment', title: 'Equipment (Required)' },
    { id: 'environment', title: 'Environment' },
    { id: 'experience', title: 'Experience' },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-start gap-12">
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold mb-4">Create Dive Log</h1>

          {sections.map((section) => (
            <div key={section.id} className="border rounded overflow-hidden">
              <button
                className="w-full text-left px-6 py-3 font-semibold bg-gray-100 hover:bg-gray-200 transition"
                onClick={() => setOpenSection(section.id)}
              >
                {openSection === section.id ? '−' : '+'} {section.title}
              </button>

              {openSection === section.id && (
                <div className="p-6 space-y-4 bg-white border-t">
                  {section.id === 'general' && (
                    <>
                      <Input
                        label="Buddy"
                        value={form.buddy}
                        placeholder="Enter buddy name or nickname"
                        onChange={(e) => setForm((prev) => ({ ...prev, buddy: e.target.value }))}
                      />

                      <Input
                        label="Dive Title"
                        value={form.dive_title}
                        placeholder="Enter the title"
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, dive_title: e.target.value }))
                        }
                      />
                      <label className="block text-sm font-medium text-gray-700">Dive Site</label>
                      <DiveSiteSelector
                        value={form.dive_site}
                        onChange={(name) => setForm((prev) => ({ ...prev, dive_site: name }))}
                        onCoordsChange={(coords) =>
                          setForm((prev) => ({ ...prev, dive_coords: coords }))
                        }
                      />
                      <Input
                        label="Dive Date"
                        type="date"
                        value={form.dive_date}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, dive_date: e.target.value }))
                        }
                      />
                    </>
                  )}
                  {section.id === 'depth' && (
                    <>
                      <Input
                        label="Bottom Time"
                        value={form.bottom_time}
                        placeholder="00:00:00"
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, bottom_time: e.target.value }))
                        }
                      />
                      <Input
                        label="Max Depth (m)"
                        type="number"
                        value={form.max_depth}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, max_depth: e.target.value }))
                        }
                      />
                    </>
                  )}
                  {section.id === 'equipment' && (
                    <>
                      <Input
                        label="Start Pressure (bar)"
                        type="number"
                        value={form.start_pressure}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, start_pressure: e.target.value }))
                        }
                      />
                      <Input
                        label="End Pressure (bar)"
                        type="number"
                        value={form.end_pressure}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, end_pressure: e.target.value }))
                        }
                      />
                      <Input
                        label="Weight (kg)"
                        type="number"
                        value={form.weight}
                        onChange={(e) => setForm((prev) => ({ ...prev, weight: e.target.value }))}
                      />
                      <label className="block text-sm font-medium text-gray-700">
                        Equipment (Enter to add)
                      </label>
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
                  {section.id === 'environment' && (
                    <>
                      <label className="block text-sm font-medium text-gray-700">Weather</label>
                      <select
                        value={form.weather}
                        onChange={(e) => setForm((prev) => ({ ...prev, weather: e.target.value }))}
                        className="border p-2 w-full rounded"
                      >
                        <option value="sunny">Sunny</option>
                        <option value="cloudy">Cloudy</option>
                        <option value="rainy">Rainy</option>
                        <option value="stormy">Stormy</option>
                      </select>
                      <label className="block text-sm font-medium text-gray-700">
                        Type of Dive
                      </label>
                      <select
                        value={form.type_of_dive}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, type_of_dive: e.target.value }))
                        }
                        className="border p-2 w-full rounded"
                      >
                        <option value="fun">Fun</option>
                        <option value="training">Training</option>
                        <option value="night">Night</option>
                        <option value="deep">Deep</option>
                        <option value="wreck">Wreck</option>
                      </select>
                    </>
                  )}
                  {section.id === 'experience' && (
                    <>
                      <input type="file" accept="image/*" onChange={handleFileChange} />
                      {selectedImageName && (
                        <p className="text-xs text-gray-500">Selected: {selectedImageName}</p>
                      )}
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full max-h-80 rounded-xl object-cover"
                        />
                      )}
                      <Input
                        label="Dive Center (ID)"
                        placeholder="Enter dive center ID"
                        value={form.dive_center}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            dive_center: e.target.value.replace(/\D/g, ''),
                          }))
                        }
                      />
                      <Input
                        label="Feeling"
                        value={form.feeling}
                        onChange={(e) => setForm((prev) => ({ ...prev, feeling: e.target.value }))}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="grid grid-cols-3 gap-4 mt-8">
            <button
              onClick={handleReset}
              className="bg-red-400 text-white py-2.5 rounded-lg hover:bg-red-500 w-full"
            >
              Reset All
            </button>
            <button className="bg-gray-500 text-white py-2.5 rounded-lg hover:bg-gray-600 w-full">
              Save as Draft
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 w-full"
            >
              Publish
            </button>
          </div>
        </div>

        <div className="w-[400px] space-y-6">
          <div className="bg-white rounded-xl shadow p-4 text-sm space-y-2 leading-6">
            <h2 className="text-lg font-semibold mb-2">Dive Summary</h2>
            <p>
              <strong>Title:</strong> {form.dive_title || '-'}
            </p>
            <p>
              <strong>Date:</strong> {form.dive_date || '-'}
            </p>
            <p>
              <strong>Site:</strong> {form.dive_site || '-'}
            </p>
            <p>
              <strong>Depth:</strong> {form.max_depth ? `${form.max_depth} m` : '-'}
            </p>
            <p>
              <strong>Time:</strong> {form.bottom_time || '-'}
            </p>
            <p>
              <strong>Equipment:</strong> {form.equipment.join(', ') || '-'}
            </p>
            <p>
              <strong>Feeling:</strong> {form.feeling || '-'}
            </p>
            <div className="mt-3">
              <div className="text-xs text-gray-500 mb-1">Progress: {progressPercent}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-2.5 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default LogCreatePage;
