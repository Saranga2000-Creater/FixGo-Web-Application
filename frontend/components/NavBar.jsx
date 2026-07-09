import { Link, NavLink, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCircleQuestion, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import logo from '../src/assets/FixGo.png'
import { useState } from "react";
import Sign from "./SignIn";

export const NavBar = () => {
    const navigate = useNavigate();
    const [showSignIn, setShowSignIn] = useState(false);
    const token = localStorage.getItem("jwt_token");
    const profileImage = localStorage.getItem("profileImage");

    const handleSignOut = () => {
        // Preserve notification read state across logout
        const preserved = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("fixgo_read_notifs_")) {
                preserved[key] = localStorage.getItem(key);
            }
        }

        localStorage.clear();

        // Restore notification read state
        Object.entries(preserved).forEach(([key, value]) => {
            localStorage.setItem(key, value);
        });

        navigate("/");
    };

    const handleRegister = () => {
        setShowSignIn(false)
        document.getElementById("register")?.scrollIntoView({
            behavior: "smooth"
        });
    }

    return (
        <>
            <header className="flex justify-between items-center w-full sticky top-0 z-50 bg-[#f9f9f9]/95 backdrop-blur-md border-b border-[#d1e7d7] shadow-sm py-3 px-4 md:px-8">

                <div className="flex items-center gap-2 sm:gap-4">
                    <img alt="FixGo Logo" className="h-8 sm:h-10 w-auto" src={logo} />
                    <span className="text-base sm:text-lg font-bold text-[#14532d]">FixGo</span>
                </div>

                <nav className="hidden md:flex items-center gap-6 lg:gap-10">
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => `font-mono active:scale-105 py-1 transition-colors ${isActive ? 'text-[#16a34a]' : 'text-[#000000] hover:text-[#16a34a]'}`}
                    >
                        Homepage
                    </NavLink>
                    
                    <NavLink 
                        to="/shops" 
                        className={({ isActive }) => `font-mono active:scale-105 py-1 transition-colors ${isActive ? 'text-[#16a34a]' : 'text-[#000000] hover:text-[#16a34a]'}`}
                    >
                        Find Shops
                    </NavLink>
                    
                    <NavLink 
                        to="/services" 
                        className={({ isActive }) => `font-mono active:scale-105 py-1 transition-colors ${isActive ? 'text-[#16a34a]' : 'text-[#000000] hover:text-[#16a34a]'}`}
                    >
                        Dashboard
                    </NavLink>
                    
                    <NavLink 
                        to="/support" 
                        className={({ isActive }) => `font-mono active:scale-105 py-1 transition-colors ${isActive ? 'text-[#16a34a]' : 'text-[#000000] hover:text-[#16a34a]'}`}
                    >
                        Support
                    </NavLink>
                </nav>

                <div className="flex items-center gap-2 sm:gap-4">

                    <FontAwesomeIcon icon={faBell} className="hidden sm:block hover:bg-[#e8e8e8] p-2 rounded-full transition-colors active:scale-95 cursor-pointer" />
                    <FontAwesomeIcon icon={faCircleQuestion} className="hidden sm:block hover:bg-[#e8e8e8] p-2 rounded-full transition-colors active:scale-95 cursor-pointer" />

                    {token ? (
                        <>
                            <div
                                onClick={() => navigate("/services")}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#16a34a] overflow-hidden flex items-center justify-center bg-white cursor-pointer active:scale-95 transition-all shadow-sm shrink-0"
                                title="Go to Dashboard"
                            >
                                {profileImage ? (
                                    <img
                                        src={profileImage.startsWith("http") ? profileImage : `http://localhost:8000/${profileImage}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FontAwesomeIcon icon={faUser} className="text-[#16a34a] text-sm sm:text-lg" />
                                )}
                            </div>
                            <button
                                onClick={handleSignOut}
                                title="Log Out"
                                className="hover:bg-[#e8e8e8] p-1.5 sm:p-2 rounded-full transition-colors active:scale-95 cursor-pointer shrink-0"
                            >
                                <FontAwesomeIcon icon={faRightFromBracket} className="text-base sm:text-lg text-gray-700 hover:text-red-600" />
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowSignIn(true)}
                                className="border-2 border-green-500 text-[#16a34a] font-mono px-3 py-1.5 sm:px-6 sm:py-2 rounded-lg hover:bg-[#16a34a] hover:text-white active:scale-95 transition-all text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                            >
                                Log In
                            </button>
                            <button
                                onClick={handleRegister}
                                className="bg-green-500 text-white font-mono px-3 py-1.5 sm:px-6 sm:py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                            >
                                Get Started
                            </button>
                        </div>
                    )}

                </div>

            </header>

            {showSignIn && <Sign setShowSignIn={setShowSignIn} />}
        </>
    )
}