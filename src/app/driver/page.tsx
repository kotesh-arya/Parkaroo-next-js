"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import { auth } from "../../../firebase";
import { signOut } from "firebase/auth";
import L from "leaflet"; // For creating custom marker icons
import { LatLngExpression } from "leaflet"; // For creating custom marker icons

// Define the Spot type
type Spot = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

const DriverPage = () => {
  const [parkingSpots, setParkingSpots] = useState<Spot[]>([]); // Use Spot[] type for the array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [center, setCenter] = useState({
    lat: 37.7749, // Default latitude (e.g., San Francisco)
    lng: -122.4194, // Default longitude
  });

  const [mapLoaded, setMapLoaded] = useState<boolean>(false); // New state to track if the map has loaded

  // Fetch parking spots from the backend
  const fetchParkingSpots = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Spot[]>("/api/parking-spots"); // Specify the type of response
      setParkingSpots(response.data);
    } catch (err) {
      setError("Failed to load parking spots.");
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
      window.location.href = "/"; // Redirect to login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Create a custom marker icon for Leaflet
  const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", // Leaflet's default marker
    iconSize: [25, 41], // Marker size
    iconAnchor: [12, 41], // Marker anchor point
    popupAnchor: [1, -34], // Popup anchor point
  });

  useEffect(() => {
    const position: LatLngExpression = [51.5, -0.09];

    const map = L.map("map").setView(position, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker(position).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

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
                <Popup>{spot.name}</Popup>
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
