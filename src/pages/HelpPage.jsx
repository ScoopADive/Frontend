import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";

const HelpPage = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* 제목 */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Help Center</h1>
          <p className="text-gray-600">
            Need help with ScoopADive? Check out the frequently asked questions and guides below.
          </p>
        </div>

        {/* 계정 관련 */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-pink-600">📌 Account</h2>
          <ul className="text-gray-700 list-disc list-inside space-y-1">
            <li>
              Forgot your password?{" "}
              <Link to="/forgot-password" className="text-blue-600 underline">
                Reset it here
              </Link>
              .
            </li>
            <li>
              Want to change your email? This feature is being prepared in{" "}
              <span className="font-medium text-gray-800">My Page</span>.
            </li>
            <li>
              Want to delete your account? Please contact{" "}
              <span className="font-medium text-gray-800">Customer Support</span>.
            </li>
          </ul>
        </div>

        {/* 로그 관련 */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-blue-600">📘 Dive Logs</h2>
          <ul className="text-gray-700 list-disc list-inside space-y-1">
            <li>You can save up to 50 dive logs.</li>
            <li>
              Location data can be manually typed or selected on the map.
            </li>
            <li>
              To edit a log, click the <span className="font-medium">Edit</span> button on the top right of the log detail page.
            </li>
          </ul>
        </div>

        {/* 친구 & 채팅 */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-purple-600">👥 Friends & Chat</h2>
          <ul className="text-gray-700 list-disc list-inside space-y-1">
            <li>You can search and add friends from your My Page.</li>
            <li>You can start chatting directly from a friend’s profile.</li>
            <li>
              Currently, only 1:1 chat is supported. Group chat is under development.
            </li>
          </ul>
        </div>

        {/* 고객센터 CTA */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-gray-700 mb-2">Didn’t find what you’re looking for?</p>
          <Link
            to="/contact"
            className="text-blue-600 font-semibold underline hover:text-blue-700"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default HelpPage;


