"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // Import dynamic from Next.js
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { auth } from "../../../firebase";
import { signOut } from "firebase/auth";

// Dynamically load the MapContainer and related components to disable SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

type Spot = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  pricePerHour: number;
  user: string;
};

const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const mockParkingSpots: Spot[] = [
  {
    id: "1",
    name: "From PC",
    pricePerHour: 22,
    user: "1i5aszgMSGSujSNRqZ74lU9nF9f1",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  // ... other mock spots
];

const DriverPage = () => {
  const [parkingSpots, setParkingSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const center = {
    lat: 37.7749,
    lng: -122.4194,
  };

  const fetchParkingSpots = async () => {
    setLoading(true);
    try {
      await axios.get<Spot[]>("/api/parking-spots");
      setParkingSpots(mockParkingSpots); // Use mock data for now
    } catch (err) {
      setError("Failed to load parking spots.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkingSpots();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert("Signed out successfully!");
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="driver-page min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Driver Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full text-white font-semibold transition duration-300"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Nearby Parking Spots
        </h2>

        {loading && (
          <p className="text-lg text-gray-600">Loading parking spots...</p>
        )}
        {error && <p className="text-lg text-red-600">{error}</p>}

        {!loading && !error && (
          <MapContainer
            center={center}
            zoom={12}
            style={{ width: "100%", height: "400px", borderRadius: "8px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {parkingSpots.map((spot) => (
              <Marker
                key={spot.id}
                position={{ lat: spot.latitude, lng: spot.longitude }}
                icon={customIcon}
              >
                <Popup>
                  <h2>{spot.name}</h2>
                  <p>₹{spot.pricePerHour}/Hour</p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </main>
    </div>
  );
};

export default DriverPage;
