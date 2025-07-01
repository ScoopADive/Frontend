import PropTypes from "prop-types"; 

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="w-full max-w-screen-xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;