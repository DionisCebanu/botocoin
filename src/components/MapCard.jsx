
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
        <MapContainer center={position} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    <b>Le Botocoin</b><br />{address}
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapCard;
