// src/components/layout/Layout.jsx
import PropTypes from "prop-types";
import Footer from "./Footer";

/*
  Layout
  - 페이지 양옆 여백은 아주 조금만 남김 (px-3 기준, 모바일/데스크탑 공통)
  - max-width와 중앙 정렬 제거 → 꽉 차게
  - Footer 그대로 유지
*/

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 rounded bg-blue-600 px-3 py-2 text-white text-sm"
      >
        Skip to content
      </a>

      {/* 좌우 여백만 최소한으로 */}
      <main id="main" className="flex-1 w-full px-12 py-6">
        {children}
      </main>

      <Footer />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;

