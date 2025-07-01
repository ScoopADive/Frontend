import Layout from "../components/layout/Layout";

const HelpPage = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">도움말</h1>
        <p className="text-gray-600 mb-6">
          ScoopADive에 대해 궁금한 점이 있으신가요? 자주 묻는 질문과 사용 가이드를 아래에 정리해두었습니다.
        </p>

        {/* 계정 관련 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">📌 계정 관련</h2>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>
              <strong>비밀번호를 잊었어요:</strong>{" "}
              <span className="text-blue-600">/forgot-password</span> 페이지에서 재설정할 수 있어요.
            </li>
            <li>
              <strong>이메일을 변경하고 싶어요:</strong> 마이페이지에서 수정 기능은 아직 준비 중이에요.
            </li>
            <li>
              <strong>회원탈퇴는 어떻게 하나요?</strong> 고객센터로 문의해주세요.
            </li>
          </ul>
        </section>

        {/* 다이브 로그 관련 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">📘 다이브 로그 관련</h2>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>다이브 로그는 최대 50개까지 저장됩니다.</li>
            <li>위치 정보는 수동 입력 혹은 지도에서 선택할 수 있어요.</li>
            <li>로그를 수정하려면 로그 상세 페이지 오른쪽 상단의 "수정" 버튼을 눌러주세요.</li>
          </ul>
        </section>

        {/* 친구/채팅 기능 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">👥 친구 & 채팅</h2>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>친구는 마이페이지에서 검색 후 추가할 수 있어요.</li>
            <li>친구 프로필에서 바로 채팅을 시작할 수 있어요.</li>
            <li>현재는 1:1 채팅만 가능하며, 그룹 채팅은 준비 중입니다.</li>
          </ul>
        </section>

        {/* 문의 */}
        <section className="text-center mt-10">
          <p className="text-sm text-gray-500 mb-2">원하시는 답변이 없으신가요?</p>
          <a
            href="mailto:support@scoopadive.com"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            고객센터에 문의하기 →
          </a>
        </section>
      </div>
    </Layout>
  );
};

export default HelpPage;

