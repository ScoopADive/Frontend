// components/sections/DiveMapBox.jsx
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function DiveMapBox({ spots = [], center = [20, 100], zoom = 2, height = "h-64" }) {
  return (
    // 섹션 바탕카드 안에서 제목 없이 맵만 표시
    <div className="p-0">
      <MapContainer center={center} zoom={zoom} className={`${height} rounded-lg z-0`}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {spots.map((spot, idx) => (
          <Marker key={`${spot.site}-${idx}`} position={[spot.lat, spot.lng]}>
            <Popup>{spot.site}</Popup>
          </Marker>
        ))}
      </MapContainer>
      {spots.length === 0 && (
        <div className="text-sm text-gray-500 mt-2">No spots to display.</div>
      )}
    </div>
  );
}

DiveMapBox.propTypes = {
  spots: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
      site: PropTypes.string.isRequired,
    })
  ),
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  height: PropTypes.string,
};

export default DiveMapBox;
