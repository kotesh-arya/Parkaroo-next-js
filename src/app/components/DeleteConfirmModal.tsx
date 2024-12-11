export const DeleteConfirmModal = ({
  isVisible,
  onConfirm,
  onCancel,
}: {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Confirm Deletion
        </h2>
        <p className="mt-2 text-gray-600">
          Are you sure you want to delete this parking spot? This action cannot
          be undone.
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
