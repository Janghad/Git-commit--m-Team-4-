"use client" // enables client-side logic and hooks like useState

import { useState } from "react" // allows us to save what the user types
import { useRouter } from "next/navigation" // replaces useNavigate in next.js
import "../../Auth.css" // custom styling for layout, inputs, buttons, etc

const Signup = () => {
  const router = useRouter() // used for redirecting the user after signup

  // storing form values in state
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("") // shows error if not @bu.edu
  const [userType, setUserType] = useState("student") // default radio button

  // this runs when they click submit
  const handleSubmit = (e) => {
    e.preventDefault() // stop page from refreshing

    // check if email ends with @bu.edu
    if (!email.endsWith("@bu.edu")) {
      setEmailError("email must end in @bu.edu")
      return
    }

    // if email is fine, clear any error
    setEmailError("")

    // redirect based on whether they’re a student or faculty
    if (userType === "student") router.push("/dietary-preferences")
    else router.push("/dashboard")
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <p className="auth-description">
          join spark!bytes to access free food across the bu campus
        </p>

        <form onSubmit={handleSubmit}>
          {/* first + last name side-by-side */}
          <div className="form-row">
            <div>
              <label htmlFor="firstName">First Name</label>
              <input id="firstName" required />
            </div>
            <div>
              <label htmlFor="lastName">Last Name</label>
              <input id="lastName" required />
            </div>
          </div>

          {/* email input */}
          <label htmlFor="email">BU Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@bu.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* show email error if needed */}
          {emailError && <p className="error-msg">{emailError}</p>}

          {/* password input */}
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required />

          {/* confirm password input */}
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" type="password" required />

          {/* role selection */}
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

          {/* create account button */}
          <button type="submit" className="auth-btn primary">Create Account</button>

          {/* link to login page if they already signed up */}
          <p className="signup-link">
            already have an account? <a href="/login">login</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup