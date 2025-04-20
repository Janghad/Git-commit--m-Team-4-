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
  const [userName, setUserName] = useState("Loading");
  const [userInitials, setUserInitials] = useState("U");

  //utlizing useEffect to fetch the user name
  useEffect(() => {
    const fetchUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("auth_id", user.id)
          .single();

        if (data && !error) {
          setUserName(data.full_name);
          // Generate initials from full name
          const initials = data.full_name
            .split(' ')
            .map(name => name[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
          setUserInitials(initials);
        } else {
          const { data: userData } = await supabase.auth.getUser();
          if (userData && userData.user) {
            const displayName = userData.user.user_metadata?.full_name || 
                              userData.user.email?.split('@')[0] || 
                              "User";
            setUserName(displayName);
            setUserInitials(displayName[0].toUpperCase());
          } else {
            setUserName("User");
            setUserInitials("U");
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "Home" },
    { href: "/nearby-events", label: "Nearby Events" },
    { href: "/upcoming-events", label: "Upcoming Events" },
    { href: "/favorites", label: "Favorites" }
  ];

  return (
    // the nav element is our container for the navigation bar
    // we style it with tailwind classes: full width, background color, padding, flex display, etc.
    <nav className="w-full bg-zinc-900 text-white px-6 py-3 flex items-center justify-between shadow-md relative">
      {/* User Profile Circle */}
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-medium">
          {userInitials}
        </div>
        <span className="ml-3 font-semibold">{userName}</span>
      </div>

      {/* SparkBytes Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">
        SparkBytes
      </div>

      {/* Settings */}
      <div className="relative">
        <button
          onClick={toggleSettings}
          className="bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700 focus:outline-none transition-colors"
        >
          Settings
        </button>
        {isSettingsOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-zinc-800 rounded shadow-lg z-10">
            <button
              onClick={handleChangeDietaryPreferences}
              className="w-full text-left px-4 py-2 hover:bg-zinc-700 text-white transition-colors"
            >
              Change Dietary Preferences
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

// export the navbar component so other files can use it
export default NavBar;