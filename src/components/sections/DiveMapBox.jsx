import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function DiveMapBox({ spots, center = [20, 100], zoom = 2, height = "h-64" }) {
  // 더미 위치
  const dummySpots = [
    { site: "Bali", lat: -8.4095, lng: 115.1889 },
    { site: "Jeju", lat: 33.4996, lng: 126.5312 },
    { site: "Sipadan", lat: 4.1140, lng: 118.6286 },
  ];

  const displaySpots = spots && spots.length > 0 ? spots : dummySpots;

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2">📍 Dive Spots Map</h3>
      <MapContainer center={center} zoom={zoom} className={`${height} rounded-lg z-0`}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {displaySpots.map((spot, idx) => (
          <Marker key={`${spot.site}-${idx}`} position={[spot.lat, spot.lng]}>
            <Popup>{spot.site}</Popup>
          </Marker>
        ))}
      </MapContainer>
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
