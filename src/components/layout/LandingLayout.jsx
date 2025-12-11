// LandingLayout.jsx
import PropTypes from "prop-types";

function LandingLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter antialiased">
      {children}
    </div>
  );
}

LandingLayout.propTypes = {
  children: PropTypes.node,
};

export default LandingLayout;
