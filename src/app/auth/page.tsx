"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { googleProvider, auth } from "../../../firebase"; // Import your firebase configuration
import { toast } from "react-toastify";
import Image from "next/image";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // State to track role selection
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleSignInLoading, setGoogleSignInLoading] = useState(false);

  const router = useRouter();

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!role) {
      toast.error("Please select a role: Owner or Driver");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);

        // Check the user's role if needed during sign-in
        router.push(role === "owner" ? "/owner" : "/driver"); // Redirect based on role
        toast.success("Signed in successfully!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Update the user profile with role
        await updateProfile(user, { displayName: role });
        toast.success("Sign up successful! Please log in.");
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(`Authentication Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleSignInLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);

      // Handle Google Sign-In role assignment (optional)
      toast.success("Signed in with Google successfully!");
      router.push("/owner");
    } catch (error: any) {
      toast.error(`Google Sign-In Error: ${error.message}`);
      console.error(error);
    } finally {
      setGoogleSignInLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col md:flex-row justify-center px-6 py-12 lg:px-8 text-text ">
      {/* ! logo image container div */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm md:max-w-[600px] flex flex-col justify-center  ">
        <Image
          className="mx-auto"
          src="/Parking.gif"
          alt="Parkaroo"
          width={500}
          height={500}
          priority
        />
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm shadow-lg p-4 border-2 border-solid rounded-xl ">
        <h2 className="mt-0 text-center text-2xl/9 font-bold tracking-tight ">
          {isLogin ? "Sign in to your account" : "Create your account"}
        </h2>
        <form className="space-y-6" onSubmit={handleAuth}>
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium ">
              Email address
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm/6 font-medium ">
              Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm/6 font-medium ">Role</label>
            <div className="flex items-center gap-4 mt-2">
              <div>
                <input
                  type="radio"
                  id="owner"
                  name="role"
                  value="owner"
                  className="mr-2"
                  checked={role === "owner"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <label htmlFor="owner" className="text-sm/6 text-text">
                  Owner
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="driver"
                  name="role"
                  value="driver"
                  className="mr-2"
                  checked={role === "driver"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <label htmlFor="driver" className="text-sm/6 text-text">
                  Driver
                </label>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md  px-3 py-1.5 text-sm/6 font-semibold bg-secondary text-white shadow-sm hover:bg-text  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={loading}
            >
              {loading
                ? isLogin
                  ? "Signing In..."
                  : "Signing Up..."
                : isLogin
                ? "Sign In"
                : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm/6 text-gray-500 cursor-pointer">
          {isLogin ? (
            <span onClick={() => setIsLogin(false)}>
              Don’t have an account?{" "}
              <span className="font-semibold text-text hover:text-indigo-500">
                Sign Up
              </span>
            </span>
          ) : (
            <span onClick={() => setIsLogin(true)}>
              Already have an account?{" "}
              <span className="font-semibold text-text hover:text-indigo-500">
                Sign In
              </span>
            </span>
          )}
        </p>

        <div className="mt-6">
          <button
            onClick={handleGoogleSignIn}
            className="flex w-full justify-center rounded-md bg-secondary  px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            disabled={googleSignInLoading}
          >
            {googleSignInLoading ? "Signing In..." : "Sign In with Google"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
