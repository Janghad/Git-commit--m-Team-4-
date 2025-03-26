"use client" // this lets us use hooks like useRouter in next.js pages

import { useRouter } from "next/navigation" // replaces useNavigate from react-router
import "../Auth.css" // brings in all the custom auth styling for layout/buttons/logo

const Home = () => {
  const router = useRouter() // lets us navigate between pages manually

  return (
    // this is the big background container that centers everything
    <div className="auth-container">
      {/* this is the white box in the center */}
      <div className="auth-card">

        {/* this is the round blue circle at the top with text inside */}
        <div className="logo-circle">
          <span className="logo-text">S!B</span> {/* this is the sparkbytes logo text */}
        </div>

        {/* main title of the page */}
        <h2>Spark!Bytes</h2>

        {/* small description text below the title */}
        <p className="description">
          access food from events across boston university campus
        </p>

        {/* button that takes user to login page */}
        <button className="auth-btn" onClick={() => router.push("/login")}>
          Login
        </button>

        {/* button that takes user to signup page */}
        <button className="auth-btn outlined" onClick={() => router.push("/signup")}>
          Sign Up
        </button>

      </div>
    </div>
  )
}

export default Home