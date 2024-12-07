"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { googleProvider, auth } from "../../../firebase"; // Import your firebase configuration

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/owner"); // Redirect to owner page
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Sign up successful! Please log in.");
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error("Authentication Error:", error.message);
      alert(error.message);
    }
  };

  // Google Sign-In function
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/owner"); // Redirect after successful login
    } catch (error: any) {
      console.error("Google Sign-In Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-md">
        <h1 className="text-xl font-bold mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded-md mb-4 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded-md mb-4 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleAuth}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
        <p
          className="mt-4 text-sm text-gray-500 cursor-pointer hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>
        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
          >
            Sign In with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
