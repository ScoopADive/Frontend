import React from "react";
import {
  Trophy,
  BookOpen,
  Compass,
  ChevronRight,
  AlertTriangle,
  Gauge,
  Anchor,
  Calendar,
} from "lucide-react";

/** ---------------------------------------------
 *  더미 데이터 (백엔드 연동 전까지 사용)
 *  - 실제 연결 시 동일한 필드로 API 응답 맞추면 교체만 하면 됨
 * --------------------------------------------- */
const profile = {
  level: "Open Water Diver",
  totalDives: { value: 42, goal: 50 },
  specialties: { value: 3, goal: 5 },
};

const masterRequirements = {
  // Master Scuba Diver 요건 예시
  requiredCert: "Rescue Certification",
  specialties: { have: 3, need: 5 }, // 5개 필요
  loggedDives: { have: 42, need: 50 }, // 50회 필요
};

const recommended = [
  {
    id: "rescue",
    order: 1,
    title: "Rescue Diver",
    badge: "Essential",
    impact: "high",
    durationDays: "3-4 days",
    dives: "4-5",
    summary:
      "Master emergency response and diver assistance skills. Critical for Master Scuba Diver.",
    benefits: ["Emergency preparedness", "Leadership skills", "Required for Master cert"],
    cta: "#",
  },
  {
    id: "wreck",
    order: 2,
    title: "Wreck Diver Specialty",
    badge: "Specialty",
    impact: "medium",
    durationDays: "2 days",
    dives: "4",
    summary:
      "Explore sunken vessels and artificial reefs with proper techniques and safety.",
    benefits: ["Wreck penetration skills", "Historical exploration", "Counts toward Master"],
    cta: "#",
  },
  {
    id: "ppb",
    order: 3,
    title: "Peak Performance Buoyancy",
    badge: "Specialty",
    impact: "medium",
    durationDays: "2 days",
    dives: "2",
    summary:
      "Perfect your buoyancy control for better air consumption and coral protection.",
    benefits: ["Improve air efficiency", "Better photos", "Environmental protection"],
    cta: "#",
  },
  {
    id: "guided",
    order: 4,
    title: "Guided Dive Experience",
    badge: "Practice",
    impact: "high",
    durationDays: "Flexible",
    dives: "8",
    summary:
      "You need 8 more dives to reach 50 logged dives for Master cert.",
    benefits: ["Build experience", "Apply learned skills", "Meet dive requirements"],
    cta: "#",
  },
];

const catalog = {
  recreational: [
    { title: "Open Water Diver", desc: "Entry-level certification for recreational diving", meta: "Max depth: 18m" },
    { title: "Advanced Open Water Diver", desc: "Enhanced skills and deeper diving", meta: "Max depth: 30m" },
    { title: "Rescue Diver", desc: "Emergency response and diver assistance skills" },
    { title: "Master Scuba Diver", desc: "Highest recreational rating" },
  ],
  specialties: [
    "Deep Diver",
    "Wreck Diver",
    "Night Diver",
    "Underwater Photography",
    "Peak Performance Buoyancy",
    "Enriched Air (Nitrox)",
    "Drift Diver",
    "Search and Recovery",
    "Fish Identification",
    "Underwater Navigator",
  ],
};

/** ---------------------------------------------
 *  작은 UI 컴포넌트
 * --------------------------------------------- */

// 통계 카드 (현재 레벨 / 총 다이브 / 스페셜티)
function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-50">
        <Icon className="h-5 w-5 text-indigo-600" />
      </div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-base font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );
}

