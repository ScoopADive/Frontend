// src/components/sections/CertificationsRoadmap.jsx
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { CERT_TREE, evaluateMasterProgress } from "../../constants/divingCerts";

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-md">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <span className="text-base font-semibold text-gray-800">{title}</span>
        <span className="text-sm text-gray-500">{open ? "Hide" : "Show"}</span>
      </button>
      {open && <div className="border-t px-4 py-3">{children}</div>}
    </div>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  defaultOpen: PropTypes.bool,
};

export default function CertificationsRoadmap({
  currentLevel,
  logs,
  specialties, // array of strings
}) {
  const specialtyCount = Array.isArray(specialties) ? specialties.length : 0;
  const hasRescue = specialties?.some((s) => s.toLowerCase().includes("rescue")) || currentLevel?.toLowerCase().includes("rescue");
  const masterEval = useMemo(
    () => evaluateMasterProgress({ logs, hasRescue, specialtyCount }),
    [logs, hasRescue, specialtyCount]
  );

  return (
    <div className="space-y-4">
      {/* 현재 레벨 및 마스터 진행도 */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Certification Overview</h3>
            <p className="text-sm text-gray-600">
              Current level: <span className="font-medium">{currentLevel || "Open Water Diver"}</span> · Logged dives:{" "}
              <span className="font-medium">{logs}</span>
            </p>
          </div>
          <div className="w-full sm:w-72">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${Math.min((logs / 50) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {masterEval.remainingDives} more dives to reach Master Scuba Diver requirement of 50 dives
            </p>
          </div>
        </div>

        {/* 마스터 체크리스트 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 text-sm">
          <div className={`rounded-lg border p-3 ${masterEval.rescueDone ? "border-green-400 bg-green-50" : "border-gray-200"}`}>
            <p className="font-medium">Rescue Diver</p>
            <p className="text-gray-600">{masterEval.rescueDone ? "Completed" : "Not yet"}</p>
          </div>
          <div className={`rounded-lg border p-3 ${masterEval.specialtiesDone ? "border-green-400 bg-green-50" : "border-gray-200"}`}>
            <p className="font-medium">Specialties</p>
            <p className="text-gray-600">{specialtyCount} / 5</p>
          </div>
          <div className={`rounded-lg border p-3 ${masterEval.divesDone ? "border-green-400 bg-green-50" : "border-gray-200"}`}>
            <p className="font-medium">Logged dives</p>
            <p className="text-gray-600">{logs} / 50</p>
          </div>
        </div>
      </div>

      {/* 레크리에이션 */}
      <Section title={CERT_TREE.recreational.title}>
        <div className="space-y-4">
          {CERT_TREE.recreational.groups.map((g) => (
            <div key={g.id}>
              <p className="text-sm font-semibold text-gray-700 mb-1">{g.title}</p>
              <ul className="space-y-2">
                {g.items.map((it) => (
                  <li key={it.id} className="border rounded-lg p-3">
                    <p className="font-medium text-gray-800">{it.name}</p>
                    {it.desc && <p className="text-sm text-gray-600 mt-1">{it.desc}</p>}
                    {"maxDepthM" in it && (
                      <p className="text-xs text-gray-500 mt-1">Max depth {it.maxDepthM} m</p>
                    )}
                    {it.requirements && (
                      <div className="text-xs text-gray-600 mt-2">
                        <p>Requirements</p>
                        <ul className="list-disc list-inside">
                          <li>Rescue Diver</li>
                          <li>5 specialties</li>
                          <li>50 logged dives</li>
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* 스페셜티 태그 */}
      <Section title={CERT_TREE.specialties.title}>
        <div className="flex flex-wrap gap-2">
          {CERT_TREE.specialties.items.map((s) => {
            const owned = specialties?.some((x) => x.toLowerCase() === s.toLowerCase());
            return (
              <span
                key={s}
                className={`px-2 py-1 rounded-full text-xs border ${
                  owned ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                {s}
              </span>
            );
          })}
        </div>
      </Section>

      {/* 프로 레벨 */}
      <Section title={CERT_TREE.professional.title}>
        <div className="space-y-4">
          {CERT_TREE.professional.groups.map((g) => (
            <div key={g.id}>
              <p className="text-sm font-semibold text-gray-700 mb-1">{g.title}</p>
              <ul className="grid sm:grid-cols-2 gap-2">
                {g.items.map((name) => (
                  <li key={name} className="border rounded-lg p-3 text-sm text-gray-800">{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* 테크 */}
      <Section title={CERT_TREE.tec.title}>
        <div className="space-y-4">
          {CERT_TREE.tec.groups.map((g) => (
            <div key={g.id}>
              <p className="text-sm font-semibold text-gray-700 mb-1">{g.title}</p>
              <ul className="grid sm:grid-cols-2 gap-2">
                {g.items.map((name) => (
                  <li key={name} className="border rounded-lg p-3 text-sm text-gray-800">{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

CertificationsRoadmap.propTypes = {
  currentLevel: PropTypes.string,
  logs: PropTypes.number.isRequired,
  specialties: PropTypes.arrayOf(PropTypes.string),
};
