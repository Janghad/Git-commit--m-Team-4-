"use client"; // this tells next.js that this file runs on the client side

// import the useState hook to manage state in our component
import { useEffect, useState } from "react";
// import the useRouter hook from next.js to change pages (redirect)
import { useRouter } from "next/navigation";
// import supabase client
import supabase from "@/lib/supabaseClient";

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

  // set up state for the username
  const [userName, setUserName] = useState("Loading")

  //utlizing useEffect to fetch the user name
  useEffect(() => {
    const fetchUserName = async () => {
    //Gets the current user
    const {data: {user}} = await supabase.auth.getUser();

    if (user) {
      //Used for debugging
      console.log("Current user ID:", user.id)
      // Fetching the user's profile info from SupaBase table 
      const {data, error} = await supabase
        .from("profiles")
        .select("full_name")
        .eq("auth_id", user.id)
        .single();

      if (data && !error) {
        setUserName(data.full_name);
      } else {
        console.error("Error fetching the user's profile:", error, "User ID:", user.id);
          // Check if the user exists in auth but does not have a profile
          const { data: userData } = await supabase.auth.getUser();
          if (userData && userData.user) {
            // Use the user's email or name from auth if available
            const displayName = userData.user.user_metadata?.full_name || 
                                userData.user.email?.split('@')[0] || 
                                "User";
            setUserName(displayName);
          } else {
        setUserName("User");
      }
    }
    }
    };

    fetchUserName();
  }, []);

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
        {userName}
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