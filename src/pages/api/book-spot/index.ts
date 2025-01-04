import { NextApiRequest, NextApiResponse } from 'next';
import { app } from '../../../../firebase';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const db = getFirestore(app);

interface BookSpotRequestBody {
    parkingSpotId: string;
    driverId: string;
    startTime: string; // ISO 8601 format
    endTime: string;   // ISO 8601 format
}

const COLLECTION_NAME = "parking-spots";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("[INFO] Entered spot booking controller function");

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { parkingSpotId, driverId, startTime, endTime } = req.body as BookSpotRequestBody;

    // Validate input fields
    if (!parkingSpotId || !driverId || !startTime || !endTime) {
        console.error("[ERROR] Missing required fields: parkingSpotId, driverId, startTime, or endTime");
        return res.status(400).json({ message: 'Missing required fields: parkingSpotId, driverId, startTime, or endTime' });
    }

    // Parse and validate the startTime and endTime
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error("[ERROR] Invalid startTime or endTime format");
        return res.status(400).json({ message: 'Invalid startTime or endTime format. Use ISO 8601 format.' });
    }
    if (start >= end) {
        console.error("[ERROR] startTime must be before endTime");
        return res.status(400).json({ message: 'startTime must be before endTime' });
    }

    try {
        // Reference to the parking spot document
        const parkingSpotRef = doc(db, COLLECTION_NAME, parkingSpotId);
        const spotDoc = await getDoc(parkingSpotRef);

        if (!spotDoc.exists()) {
            console.error(`[ERROR] Parking spot not found: ${parkingSpotId}`);
            return res.status(404).json({ error: 'Parking spot not found' });
        }

        const parkingSpotData = spotDoc.data();

        // Check if the parking spot is already booked
        if (parkingSpotData?.booked) {
            console.warn(`[WARNING] Parking spot already booked: ${parkingSpotId}`);
            return res.status(400).json({ message: 'Parking spot is already booked' });
        }

        // Update the parking spot's booked status and booking details
        await updateDoc(parkingSpotRef, {
            booked: true,
            bookedBy: driverId,
            bookedAt: new Date().toISOString(),
            bookingDetails: {
                startTime: start.toISOString(),
                endTime: end.toISOString(),
            },
        });

        console.log(`[SUCCESS] Parking spot booked successfully: ${parkingSpotId} by Driver: ${driverId}`);
        return res.status(200).json({ message: 'Parking spot booked successfully' });
    } catch (error) {
        console.error(`[ERROR] Error booking parking spot: ${error}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
