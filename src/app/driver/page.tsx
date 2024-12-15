"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Import L from leaflet
import axios from "axios";
import { auth } from "../../../firebase";
import { signOut } from "firebase/auth";

// Define the Spot type
type Spot = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  pricePerHour: number;
  user: string;
};
// const Map = dynamic(() => import("../components/Map"), { ssr: false });
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", // Path to your custom marker image
  iconSize: [32, 32], // Size of the icon [width, height]
  iconAnchor: [16, 32], // Anchor of the icon (centered at the bottom)
  popupAnchor: [0, -32], // Anchor of the popup relative to the icon
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
  {
    id: "2",
    name: "From PC",
    pricePerHour: 22,
    user: "1i5aszgMSGSujSNRqZ74lU9nF9f1",
    latitude: 37.7763,
    longitude: -122.4175,
  },
  {
    id: "3",
    name: "From PC",
    pricePerHour: 22,
    user: "1i5aszgMSGSujSNRqZ74lU9nF9f1",
    latitude: 37.7732,
    longitude: -122.424,
  },
  {
    id: "4",
    name: "From PC",
    pricePerHour: 22,
    user: "1i5aszgMSGSujSNRqZ74lU9nF9f1",
    latitude: 37.7781,
    longitude: -122.4191,
  },
  {
    id: "5",
    name: "From PC",
    pricePerHour: 22,
    user: "1i5aszgMSGSujSNRqZ74lU9nF9f1",
    latitude: 37.7694,
    longitude: -122.4862,
  },
];

const DriverPage = () => {
  const [parkingSpots, setParkingSpots] = useState<Spot[]>([]); // Use Spot[] type for the array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [center] = useState({
    lat: 37.7749, // Default latitude (e.g., San Francisco)
    lng: -122.4194, // Default longitude
  });

  const [mapLoaded] = useState<boolean>(false); // New state to track if the map has loaded

  // Fetch parking spots from the backend
  const fetchParkingSpots = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Spot[]>("/api/parking-spots"); // Specify the type of response
      console.log("parking spots response", response);

      // setParkingSpots(response.data);
      setParkingSpots(mockParkingSpots);
    } catch (err: any) {
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
        window.location.href = "/"; // Redirect only in the browser
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

        {/* Map with parking spots */}
        {!loading && !error && !mapLoaded && (
          <MapContainer
            center={center}
            zoom={12}
            style={{ width: "100%", height: "400px", borderRadius: "8px" }}
            // whenCreated={() => setMapLoaded(true)} // Set mapLoaded to true when the map is created
          >
            {/* OpenStreetMap Tile Layer */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {parkingSpots.map((spot: Spot) => (
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
        {!loading && parkingSpots.length === 0 && (
          <p className="text-lg text-gray-600">
            No parking spots found nearby.
          </p>
        )}
      </main>
    </div>
  );
};

export default DriverPage;
