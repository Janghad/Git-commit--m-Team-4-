"use client" // enables client-side logic and hooks like useState
import supabase from "../../lib/supabaseClient";

import { useState } from "react" // allows us to save what the user types
import { useRouter } from "next/navigation" // replaces useNavigate in next.js
import "../../Auth.css" // custom styling for layout, inputs, buttons, etc

/**
 * Signup Page Component
 * 
 * A modern, responsive signup page that allows new users to create an account in the SparkBytes application.
 * Features comprehensive form validation, including BU email verification.
 * 
 * Features:
 * - Full name collection (first and last name)
 * - BU email validation (@bu.edu)
 * - Password with confirmation
 * - User type selection (student/faculty)
 * 
 * Styling:
 * - Dark theme with zinc color palette
 * - Green accent colors for brand consistency
 * - Modern form inputs with proper spacing and hover/focus states
 * - Responsive design that works on all screen sizes
 * 
 * @component
 * @example
 * return (
 *   <Signup />
 * )
 */
const Signup = () => {
  console.log(supabase) //In order to test endpoint
  const router = useRouter() // used for redirecting the user after signup

  // storing form values in state
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("") // shows error if not @bu.edu
  const [userType, setUserType] = useState("student") // default radio button


  //Google Login Handler
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback", 
      },
    });
  
    if (error) {
      console.error("Google Auth Error:", error.message);
      alert("Google login failed");
    }
  };
  /**
   * Handles form submission for signup
   * Validates the email domain and redirects based on user type
   * 
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault() // stop page from refreshing

    // check if email ends with @bu.edu
    if (!email.endsWith("@bu.edu")) {
      setEmailError("Email must end in @bu.edu")
      return;
    }

    // if email is fine, clear any error
    setEmailError("")

    //Get values from form
    const password = document.getElementById("password")
    const confirmPassword = document.getElementById("confirmPassword".value);
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.")
      return;
    }

    //Signing up with Google Authentication
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    
    if (error) {
      console.error("Signup error. Please try again.", error.message);
      alert("Signup failed: " + error.message);
      return;
    }

    //Inserts unknown user data into profile table
    const {profile} = data;
    await supabase.from("profiles").insert ([
      {
        email: profile.email,
        user_type: userType,
        first_name: firstName,
        last_Name: lastName,
        auth_id: userType.id,
      },
    ])

    // redirect based on whether they're a student or faculty
    if (userType === "student") router.push("/dietary-preferences")
    else router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-zinc-800 p-8 rounded-2xl shadow-xl">
        {/* Logo */}
        <div className="mx-auto h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center">
          <span className="text-green-500 text-2xl font-bold">S!B</span>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Join SparkBytes to access free food across the BU campus
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-zinc-300">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                required
                className="mt-1 block w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-zinc-300">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                required
                className="mt-1 block w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
              BU Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@bu.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {emailError && (
              <p className="mt-2 text-sm text-red-400">{emailError}</p>
            )}
          </div>

          {/* Password Fields */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              className="mt-1 block w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
              I am a:
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  value="student"
                  checked={userType === "student"}
                  onChange={() => setUserType("student")}
                  className="h-4 w-4 text-green-500 border-zinc-600 bg-zinc-700 focus:ring-green-500 focus:ring-offset-zinc-800"
                />
                <span className="text-zinc-300">Student</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  value="faculty"
                  checked={userType === "faculty"}
                  onChange={() => setUserType("faculty")}
                  className="h-4 w-4 text-green-500 border-zinc-600 bg-zinc-700 focus:ring-green-500 focus:ring-offset-zinc-800"
                />
                <span className="text-zinc-300">Faculty / Event Organizer</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-zinc-800 transition-colors duration-200"
          >
            Create Account
          </button>

          {/*Temp button for google authenticate*/}
          <button
            type="button"
            onClick= {handleGoogleLogin}
            className="w-full mt-4 flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-zinc-800 transition-colors duration-200"
          >
            Continue with Google
          </button>

          <p className="text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-green-500 hover:text-green-400">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup