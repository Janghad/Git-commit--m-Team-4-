"use client" // tells next.js this file uses client-side logic (like useState)

import { useState } from "react" // lets us track and update form data
import { useRouter } from "next/navigation" // helps us redirect the user
import "../../Auth.css" // custom css file that controls layout and styling

/**
 * List of available dietary preference options
 * @constant {string[]}
 */
const dietaryOptions = [
  "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free",
  "Nut-Free", "Halal", "Kosher", "Shellfish Allergy",
  "Soy Allergy", "Egg Allergy"
]

/**
 * Dietary Preferences Page Component
 * 
 * A modern, responsive page that allows users to select their dietary preferences.
 * This information is used to filter and recommend relevant food options.
 * 
 * Features:
 * - Multi-select dietary preferences
 * - Grid layout for easy selection
 * - Skip option for users who don't want to set preferences
 * - Automatic preference saving
 * 
 * Styling:
 * - Dark theme with zinc color palette
 * - Green accent colors for brand consistency
 * - Modern checkbox inputs with proper spacing and hover states
 * - Responsive grid layout
 * 
 * @component
 * @example
 * return (
 *   <DietaryPreferences />
 * )
 */
const DietaryPreferences = () => {
  // create state to store the checkboxes the user selects
  const [selectedPrefs, setSelectedPrefs] = useState([])

  // initialize router so we can navigate the user to a different page
  const router = useRouter()

  /**
   * Toggles a dietary preference selection
   * 
   * @param {string} pref - The dietary preference to toggle
   */
  const togglePreference = (pref) => {
    // if it's already selected, remove it
    if (selectedPrefs.includes(pref)) {
      setSelectedPrefs(selectedPrefs.filter((p) => p !== pref))
    } else {
      // if it's not selected yet, add it to the list
      setSelectedPrefs([...selectedPrefs, pref])
    }
  }

  /**
   * Handles form submission and saves dietary preferences
   * 
   * @param {React.FormEvent} e - The form submission event
   */
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
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-zinc-800 p-8 rounded-2xl shadow-xl">
        {/* Logo */}
        <div className="mx-auto h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center">
          <span className="text-green-500 text-2xl font-bold">S!B</span>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Dietary Preferences</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Select your dietary preferences to help us show you relevant food options
          </p>
        </div>

        <form onSubmit={handleSave} className="mt-8 space-y-6">
          {/* Preferences Grid */}
          <div className="grid grid-cols-2 gap-4">
            {dietaryOptions.map((pref) => (
              <label
                key={pref}
                className="relative flex items-start cursor-pointer group"
              >
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={selectedPrefs.includes(pref)}
                    onChange={() => togglePreference(pref)}
                    className="h-4 w-4 text-green-500 border-zinc-600 rounded bg-zinc-700 focus:ring-green-500 focus:ring-offset-zinc-800"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <span className="text-zinc-300 group-hover:text-zinc-200">
                    {pref}
                  </span>
                </div>
              </label>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 py-2 px-4 border border-zinc-600 rounded-lg text-sm font-medium text-zinc-300 bg-transparent hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-zinc-800 transition-colors duration-200"
            >
              Skip
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-zinc-800 transition-colors duration-200"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DietaryPreferences