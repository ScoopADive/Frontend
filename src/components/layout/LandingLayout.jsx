import PropTypes from 'prop-types';

function LandingLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}

LandingLayout.propTypes = {
  children: PropTypes.node,
};

export default LandingLayout;
