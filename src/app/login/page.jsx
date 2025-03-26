"use client" // tells next.js this page uses client-side interactivity (hooks, etc)

import { useState } from "react" // allows us to store input values
import { useRouter } from "next/navigation" // this replaces useNavigate in next.js
import "../../Auth.css" // brings in all the styles from your auth.css file

const Login = () => {
  const router = useRouter() // this lets us manually redirect the user

  // these hold the email, password, and user type that the person types in
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("student") // default selection

  // when the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault() // stop the page from refreshing

    // check what kind of user they are and redirect them
    if (userType === "student") router.push("/dietary-preferences")
    else router.push("/dashboard")
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Spark!Bytes</h2>
        <p className="auth-description">enter your credentials to access your account</p>

        <form onSubmit={handleSubmit}>
          {/* email input */}
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="you@bu.edu"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)} // save what they type
          />

          {/* password input */}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* role selection (radio buttons) */}
          <label>I am a:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="student"
                checked={userType === "student"}
                onChange={() => setUserType("student")}
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                value="faculty"
                checked={userType === "faculty"}
                onChange={() => setUserType("faculty")}
              />
              Faculty / Event Organizer
            </label>
          </div>

          {/* submit button */}
          <button type="submit" className="auth-btn primary">Login</button>

          {/* link to signup page if they don’t have an account */}
          <p className="signup-link">
            don’t have an account? <a href="/signup">sign up</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login