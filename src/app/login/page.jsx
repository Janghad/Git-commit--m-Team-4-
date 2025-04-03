"use client" // tells next.js this page uses client-side interactivity (hooks, etc)

// ok so this file is for the login page and it’s gonna let users sign in
// we’re using react hooks and next.js router stuff here

import { useState } from "react" // allows us to store input values
import { useRouter } from "next/navigation" // this replaces useNavigate in next.js
import "../../Auth.css" // brings in all the styles from your auth.css file

/**
 * Login Page Component
 * 
 * A modern, responsive login page that allows users to authenticate into the SparkBytes application.
 * Features email/password authentication and user type selection (student/faculty).
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
 *   <Login />
 * )
 */

// okay here we go, we’re setting up the stuff we need to store user input
// like email, password, and whether they’re a student or faculty
const Login = () => {
  const router = useRouter() // this lets us manually redirect the user

  // these hold the email, password, and user type that the person types in
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("student") // default selection

  /**
   * Handles form submission for login
   * Validates the form and redirects based on user type
   * 
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = (e) => {
    // when the form gets submitted we stop it from refreshing the page
    // then we just check if the user is a student or not and send them to the right place

    e.preventDefault() // stop the page from refreshing

    // check what kind of user they are and redirect them
    if (userType === "student") router.push("/dietary-preferences")
    else router.push("/dashboard")
  }

  return (
    // this is the outer container that centers everything and makes it look nice on all screen sizes
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-zinc-800 p-8 rounded-2xl shadow-xl">
        {/* Logo */}
        {/* just a little green circle with the sparkbytes logo in the middle to make it look cool */}
        <div className="mx-auto h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center">
          <span className="text-green-500 text-2xl font-bold">S!B</span>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Login to Spark!Bytes</h2>
          <p className="mt-2 text-sm text-zinc-400">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email Input */}
            {/* here’s the email field. it shows the label, the input box, and tracks what the user types */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@bu.edu"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Password Input */}
            {/* same deal for password — we’re keeping track of it in state too */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Role Selection */}
            {/* okay this is where they pick if they’re a student or faculty */}
            {/* we default it to student at the top but they can change it here */}
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
          </div>
          {/* this button sends the form — it triggers handleSubmit up above */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-zinc-800 transition-colors duration-200"
          >
            Sign In
          </button>

          {/* little message at the bottom in case someone doesn’t have an account yet */}
          <p className="text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <a href="/signup" className="font-medium text-green-500 hover:text-green-400">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login