import { NextApiRequest, NextApiResponse } from 'next';
import { app } from '../../../../firebase';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const db = getFirestore(app);


interface BookSpotRequestBody {
    parkingSpotId: string;
    driverId: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("from spot booking controller function");

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { parkingSpotId, driverId } = req.body as BookSpotRequestBody;
    console.log(parkingSpotId, driverId);

    if (!parkingSpotId || !driverId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Reference to the parking spot document
        const parkingSpotRef = doc(db, "parking-spots", parkingSpotId);
        const spotDoc = await getDoc(parkingSpotRef);

        if (!spotDoc.exists()) {
            console.log("No such parking spot");

            return res.status(404).json({ error: "Parking spot not found" });
        }

        const parkingSpotData = spotDoc.data();

        // Check if the parking spot is already booked
        if (parkingSpotData?.booked) {
            return res.status(400).json({ message: 'Parking spot is already booked' });
        }

        // Update the parking spot's booked status
        await updateDoc(parkingSpotRef, {
            booked: true,
            bookedBy: driverId,
            bookedAt: new Date().toISOString(),
        });

        return res.status(200).json({ message: 'Parking spot booked successfully' });
    } catch (error) {
        console.error('Error booking parking spot:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
