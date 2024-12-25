type Spot = {
  id: string;
  name: string;
  pricePerHour: number;
  //   location: string;
  latitude: number;
  longitude: number;
};
type CustomModalProps = {
  show: boolean; // Whether the modal is visible
  onClose: () => void; // Function to close the modal
  spot: Spot; // The selected parking spot, which can be null if no spot is selected
};
export const SpotDetailsModal: React.FC<CustomModalProps> = ({
  show,
  onClose,
  spot,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100 right-100 bottom-0">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-4">{spot.name}</h2>
        <p className="mb-2">
          Price per Hour:{" "}
          <span className="text-text font-extrabold">₹{spot.pricePerHour}</span>
        </p>
        {/* <p className="mb-4">Location: {spot.location}</p> */}
        <h4 className="text-lg font-semibold mb-4">Spot Images:</h4>
        <button
          className="bg-background text-white px-4 py-2 rounded  mr-2"
          onClick={() => alert("Booking functionality here!")}
        >
          Book Now
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
