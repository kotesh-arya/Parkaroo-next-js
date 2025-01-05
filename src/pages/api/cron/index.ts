// pages/api/cron-job.ts
import { db } from "../../../../firebase"; // Adjust the path to your firebase setup
import nodeCron from "node-cron";
import { collection, query, getDocs, updateDoc, where, doc } from "firebase/firestore";

// Type definition for ParkingSpot document
interface ParkingSpot {
  booked: boolean;
  endTime?: string; // Optional because not all spots might have an endTime
  bookedAt?: string; // Optional because it might not be set
  bookedBy?: string; // Optional because it might not be set
  bookingDetails?: string; // Optional because it might not be set
}

const COLLECTION_NAME = "parking-spots";

const updateParkingSpotsAvailability = async (userUID: string): Promise<void> => {
  try {
    const currentTime = new Date();

    // Query Firestore to filter parking spots by userUID
    const parkingSpotsQuery = query(
      collection(db, COLLECTION_NAME),
      where("user", "==", userUID) // Filter by userUID
    );

    const querySnapshot = await getDocs(parkingSpotsQuery);

    // Iterate through documents in the snapshot
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data() as ParkingSpot;

      // Check if the booking has expired
      if (data.booked && data.endTime && new Date(data.endTime) < currentTime) {
        // Update the document directly
        const parkingSpotRef = doc(db, COLLECTION_NAME, docSnapshot.id);
        await updateDoc(parkingSpotRef, {
          booked: false, // Mark as available
          bookedAt: null, // Remove bookedAt timestamp
          bookedBy: null, // Remove bookedBy user reference
          bookingDetails: null, // Remove any booking details
        });

        console.log(
          `Updated parking spot ${docSnapshot.id} to available and cleared booking details.`
        );
      }
    }
  } catch (error) {
    console.error("Error updating parking spots availability:", error);
  }
};

// Replace `userUID` with a valid user ID for the cron job
const userUID = "example-user-uid"; // Replace this with the actual UID you want to use

// Schedule the cron job to run every 5 minutes
nodeCron.schedule("*/5 * * * *", async () => {
  console.log("Running cron job: Updating parking spots availability");
  await updateParkingSpotsAvailability(userUID);
});

export default function handler(req: any, res: any): void {
  res.status(200).json({ message: "Cron job setup completed" });
}
