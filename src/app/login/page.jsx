"use client" // tells next.js this page uses client-side interactivity (hooks, etc)

// ok so this file is for the login page and it's gonna let users sign in
// we're using react hooks and next.js router stuff here

import { useState, useEffect } from "react" // allows us to store input values
import { useRouter } from "next/navigation" // this replaces useNavigate in next.js
import supabase from "../../lib/supabaseClient" // this links the supabase database to work for our login page
import "../../Auth.css" // brings in all the styles from your auth.css file
import { toast } from 'react-hot-toast'

/**
 * Login Page Component
 * 
 * A modern, responsive login page that allows users to authenticate into the SparkBytes application.
 * Features email/password authentication with BU email validation.
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

// okay here we go, we're setting up the stuff we need to store user input
// like email, password, and whether they're a student or faculty
const Login = () => {
  const router = useRouter() // this lets us manually redirect the user

  // these hold the email and password that the person types in
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');
    const errorParam = params.get('error');
    
    if (message === 'email-confirmed') {
      toast.success('Email confirmed successfully! You can now log in.');
    }
    
    if (errorParam === 'auth-error') {
      toast.error('Authentication error. Please try again.');
    }
    
    if (errorParam === 'unknown') {
      toast.error('An unexpected error occurred. Please try again.');
    }
  }, []);
  
  //If the user is already logged in, redirect to the dashboard
  useEffect(() => {
    const checkSession = async () => {
      const {data: {session}} = await supabase.auth.getSession()    //built in session tracker from supabase
      if (session) {
        router.push("/dashboard")
      }
    }

    checkSession()
  }, [router])

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setFormSubmitted(true)  //Tracks the form as submitted

    if (!email || !password) {
      setError("Please fill in both email and password") 
      return
    }

    //Used built in endsWith feature to check if the last characters entered ends in @bu.edu
    if (!email.endsWith("@bu.edu")) {    
      setError("Please use your BU email address (@bu.edu)")
      return
    }

    setLoading(true)
    setError("")
    try {
      //Supabase authentication
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      console.log("Authentication response:", data, signInError);

      if (signInError) {
        throw new Error(signInError.message)
      }

      if (data?.user && !data.user.email_confirmed_at) {
        setError("Please confirm your email before logging in. Check your inbox for a confirmation link.");
        setLoading(false);
        return;
      }

      //Checks if the user exists in the custom profiles table
      if(data?.user) {
        const {data:profile, error:profileError} = await supabase
          .from("profiles")
          .select("*")
          .eq("auth_id", data.user.id)
          .single()

        //PGRST116 is an error code from PostgREST used by Supabase that essentially means no results found
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching profile:", profileError)
        }

        //for the case in which the user has an account but does not have other necessary data stores 
        //this occurs when user signs up with google authenticate 
        if (!profile) {
          router.push("/dashboard")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (error) {
      console.error("Login failed:", error)
      setError(error.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    // Set loading state to disable buttons and show loading indicators
    setLoading(true)
    setError("")

    try {
      // Triggers Google OAuth flow with Supabase
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Dynamic redirect based on the current environment
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      // Handle potential OAuth setup errors
      if (error) {
        throw new Error(error.message)
      }
      
      // The auth callback handler will manage the session and redirect afterwards
    } catch (error) {
      console.error("Google login failed:", error)
      setError(error.message || "Google login failed. Please try again.")
    } finally {
      setLoading(false)
    }
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

        {/*Error Display Message*/}
        {/*Error appears when authentication fails*/}
        {error && (
          <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email Input */}
            {/* here's the email field. it shows the label, the input box, and tracks what the user types */}
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
                className={`mt-1 block w-full px-3 py-2 bg-zinc-700 border ${
                  formSubmitted && (!email || !email.endsWith("@bu.edu")) 
                    ? "border-red-500" 
                    : "border-zinc-600"
                } rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              />
              {formSubmitted && !email && (
                <p className="mt-1 text-sm text-red-500">Email is required</p>
              )}
              {formSubmitted && email && !email.endsWith("@bu.edu") && (
                <p className="mt-1 text-sm text-red-500">Please use your BU email address</p>
              )}
            </div>

            {/* Password Input with Validation */}
            {/* same deal for password — we're keeping track of it in state too */}
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
                className={`mt-1 block w-full px-3 py-2 bg-zinc-700 border ${
                  formSubmitted && !password ? "border-red-500" : "border-zinc-600"
                } rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              />
              {formSubmitted && !password && (
                <p className="mt-1 text-sm text-red-500">Password is required</p>
              )}
            </div>
          </div>

          {/* this button sends the form — it triggers handleSubmit up above */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-zinc-800 transition-colors duration-200"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Google Authentication Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mt-4 flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-zinc-800 transition-colors duration-200"
          >
            {loading ? 'Connecting...' : 'Continue with Google'}
          </button>

          {/* little message at the bottom in case someone doesn't have an account yet */}
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