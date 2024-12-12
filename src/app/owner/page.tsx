"use client";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";

interface Spot {
  id: string;
  name?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  pricePerHour?: number;
}

interface UserDetails {
  userName: string | null;
  userEmail?: string | null;
  userUID?: string | null;
}

interface FormInputs {
  name: string;
  latitude: string;
  longitude: string;
  pricePerHour: string;
}

// Loading Modal Component
const LoadingModal = ({ message }: { message: string }) => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
    <div className="bg-white p-4 rounded-lg w-64 text-center">
      <p className="text-lg font-medium text-black">{message}</p>
      <div className="mt-4">
        <div className="loader border-t-4 border-indigo-600 rounded-full w-10 h-10 mx-auto animate-spin"></div>
      </div>
    </div>
  </div>
);

const OwnerDashboard = () => {
  const router = useRouter();

  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserDetails>({
    userName: null,
    userEmail: null,
    userUID: null,
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [isDeleteModalVisible, setDeleteModalVisible] =
    useState<boolean>(false);
  const [deleteSpotId, setDeleteSpotId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

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
          userUID: currentUser.uid,
        });
      } else {
        setUser({ userName: null, userEmail: null });
      }
    });

    return () => unsubscribe();
  }, []);

  async function fetchSpots(ownerId: string) {
    setLoading(true);
    setLoadingMessage("Loading spots...");
    try {
      const res = await fetch(`/api/parking-spots?userUID=${ownerId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch spots");
      }
      const data = await res.json();
      setSpots(data);
    } catch (error) {
      console.error("Error fetching spots:", error);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  }

  useEffect(() => {
    if (user.userUID) {
      fetchSpots(user.userUID);
    }
  }, [user]);

  const handleAddSpot: SubmitHandler<FormInputs> = async (data) => {
    setShowModal(false);
    setLoading(true);
    setLoadingMessage("Adding spot...");

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
          name: data.name,
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          pricePerHour: parseFloat(data.pricePerHour),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add parking spot");
      }

      const newSpot = await res.json();
      setSpots((prev) => [...prev, newSpot]);
      if (user) {
        await fetchSpots(user.uid); // Call only if userUID exists
      }
      reset();
    } catch (error) {
      console.error("Error adding parking spot:", error);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser({
        userName: null,
        userEmail: null,
        userUID: null,
      });
      router.push("/auth"); // Redirect to owner page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleShowDeleteModal = (id: string) => {
    setDeleteSpotId(id);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteSpotId) return;

    setDeleteModalVisible(false);
    setLoading(true);
    setLoadingMessage("Deleting spot...");
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const token = await user.getIdToken();
      const res = await fetch(`/api/parking-spots/${deleteSpotId}`, {
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

      setSpots((prev) => prev.filter((spot) => spot.id !== deleteSpotId));
    } catch (error) {
      console.error("Error deleting parking spot:", error);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setDeleteSpotId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
      {loading && loadingMessage && <LoadingModal message={loadingMessage} />}

      <DeleteConfirmModal
        isVisible={isDeleteModalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* The rest of your UI remains unchanged */}

      <div className="relative max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>

        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">
          Your Parking Spots
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            User Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="material-icons text-gray-500">badge</span>
              <p className="text-gray-700">
                <span className="font-semibold">Name:</span>{" "}
                {user.userName || (
                  <span className="text-red-500 font-medium">
                    Not logged in
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="material-icons text-gray-500">email</span>
              <p className="text-gray-700">
                <span className="font-semibold">Email:</span>{" "}
                {user.userEmail || (
                  <span className="text-red-500 font-medium">
                    No email available
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              Edit Information
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mb-4 px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
        >
          Add New Parking Spot
        </button>

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
                onClick={() => handleShowDeleteModal(spot.id)}
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
      {/* Add New Parking Spot Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add Parking Spot
            </h2>
            <form onSubmit={handleSubmit(handleAddSpot)} className="space-y-4">
              <div>
                <input
                  type="text"
                  {...register("name", { required: "Spot name is required" })}
                  placeholder="Spot Name"
                  className="w-full p-2 border rounded text-black"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  {...register("latitude", {
                    required: "Latitude is required",
                    pattern: {
                      value: /^-?\d+(\.\d+)?$/,
                      message: "Enter a valid latitude",
                    },
                  })}
                  placeholder="Latitude"
                  className="w-full p-2 border rounded text-black"
                />
                {errors.latitude && (
                  <p className="text-red-500 text-sm">
                    {errors.latitude.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  {...register("longitude", {
                    required: "Longitude is required",
                    pattern: {
                      value: /^-?\d+(\.\d+)?$/,
                      message: "Enter a valid longitude",
                    },
                  })}
                  placeholder="Longitude"
                  className="w-full p-2 border rounded text-black"
                />
                {errors.longitude && (
                  <p className="text-red-500 text-sm">
                    {errors.longitude.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  {...register("pricePerHour", {
                    required: "Price per hour is required",
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: "Enter a valid price",
                    },
                  })}
                  placeholder="Price per Hour"
                  className="w-full p-2 border rounded text-black"
                />
                {errors.pricePerHour && (
                  <p className="text-red-500 text-sm">
                    {errors.pricePerHour.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
