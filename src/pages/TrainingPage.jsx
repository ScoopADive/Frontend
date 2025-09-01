import React from "react";

const chapters = [
  {
    title: "Chapter 1: 스트레스와 구조자의 역할",
    summary: [
      "스트레스는 다이빙 사고의 주요 원인",
      "구조자는 상황을 조기에 인식하고 개입해야 함",
      "구조는 자신의 안전이 우선이며, 강제하지 말고 유도해야 함",
    ],
    questions: [
      "스트레스를 받는 다이버의 일반적인 징후 3가지를 쓰시오.",
      "구조자의 첫 번째 우선순위는 무엇인가?",
    ],
  },
  {
    title: "Chapter 2: 긴급상황 대비 및 장비",
    summary: [
      "비상 계획 수립 필수 (연락망, 장비 위치, 응급 절차)",
      "구조에 사용되는 장비들: SMB, 마우스 투 마우스 마스크, 구조 플로트 등",
    ],
    questions: [
      "SMB(수면 표시 부이)의 주요 목적은?",
      "비상 계획에 반드시 포함되어야 할 항목 3가지를 쓰시오.",
    ],
  },
  {
    title: "Chapter 3: 수면에서의 반응 없는 다이버 구조",
    summary: [
      "반응 없는 다이버 확인 → 호흡 확인 → 구조 호흡 제공 → 구조",
      "구조 중 끊임없이 주변 확인 (보트, 위험 요소 등)",
    ],
    questions: [
      "수면에서 반응 없는 다이버를 발견했을 때 처음으로 해야 할 조치는?",
      "구조 중 호흡이 없는 경우 취해야 할 조치는?",
    ],
  },
  {
    title: "Chapter 4: 수중에서의 구조",
    summary: [
      "수중에서 반응 없는 다이버 구조: 부력 확보 → 상승 → 호흡 확인",
      "상승 중 과팽창 상해 방지: 느리게, 공기 배출하며 상승",
    ],
    questions: [
      "수중에서 반응 없는 다이버를 끌어올릴 때 가장 중요한 점은?",
      "구조 상승 중 다이버의 폐 손상을 방지하는 방법은?",
    ],
  },
  {
    title: "Chapter 5: 사고 후 대처 및 보고",
    summary: [
      "사고 후 구조자의 진술이 중요",
      "DAN, Coast Guard, 응급센터 등에 정확하게 보고 필요",
    ],
    questions: [
      "사고 발생 후 구조자의 행동으로 올바르지 않은 것은? (객관식)",
      "구조자 진술서에는 어떤 내용이 포함되어야 하나요?",
    ],
  },
];

function TrainingPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Rescue Diver 교육 이론</h1>
      {chapters.map((ch, idx) => (
        <div key={idx} className="mb-8 bg-purple-100 rounded-lg p-5 shadow">
          <h2 className="text-lg font-semibold mb-2">{ch.title}</h2>
          <div className="mb-2">
            <span className="inline-block mr-2 text-yellow-500">🟡</span>
            <span className="font-medium">핵심 요약:</span>
            <ul className="list-disc ml-6 mt-1 text-gray-800">
              {ch.summary.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-medium">복습 문제 예시:</span>
            <ul className="list-decimal ml-6 mt-1 text-gray-800">
              {ch.questions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrainingPage;