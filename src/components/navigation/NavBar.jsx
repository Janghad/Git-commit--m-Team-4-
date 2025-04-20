"use client"; // this tells next.js that this file runs on the client side

// import the useState hook to manage state in our component
import { useEffect, useState } from "react";
// import the useRouter hook from next.js to change pages (redirect)
import { useRouter } from "next/navigation";
// import supabase client
import supabase from "@/lib/supabaseClient";
import SettingsModal from "@/components/common/SettingsModal";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

/**
 * NavBar Component
 * 
 * This component shows a horizontal navigation bar at the top of the dashboard with:
 * - User profile section (left): Displays user initials in a green circle and full name
 * - Spark!Bytes logo (center): Displayed in green to match the application's theme
 * - Settings button (right): Opens a settings modal with user account options
 * 
 * Styling Notes:
 * - Uses a zinc-900 background with a subtle zinc-800 bottom border for visual separation
 * - User initials circle uses green-400 to match the application's accent color
 * - Spark!Bytes logo is permanently styled in green-400 for brand consistency
 * - Settings button uses zinc-800 background with zinc-700 hover state
 * 
 * @component
 */
const NavBar = () => {
  // get the router to handle navigation between pages
  const router = useRouter();
  // set up a state to decide if the settings dropdown is open or closed; false means closed
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // set up state for the username
  const [userName, setUserName] = useState("Loading");
  const [userInitials, setUserInitials] = useState("U");
  const [userEmail, setUserEmail] = useState("");

  //utlizing useEffect to fetch the user name
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("auth_id", user.id)
          .single();

        if (data && !error) {
          setUserName(data.full_name);
          setUserEmail(user.email);
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
            setUserEmail(userData.user.email);
            setUserInitials(displayName[0].toUpperCase());
          } else {
            setUserName("User");
            setUserInitials("U");
          }
        }
      }
    };

    fetchUserData();
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

  /**
   * Enhanced sign out functionality:
   * - Added error handling to handleSignOut function
   * - Connected handleSignOut to SettingsModal
   * - Improved user flow with proper error handling
   */
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navLinks = [
    { href: "/dashboard", label: "Home" },
    { href: "/nearby-events", label: "Nearby Events" },
    { href: "/upcoming-events", label: "Upcoming Events" },
    { href: "/favorites", label: "Favorites" }
  ];

  return (
    <>
      <nav className="w-full bg-zinc-900 text-white px-6 py-3 flex items-center justify-between relative border-b border-zinc-800">
        {/* User Profile Circle - Using green-400 to match application's accent color */}
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-sm font-medium">
            {userInitials}
          </div>
          <span className="ml-3 font-semibold">{userName}</span>
        </div>

        {/* Spark!Bytes Logo - Centered with permanent green-400 color for brand consistency */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold text-green-400">
          Spark!Bytes
        </div>

        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700 focus:outline-none transition-colors flex items-center gap-2"
        >
          <Cog6ToothIcon className="h-5 w-5" />
          Settings
        </button>
      </nav>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userData={{
          username: userName,
          email: userEmail
        }}
        onSignOut={handleSignOut}
      />
    </>
  );
};

// export the navbar component so other files can use it
export default NavBar;