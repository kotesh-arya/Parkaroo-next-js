import admin from "firebase-admin";

if (!admin.apps.length) {

    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is missing");
    }

    try {
        // Parse the JSON string from the environment variable
        const serviceAccountKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

        // Initialize the Firebase Admin SDK
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccountKey),
        });

    } catch (error: any) {
        console.error("Failed to initialize Firebase Admin:", error.message);
        throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_KEY");
    }
}

export default admin;
