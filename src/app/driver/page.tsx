"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import axios from "axios";
import { auth } from "../../../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "leaflet/dist/leaflet.css";
import { SpotDetailsModal } from "../components/SpotDetailsModal";

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
  booked: boolean;
};

interface UserDetails {
  userName: string | null;
  userEmail?: string | null;
  userUID?: string | null;
}

const DriverPage = () => {
  const [parkingSpots, setParkingSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [customIcon, setCustomIcon] = useState<L.Icon | null>(null);

  const [showSpotModal, setShowSpotModal] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  const [user, setUser] = useState<UserDetails>({
    userName: null,
    userEmail: null,
    userUID: null,
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const router = useRouter();
  const center = { lat: 17.6868, lng: 83.2185 };

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        const icon = L.icon({
          iconUrl:
            "https://png.pngtree.com/png-vector/20230106/ourmid/pngtree-flat-red-location-sign-png-image_6553065.png",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });
        setCustomIcon(icon);
      });
    }

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        let userName = currentUser.displayName;
        if (!userName && currentUser.email) {
          userName = currentUser.email.split("@")[0];
        }
        setUser({
          userName,
          userEmail: currentUser.email,
          userUID: currentUser.uid,
        });
      } else {
        setUser({ userName: null, userEmail: null });
      }
    });

    return () => unsubscribe();
  }, []);

  // useEffect(() => {}, [minPrice, maxPrice]);

  const fetchParkingSpots = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/parking-spots", {
        params: { minPrice, maxPrice },
      });
      setParkingSpots(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch parking spots. Please try again.");
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully!");
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleShow = (spot: Spot) => {
    setSelectedSpot(spot);
    setShowSpotModal(true);
  };

  const handleClose = () => {
    setShowSpotModal(false);
    setSelectedSpot(null);
  };

  console.log(user.userUID, "driver Id");

  const bookParkingSpot = async (spotId: string) => {
    setBookingLoading(true);
    try {
      await axios.post(`/api/book-spot`, {
        parkingSpotId: spotId,
        driverId: user.userUID,
      });
      toast.success("Parking spot booked successfully!");
      fetchParkingSpots();
    } catch (err) {
      setBookingLoading(false);
      toast.error("Failed to book the parking spot. Please try again.");
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };
  // console.log("no of parking spots", parkingSpots.length);
  useEffect(() => {
    let timerId = setTimeout(() => {
      fetchParkingSpots();
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [minPrice, maxPrice]);
  return (
    <div className="driver-page min-h-screen bg-gray-50">
      <header className="bg-primary text-white p-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Driver Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md text-white font-semibold transition duration-300"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Nearby Parking Spots
        </h2>

        <div className="mb-4 flex gap-4">
          <input
            type="number"
            placeholder="Min Price"
            className="p-2 border rounded"
            value={minPrice || ""}
            onChange={(e) =>
              setMinPrice(e.target.value ? parseInt(e.target.value) : null)
            }
          />
          <input
            type="number"
            placeholder="Max Price"
            className="p-2 border rounded"
            value={maxPrice || ""}
            onChange={(e) =>
              setMaxPrice(e.target.value ? parseInt(e.target.value) : null)
            }
          />
          {/* <button
            onClick={fetchParkingSpots}
            className="px-4 py-2 bg-blue-500 text-white rounded shadow"
          >
            Filter
          </button> */}
        </div>

        {loading && <p>Loading parking spots...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && customIcon && (
          <MapContainer
            center={center}
            zoom={12}
            style={{
              width: "100%",
              height: "400px",
              borderRadius: "8px",
              zIndex: 0,
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {parkingSpots.map((spot) => (
              <Marker
                key={spot.id}
                position={{ lat: spot.latitude, lng: spot.longitude }}
                icon={customIcon}
              >
                <Popup>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {spot.name}
                  </h2>
                  <p className="text-lg text-gray-600">
                    <span className="font-semibold text-gray-800">
                      Price per Hour:
                    </span>{" "}
                    ₹{spot.pricePerHour}
                  </p>
                  <p className="text-lg">
                    <span
                      className={`font-semibold ${
                        spot.booked ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {spot.booked ? "Booked" : "Available"}
                    </span>
                  </p>
                  <div className="flex justify-center">
                    {!spot.booked && (
                      <button
                        onClick={() => bookParkingSpot(spot.id)}
                        className="px-8 py-3 bg-secondary text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
                      >
                        {bookingLoading ? (
                          <div className="loader border-t-2 border-white-600 rounded-full w-5 h-5 mx-auto animate-spin"></div>
                        ) : (
                          "Book spot"
                        )}
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
        {selectedSpot && (
          <SpotDetailsModal
            show={showSpotModal}
            onClose={handleClose}
            spot={selectedSpot}
            driver={user}
          />
        )}
      </main>
    </div>
  );
};

export default DriverPage;
