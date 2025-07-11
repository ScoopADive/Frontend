import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function DiveSiteSelector({ value, onChange, onCoordsChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchSites = async () => {
      if (!query) return setResults([]);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
        const data = await res.json();
        setResults(data.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch sites", err);
      }
    };

    const debounce = setTimeout(fetchSites, 500);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (site) => {
    setSelected(site);
    setResults([]);
    setQuery(site.display_name);
    onChange(site.display_name);
    onCoordsChange([parseFloat(site.lat), parseFloat(site.lon)]);
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={query || value}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search dive site"
        className="border p-2 w-full rounded"
      />

      {results.length > 0 ? (
        <ul className="border rounded bg-white max-h-40 overflow-y-auto">
          {results.map((site, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(site)}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
            >
              {site.display_name}
            </li>
          ))}
        </ul>
      ) : query && (
        <div className="text-xs text-gray-500">No results found.</div>
      )}

      {selected && (
        <MapContainer
          center={[parseFloat(selected.lat), parseFloat(selected.lon)]}
          zoom={4}
          style={{ height: "250px" }}
          className="rounded-lg z-0"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[parseFloat(selected.lat), parseFloat(selected.lon)]}>
            <Popup>{selected.display_name}</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}

export default DiveSiteSelector;
