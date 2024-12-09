import { NextApiRequest, NextApiResponse } from "next";
// import { db } from "@/firebase";
import { getFirestore, doc, deleteDoc, getDoc } from "firebase/firestore";
import { app, auth } from '../../../../firebase';
import admin from "../../../../@lib/firebaseAdmin"; // Initialize Firebase Admin here
const db = getFirestore(app);

// import admin from "@/firebase/admin"; // Ensure Firebase Admin is configured

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid or missing spot ID" });
    }

    try {
        if (req.method === "GET") {
            // Fetch a specific parking spot
            const docRef = doc(db, "parking-spots", id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return res.status(404).json({ error: "Parking spot not found" });
            }

            return res.status(200).json({ id: docSnap.id, ...docSnap.data() });
        }

        if (req.method === "DELETE") {
            // Authenticate the user via token
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const token = authHeader.split(" ")[1];
            const decodedToken = await admin.auth().verifyIdToken(token);


            // Reference the document in Firestore
            const docRef = doc(db, "parking-spots", id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return res.status(404).json({ error: "Parking spot not found" });
            }

            await deleteDoc(docRef);
            return res.status(200).json({ message: "Parking spot deleted successfully" });
        }

        res.setHeader("Allow", ["GET", "DELETE"]);
        return res.status(405).json({ error: "Method not allowed" });
    } catch (error) {
        console.error("Error handling request:", error);
        return res.status(500).json({ error: "Server error" });
    }
}
