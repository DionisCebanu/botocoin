
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


const MapCard = () => {
    const [isClient, setIsClient] = useState(false);
    const position = [45.5686, -73.5414]; // Lat, Lng for 3881 Rue Rachel Est
    const address = "3881 Rue Rachel Est, Montréal, QC H1X 1Z2";

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Static fallback for SSR or if Leaflet fails to load
    if (!isClient) {
        return (
            <div className="w-full h-full bg-warm-gray/20 flex flex-col items-center justify-center p-4">
                <p className="font-semibold mb-4 text-center">Loading map...</p>
                <a 
                    href={`https://www.openstreetmap.org/?mlat=${position[0]}&mlon=${position[1]}#map=16/${position[0]}/${position[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                >
                    Get Directions
                </a>
            </div>
        );
    }

    return (
      <div class="bg-card h-72 rounded-lg shadow-xl overflow-hidden">
            <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-73.5601%2C45.5517%2C-73.5441%2C45.5597&layer=mapnik&marker=45.5557%2C-73.5521"
                class="w-full h-full border-0"
                title="Emplacement — 3881 Rue Rachel Est, Montréal"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        </div>

    );
};

export default MapCard;
