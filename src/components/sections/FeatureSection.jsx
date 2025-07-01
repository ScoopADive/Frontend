import { motion } from "framer-motion";

function FeatureSection() {
  const features = [
    {
      icon: "📘",
      title: "다이빙 로그를 간편하게 기록",
      description: "날짜, 장소, 수심, 기분 등 당신의 다이빙 경험을 손쉽게 저장하세요.",
    },
    {
      icon: "🤿",
      title: "친구와 함께 기록을 공유",
      description: "친구 추가 및 채팅 기능으로 다이빙 이야기를 나눠보세요.",
    },
    {
      icon: "📊",
      title: "내 기록을 시각화 분석",
      description: "로그 데이터를 기반으로 나의 성장 그래프를 확인할 수 있어요.",
    },
  ];

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">🚀 무엇을 할 수 있나요?</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              className="bg-gray-50 rounded-xl shadow-md p-6 text-left"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
