import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function DiveMapBox() {
  const diveSpots = [
    { lat: 33.4996, lng: 126.5312, site: 'Jeju Seogwipo' },
    { lat: -8.2746, lng: 115.6111, site: 'Tulamben, Bali' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2">📍 Dive Spots Map</h3>
      <MapContainer center={[20, 100]} zoom={2} className="h-64 rounded-lg z-0">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {diveSpots.map((spot, idx) => (
          <Marker key={idx} position={[spot.lat, spot.lng]}>
            <Popup>{spot.site}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default DiveMapBox;