// 진행 바 (라벨 + 현재/목표)
function LabeledProgress({ label, now, goal, rightNote }) {
  const pct = Math.min(100, Math.round((now / goal) * 100));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
        <span>{label}</span>
        <div className="flex items-center gap-2">
          {rightNote ? <span className="text-gray-400">{rightNote}</span> : null}
          <span className="font-medium text-gray-800">
            {now} / {goal}
          </span>
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full bg-indigo-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// 칩
function Chip({ children, tone = "default" }) {
  const map = {
    default:
      "bg-gray-100 text-gray-700 border border-gray-200",
    essential:
      "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100",
    specialty:
      "bg-sky-50 text-sky-700 border border-sky-100",
    practice:
      "bg-emerald-50 text-emerald-700 border border-emerald-100",
    high:
      "bg-rose-50 text-rose-700 border border-rose-100",
    medium:
      "bg-amber-50 text-amber-700 border border-amber-100",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] ${map[tone] || map.default}`}
    >
      {children}
    </span>
  );
}

// 추천 카드
function RecommendationCard({
  order,
  title,
  badge,
  impact,
  durationDays,
  dives,
  summary,
  benefits,
  cta,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gray-50">
            <Trophy className="h-5 w-5 text-gray-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-gray-900 text-[10px] font-semibold text-white">
                {order}
              </span>
              <h3 className="text-base font-semibold text-gray-900">{title}</h3>
              {badge === "Essential" && <Chip tone="essential">Essential</Chip>}
              {badge === "Specialty" && <Chip tone="specialty">Specialty</Chip>}
              {badge === "Practice" && <Chip tone="practice">Practice</Chip>}
            </div>
            <p className="mt-1 text-sm text-gray-600">{summary}</p>
          </div>
        </div>
        <a
          href={cta}
          className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800"
        >
          Learn More <ChevronRight className="h-4 w-4" />
        </a>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
        <Chip tone={impact === "high" ? "high" : "medium"}>
          {impact === "high" ? "high impact" : "medium impact"}
        </Chip>
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" /> Duration: {durationDays}
        </span>
        <span className="inline-flex items-center gap-1">
          <Anchor className="h-3.5 w-3.5" /> Dives: {dives}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {benefits.map((b) => (
          <Chip key={b}>{b}</Chip>
        ))}
      </div>
    </div>
  );
}

/** ---------------------------------------------
 *  메인 페이지
 * --------------------------------------------- */
export default function TrainingPage() {
  // 진행도 숫자 계산
  const specRemain = Math.max(0, masterRequirements.specialties.need - masterRequirements.specialties.have);
  const diveRemain = Math.max(0, masterRequirements.loggedDives.need - masterRequirements.loggedDives.have);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* ← Back */}
      <button
        className="mb-3 text-sm text-gray-500 hover:text-gray-700"
        onClick={() => window.history.back()}
      >
        ← Back
      </button>

      {/* 헤더 */}
      <h1 className="mb-1 text-3xl font-bold text-gray-900">Your Learning Path</h1>
      <p className="mb-6 text-sm text-gray-500">
        Personalized course recommendations based on your diving profile
      </p>

      {/* 상단 통계 */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Compass} label="Current Level" value={profile.level} />
        <StatCard
          icon={Gauge}
          label="Total Dives"
          value={`${profile.totalDives.value} / ${profile.totalDives.goal}`}
        />
        <StatCard
          icon={BookOpen}
          label="Specialties"
          value={`${profile.specialties.value} / ${profile.specialties.goal}`}
        />
      </div>

      {/* Master Scuba Diver Progress 섹션 */}
      <section className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-indigo-700" />
          <h2 className="text-lg font-semibold text-indigo-900">
            Master Scuba Diver Progress
          </h2>
        </div>

        {/* 요구 자격 */}
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
          <Chip>
            Required certification
          </Chip>
          <span className="font-medium text-gray-800">
            {masterRequirements.requiredCert}
          </span>
          {profile.level !== "Rescue Diver" && (
            <span className="inline-flex items-center gap-1 text-rose-600">
              <AlertTriangle className="h-4 w-4" /> Complete Rescue first
            </span>
          )}
        </div>

        {/* 진행 바 2개 */}
        <div className="grid gap-4 md:grid-cols-2">
          <LabeledProgress
            label="Specialties"
            now={masterRequirements.specialties.have}
            goal={masterRequirements.specialties.need}
            rightNote={`${specRemain} more`}
          />
          <LabeledProgress
            label="Logged Dives"
            now={masterRequirements.loggedDives.have}
            goal={masterRequirements.loggedDives.need}
            rightNote={`${diveRemain} more`}
          />
        </div>

        {/* Next steps */}
        <div className="mt-4 rounded-xl border border-indigo-100 bg-white/70 p-4 text-sm text-gray-700">
          <span className="font-medium">Next Steps</span>
          <div className="mt-1 text-gray-600">
            Complete Rescue Diver certification first. Earn {specRemain} more specialty certifications. Log {diveRemain} more dives.
          </div>
        </div>
      </section>

      {/* Recommended For You */}
      <section className="mb-10">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">◎</span>
          <h3 className="text-lg font-semibold text-gray-900">Recommended For You</h3>
        </div>
        <div className="grid gap-4">
          {recommended.map((item) => (
            <RecommendationCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      {/* All Available Courses */}
      <section className="mb-20">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">▣</span>
          <h3 className="text-lg font-semibold text-gray-900">All Available Courses</h3>
        </div>

        {/* Recreational */}
        <div className="mb-4 text-sm font-medium text-gray-700">Recreational Diving</div>
        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          {catalog.recreational.map((c) => (
            <div key={c.title} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{c.title}</div>
                  <div className="text-xs text-gray-600">{c.desc}</div>
                </div>
                {c.meta && <Chip>{c.meta}</Chip>}
              </div>
            </div>
          ))}
        </div>

        {/* Specialty */}
        <div className="mb-4 text-sm font-medium text-gray-700">Specialty Courses</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.specialties.map((s) => (
            <button
              key={s}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-800 shadow-sm hover:border-gray-300 hover:bg-gray-50"
            >
              {s}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
