// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";

/*
  푸터 구성
  - Top: 브랜드 소개 + 뉴스레터
  - Middle: 네비게이션 4컬럼 (Product, Community, Resources, Legal)
  - Bottom: GitHub 스타일의 미니바 (저작권, 링크)
*/

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="inline-block">
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                ScoopADive
              </span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-gray-600 max-w-sm">
              A simple logbook for divers. Record your dives, share with buddies,
              and discover beginner-friendly spots worldwide.
            </p>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base font-semibold text-gray-900">Stay in the loop</h3>
              <p className="mt-1 text-sm text-gray-600">
                Tips, seasonal spot picks, and product updates. No spam.
              </p>
              <form
                className="mt-4 flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Subscribed (demo).");
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full sm:flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Middle */}
        <div className="py-8 grid grid-cols-2 sm:grid-cols-4 gap-8 border-t border-gray-200">
          <NavCol
            title="Product"
            links={[
              { label: "Home", to: "/" },
              { label: "Create log", to: "/log/create" },
              { label: "Explore logs", to: "/home#feed" },
              { label: "Spots", to: "/spots" },
            ]}
          />
          <NavCol
            title="Community"
            links={[
              { label: "Top members", to: "/home#top" },
              { label: "Most visited spots", to: "/home#spots" },
              { label: "Bulletin", to: "/bulletin" },
              { label: "Friends", to: "/friends" },
            ]}
          />
          <NavCol
            title="Resources"
            links={[
              { label: "FAQ", to: "/help" },
              { label: "Beginner guide", to: "/guide/beginner" },
              { label: "Safety basics", to: "/guide/safety" },
              { label: "Contact", to: "/contact" },
            ]}
          />
          <NavCol
            title="Legal"
            links={[
              { label: "Privacy Policy", to: "/legal/privacy" },
              { label: "Terms of Service", to: "/legal/terms" },
              { label: "Cookies", to: "/legal/cookies" },
              { label: "Licenses", to: "/legal/licenses" },
            ]}
          />
        </div>

        {/* Bottom mini bar */}
        <div className="py-6 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} ScoopADive. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-sm">
            <Link className="text-gray-700 hover:text-gray-900" to="/legal/privacy">
              Privacy
            </Link>
            <span className="text-gray-300">•</span>
            <Link className="text-gray-700 hover:text-gray-900" to="/legal/terms">
              Terms
            </Link>
            <span className="text-gray-300">•</span>
            <Link className="text-gray-700 hover:text-gray-900" to="/contact">
              Contact
            </Link>
            <span className="text-gray-300">•</span>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Community
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function NavCol({ title, links = [] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-gray-600 hover:text-gray-900">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
