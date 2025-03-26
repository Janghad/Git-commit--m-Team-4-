"use client" // tells next.js this file uses client-side logic (like useState)

import { useState } from "react" // lets us track and update form data
import { useRouter } from "next/navigation" // helps us redirect the user
import "../../Auth.css" // custom css file that controls layout and styling

// list of dietary preference options that will show as checkboxes
const dietaryOptions = [
  "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free",
  "Nut-Free", "Halal", "Kosher", "Shellfish Allergy",
  "Soy Allergy", "Egg Allergy"
]

const DietaryPreferences = () => {
  // create state to store the checkboxes the user selects
  const [selectedPrefs, setSelectedPrefs] = useState([])

  // initialize router so we can navigate the user to a different page
  const router = useRouter()

  // this function runs when a checkbox is clicked
  const togglePreference = (pref) => {
    // if it's already selected, remove it
    if (selectedPrefs.includes(pref)) {
      setSelectedPrefs(selectedPrefs.filter((p) => p !== pref))
    } else {
      // if it's not selected yet, add it to the list
      setSelectedPrefs([...selectedPrefs, pref])
    }
  }

  // this runs when user clicks "save preferences"
  const handleSave = (e) => {
    e.preventDefault() // stop page from refreshing

    // here you would usually send selectedPrefs to the backend (not needed for now)

    // after saving, redirect user to dashboard
    router.push("/dashboard")
  }

  // this runs when user clicks "skip"
  const handleSkip = () => {
    // just skip and send them straight to dashboard
    router.push("/dashboard")
  }

  return (
    // container that centers the card on the page (styled in Auth.css)
    <div className="auth-container">
      {/* white card with rounded edges and padding */}
      <div className="auth-card">
        {/* heading of the page */}
        <h2>Dietary Preferences</h2>

        {/* short description below the title */}
        <p className="auth-description">
          Select your dietary preferences to help us show you relevant food options
        </p>

        {/* form for checkboxes and buttons */}
        <form onSubmit={handleSave}>
          {/* grid of checkboxes with 2 columns */}
          <div className="checkbox-grid">
            {/* loop through each dietary option and render a checkbox */}
            {dietaryOptions.map((pref) => (
              <label key={pref} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={selectedPrefs.includes(pref)} // check if it's selected
                  onChange={() => togglePreference(pref)} // toggle on click
                />
                {pref} {/* label next to checkbox */}
              </label>
            ))}
          </div>

          {/* row with skip and save buttons */}
          <div className="button-row">
            {/* skip button - goes to dashboard without saving */}
            <button type="button" className="auth-btn" onClick={handleSkip}>
              Skip
            </button>

            {/* save button - triggers form submit */}
            <button type="submit" className="auth-btn primary">
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DietaryPreferences