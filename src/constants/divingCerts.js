// src/constants/divingCerts.js
// PADI 레벨과 스페셜티, 테크 계열 전체를 한 곳에 정리한 상수
// 이 파일만 수정하면 앱 전역의 표기가 모두 동기화된다.

export const CERT_TREE = {
  recreational: {
    title: "Recreational (Non-Professional) Certifications",
    groups: [
      {
        id: "beginner",
        title: "Beginner",
        items: [
          {
            id: "padi-scuba-diver",
            name: "PADI Scuba Diver",
            desc:
              "Limited certification. Max depth 12m/40ft, must dive with a professional.",
            maxDepthM: 12,
          },
          {
            id: "padi-open-water-diver",
            name: "PADI Open Water Diver",
            desc:
              "Full entry-level certification. Max depth 18m/60ft.",
            maxDepthM: 18,
          },
        ],
      },
      {
        id: "advanced",
        title: "Advanced",
        items: [
          {
            id: "padi-advanced-ow",
            name: "PADI Advanced Open Water Diver",
            desc:
              "Five adventure dives, including deep and navigation. Max depth 30m/100ft.",
            maxDepthM: 30,
          },
          {
            id: "padi-adventure-diver",
            name: "PADI Adventure Diver",
            desc:
              "Three adventure dives as a partial version of Advanced.",
          },
        ],
      },
      {
        id: "rescue",
        title: "Rescue & Safety",
        items: [
          {
            id: "padi-rescue-diver",
            name: "PADI Rescue Diver",
            desc: "Learn to manage and respond to dive emergencies.",
          },
          {
            id: "efr",
            name: "Emergency First Response (EFR)",
            desc: "CPR and first aid required for Rescue Diver.",
          },
        ],
      },
      {
        id: "master",
        title: "Master",
        items: [
          {
            id: "padi-master-scuba-diver",
            name: "PADI Master Scuba Diver",
            desc:
              "Highest non-professional rating. Requires Rescue Diver, 5 specialties, and 50 logged dives.",
            requirements: {
              rescue: true,
              specialties: 5,
              loggedDives: 50,
            },
          },
        ],
      },
    ],
  },

  specialties: {
    title: "Specialty Diver Certifications",
    items: [
      "Deep Diver",
      "Night Diver",
      "Wreck Diver",
      "Underwater Navigation",
      "Peak Performance Buoyancy",
      "Enriched Air Diver (Nitrox)",
      "Dry Suit Diver",
      "Search and Recovery Diver",
      "Drift Diver",
      "Altitude Diver",
      "Boat Diver",
      "Sidemount Diver",
      "Digital Underwater Photographer",
      "Underwater Naturalist",
      "Multilevel Diver",
      "Fish Identification",
      "Ice Diver",
      "Cavern Diver",
      "Self-Reliant Diver",
    ],
  },

  professional: {
    title: "Professional Certifications",
    groups: [
      {
        id: "leadership",
        title: "Leadership & Teaching",
        items: [
          "PADI Divemaster",
          "PADI Assistant Instructor",
          "PADI Open Water Scuba Instructor (OWSI)",
          "PADI Specialty Instructor",
          "PADI Master Scuba Diver Trainer (MSDT)",
          "PADI IDC Staff Instructor",
          "PADI Master Instructor",
          "PADI Course Director",
        ],
      },
    ],
  },

  tec: {
    title: "Technical Diving Certifications (TecRec Program)",
    groups: [
      {
        id: "tec-deep",
        title: "Tec Deep Diver Series",
        items: ["Tec 40", "Tec 45", "Tec 50"],
      },
      {
        id: "tec-advanced",
        title: "Advanced Technical",
        items: [
          "Tec Trimix 65",
          "Tec Trimix Diver",
          "Tec Sidemount Diver",
          "Tec Gas Blender",
        ],
      },
      {
        id: "rebreather",
        title: "Rebreather Diver",
        items: ["PADI Rebreather Diver", "Advanced Rebreather Diver"],
      },
    ],
  },
};

// 헬퍼: 마스터 다이버 요건 충족 여부 계산
export function evaluateMasterProgress({
  logs = 0,
  hasRescue = false,
  specialtyCount = 0,
}) {
  const req = { rescue: true, specialties: 5, loggedDives: 50 };
  return {
    rescueDone: !!hasRescue,
    specialtiesDone: specialtyCount >= req.specialties,
    divesDone: logs >= req.loggedDives,
    remainingDives: Math.max(req.loggedDives - logs, 0),
  };
}

// 레벨별 색상 매핑
export const LEVEL_COLORS = {
  "scuba diver": "bg-green-500",
  "open water": "bg-green-500",
  "advanced": "bg-blue-500",
  "adventure": "bg-blue-400",
  "rescue": "bg-orange-500",
  "master scuba diver": "bg-purple-500",
  "divemaster": "bg-red-500",
  "instructor": "bg-red-600",
  "tec": "bg-gray-800",
  "trimix": "bg-gray-700",
  "rebreather": "bg-gray-600",
};

// 레벨명으로 색상 찾기
export function getLevelColor(level) {
  if (!level) return "bg-gray-400";
  const lv = level.toLowerCase();
  const matchedKey = Object.keys(LEVEL_COLORS).find((k) =>
    lv.includes(k)
  );
  return matchedKey ? LEVEL_COLORS[matchedKey] : "bg-gray-400";
}
