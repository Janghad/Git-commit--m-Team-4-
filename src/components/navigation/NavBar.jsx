"use client"; // this tells next.js that this file runs on the client side

// import the useState hook to manage state in our component
import { useState } from "react";
// import the useRouter hook from next.js to change pages (redirect)
import { useRouter } from "next/navigation";

/**
 * navbar component
 *
 * this component shows a horizontal nav bar at the top with the user's name
 * and a settings button that opens a dropdown.
 * the dropdown has options like going to the dietary preferences page.
 */
const NavBar = () => {
  // get the router to handle navigation between pages
  const router = useRouter();
  // set up a state to decide if the settings dropdown is open or closed; false means closed
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // this function toggles the settings dropdown between open and closed
  const toggleSettings = () => {
    // if isSettingsOpen is true, it will become false and vice versa
    setIsSettingsOpen(!isSettingsOpen);
  };

  // this function runs when the user clicks the "change dietary preferences" option
  // it closes the dropdown and sends the user to the dietary preferences page
  const handleChangeDietaryPreferences = () => {
    setIsSettingsOpen(false);
    router.push("/dietary-preferences"); // this changes the page to the dietary preferences route
  };

  return (
    // the nav element is our container for the navigation bar
    // we style it with tailwind classes: full width, background color, padding, flex display, etc.
    <nav className="w-full bg-gray-800 text-white px-6 py-3 flex items-center justify-between shadow-md">
      {/* this div shows a placeholder for the user's name */}
      <div className="font-semibold text-lg">
        User's Name goes here.
      </div>

      {/* this div is the container for the settings button and dropdown */}
      <div className="relative">
        {/* this button toggles the dropdown menu when clicked */}
        <button
          onClick={toggleSettings}
          className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 focus:outline-none"
        >
          settings
        </button>
        {/* if isSettingsOpen is true, we show the dropdown menu */}
        {isSettingsOpen && (
          // this div is the dropdown; it is absolutely positioned relative to the button
          <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded shadow-lg z-10">
            {/* this button in the dropdown sends the user to the dietary preferences page */}
            <button
              onClick={handleChangeDietaryPreferences}
              className="w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              change dietary preferences
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

// export the navbar component so other files can use it
export default NavBar;