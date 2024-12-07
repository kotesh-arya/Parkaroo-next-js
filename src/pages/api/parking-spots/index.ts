import { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore, collection, query, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { app, auth } from '../../../../firebase';
import admin from "../../../../@lib/firebaseAdmin"; // Initialize Firebase Admin here
const db = getFirestore(app);

// Fetch all parking spots
const getParkingSpots = async () => {
  try {
    const q = query(collection(db, 'parking-spots'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching parking spots:', error);
    throw new Error('Failed to fetch parking spots');
  }
};

// Add a new parking spot
const addParkingSpot = async (spotData: { name: string, latitude: string, longitude: string, pricePerHour: number }, userId: string) => {
  try {
    const docRef = await addDoc(collection(db, 'parking-spots'), {
      name: spotData.name,
      latitude: spotData.latitude,
      longitude: spotData.longitude,
      pricePerHour: spotData.pricePerHour,
      user: userId, // Save the logged-in user's ID
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding parking spot:', error);
    throw new Error('Failed to add parking spot');
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("from main request");

  if (req.method === "GET") {
    console.log("inside get method");
    try {
      const spots = await getParkingSpots();
      res.status(200).json(spots);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch parking spots" });
    }
  }
  else if (req.method === "POST") {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];

      // Verify the token using Firebase Admin
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userId = decodedToken.uid;

      const { name, latitude, longitude, pricePerHour } = req.body;

      if (!name || !latitude || !longitude || !pricePerHour) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newSpotId = await addParkingSpot(
        { name, latitude, longitude, pricePerHour },
        userId
      );

      res.status(201).json({ id: newSpotId, message: "Parking spot added successfully" });
    } catch (error) {
      console.error("Error handling POST request:", error);
      res.status(500).json({ error: "Failed to add parking spot" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}