import React, { useState } from "react";
import axios from "axios";

type Spot = {
  id: string;
  name: string;
  pricePerHour: number;
  latitude: number;
  longitude: number;
  booked: boolean;
};
interface UserDetails {
  userName: string | null;
  userEmail?: string | null;
  userUID?: string | null;
}

type CustomModalProps = {
  show: boolean; // Whether the modal is visible
  onClose: () => void; // Function to close the modal
  spot: Spot; // The selected parking spot, which can be null if no spot is selected
  driver: UserDetails;
  onBook: () => void;
  bookingLoading: boolean;
  startDateTime: string;
  setStartDateTime: string;
  endDateTime: string;
  setEndDateTime: string;
};

export const SpotDetailsModal: React.FC<CustomModalProps> = ({
  show,
  onClose,
  spot,
  driver,
  onBook,
  bookingLoading,
  startDateTime,
  setStartDateTime,
  endDateTime,
  setEndDateTime,
}) => {
  const [loading, setLoading] = useState(false); // For showing a loading state
  const [error, setError] = useState<string | null>(null); // For displaying errors
  const [success, setSuccess] = useState(false); // To show booking success

  if (!show) return null;

  // Function to handle booking
  // const handleBooking = async () => {
  //   if (!spot || !spot.id) return;

  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const driverId = driver.userUID; // Replace with the actual driver ID (e.g., from auth context)

  //     const response = await axios.post("/api/book-spot", {
  //       parkingSpotId: spot.id,
  //       driverId,
  //     });

  //     if (response.status === 200) {
  //       setSuccess(true);
  //     } else {
  //       setError("Failed to book the parking spot. Please try again.");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setError("An error occurred while booking. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100 right-100 bottom-0">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-4">{spot.name}</h2>
        <p className="mb-2">
          Price per Hour:{" "}
          <span className="text-text font-extrabold">₹{spot.pricePerHour}</span>
        </p>

        {/* Success and Error messages */}
        {success && (
          <p className="text-green-500 font-semibold mb-2">
            Booking successful! 🎉
          </p>
        )}
        {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

        {spot.booked ? (
          <div>
            <h2>
              {" "}
              Spot Already Booked, Please try booking another nearest Spot.
            </h2>
            {/* Close button */}
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <h4 className="text-lg font-semibold mb-4">Spot Images:</h4>
            {/* Book Now button */}
            <button
              className={`bg-secondary text-white px-4 py-2 rounded mr-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={onBook}
              disabled={loading}
            >
              {loading ? "Booking..." : "Book Now"}
            </button>

            {/* Close button */}
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
