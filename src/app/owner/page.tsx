"use client";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase";

interface Spot {
  id: string;
  name?: string; // Spot name
  location?: string; // Spot location
  latitude?: number;
  longitude?: number;
  pricePerHour?: number;
}

interface UserDetails {
  userName: string | null;
  userEmail?: string | null;
}

const OwnerDashboard = () => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserDetails>({
    userName: null,
    userEmail: null,
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    pricePerHour: "",
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        let userName = currentUser.displayName;
        if (!userName && currentUser.email) {
          userName = currentUser.email.split("@")[0];
        }
        setUser({
          userName,
          userEmail: currentUser.email,
        });
      } else {
        setUser({ userName: null, userEmail: null });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchSpots() {
      setLoading(true);

      try {
        const res = await fetch("/api/parking-spots");
        if (!res.ok) {
          throw new Error("Failed to fetch spots");
        }
        const data = await res.json();
        setSpots(data);
      } catch (error) {
        console.error("Error fetching spots:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSpots();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSpot = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const token = await user.getIdToken();

      const res = await fetch("/api/parking-spots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          pricePerHour: parseFloat(formData.pricePerHour),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add parking spot");
      }

      const newSpot = await res.json();

      setSpots((prev) => [...prev, newSpot]);
      setShowModal(false);
      setFormData({
        name: "",
        latitude: "",
        longitude: "",
        pricePerHour: "",
      });
    } catch (error) {
      console.error("Error adding parking spot:", error);
    }
  };

  const handleDeleteSpot = async (id: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const token = await user.getIdToken();

      const res = await fetch(`/api/parking-spots/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete parking spot");
      }

      // Remove the deleted spot from the list
      setSpots((prev) => prev.filter((spot) => spot.id !== id));
    } catch (error) {
      console.error("Error deleting parking spot:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">
          Your Parking Spots
        </h1>

        {/* User Info */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            User Information
          </h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Name:</span>{" "}
              {user.userName || "Not logged in"}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span>{" "}
              {user.userEmail || "No email available"}
            </p>
          </div>
        </div>

        {/* Add Spot Button */}
        <button
          onClick={() => setShowModal(true)}
          className="mb-4 px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
        >
          Add New Parking Spot
        </button>

        {/* Parking Spots Display */}
        {loading ? (
          <div className="flex justify-center items-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : spots.length ? (
          spots.map((spot) => (
            <div
              key={spot.id}
              className="spot bg-white p-4 mb-4 shadow-md rounded-lg text-black"
            >
              <h3 className="text-xl font-semibold">{spot.name}</h3>
              <p>
                Location: {spot.latitude}, {spot.longitude}
              </p>
              <p>Price: ${spot.pricePerHour}/hour</p>
              <button
                onClick={() => handleDeleteSpot(spot.id)}
                className="delete-button px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No parking spots found.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add Parking Spot
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Spot Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-black"
              />
              <input
                type="text"
                name="latitude"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-black"
              />
              <input
                type="text"
                name="longitude"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-black"
              />
              <input
                type="text"
                name="pricePerHour"
                placeholder="Price per Hour"
                value={formData.pricePerHour}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-black"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSpot}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Add Spot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
