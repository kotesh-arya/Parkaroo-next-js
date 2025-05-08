import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

if (!admin.apps.length) {
    try {
        let serviceAccount: any;

        if (process.env.NODE_ENV === 'development') {
            // Reads serviceAccountKey.json from the project root
            const filePath = path.join(process.cwd(), 'serviceAccountKey.json');
            const fileData = fs.readFileSync(filePath, 'utf8');
            serviceAccount = JSON.parse(fileData);
        } else {
            // Reads the key from Render env variable and replaces escaped newlines
            if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
                throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY env variable is not set');
            }
            serviceAccount = JSON.parse(
                process.env.FIREBASE_SERVICE_ACCOUNT_KEY
            );
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        console.log('✅ Firebase Admin initialized');
    } catch (error) {
        console.error('❌ Failed to initialize Firebase Admin:', error);
    }
}

export default admin;
