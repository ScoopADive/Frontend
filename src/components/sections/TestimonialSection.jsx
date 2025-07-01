import { motion } from "framer-motion";

function TestimonialSection() {
  const testimonials = [
    {
      name: "Suzy",
      comment: "ScoopADive 덕분에 제 다이빙 기록을 정리하는 재미가 생겼어요!",
    },
    {
      name: "Minho",
      comment: "친구랑 로그 공유하고 이야기 나눌 수 있어서 너무 좋아요 🤿",
    },
    {
      name: "Jisoo",
      comment: "시각화 기능이 특히 좋아요. 내가 성장하고 있다는 게 보여요.",
    },
  ];

  return (
    <section className="bg-blue-50 py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-10">💬 사용자들의 이야기</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-xl shadow p-6 text-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-700 italic">“{t.comment}”</p>
              <p className="mt-4 text-sm font-semibold text-blue-600">– {t.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialSection;

