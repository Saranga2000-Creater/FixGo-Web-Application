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
        localStorage.clear();
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
            <header className="flex justify-between items-center w-full sticky top-0 z-50 bg-[#f9f9f9] border-b border-[#d1e7d7] shadow-sm py-4 max-w-max-width p-3 "  >

                <div className="flex items-center gap-4">
                    <img alt="FixGo Logo" className="h-10 w-auto" src={logo} />
                    <span className="text-lg font-bold text-[#14532d]">FixGo</span>
                </div>

                <nav className="hidden md:flex items-center gap-20" >
                    <NavLink to="/" className="text-[#000000] font-mono active:scale-110 py-1 transition-colors " >Homepage</NavLink>
                    <NavLink to="/shops" className="text-[#000000] font-mono active:scale-110 py-1 transition-colors "  >Find Shops</NavLink>
                    <NavLink to="/services" className="text-[#000000] font-mono active:scale-110 py-1 transition-colors" >Dashboard</NavLink>
                    <NavLink to="/support" className="text-[#000000] font-mono active:scale-110 py-1 transition-colors" >Support</NavLink>
                </nav>

                <div className="flex items-center gap-4" >

                    <FontAwesomeIcon icon={faBell} className=" hover:bg-[#e8e8e8] p-2 rounded-full transition-colors active:scale-95 cursor-pointer" />
                    <FontAwesomeIcon icon={faCircleQuestion} className="hover:bg-[#e8e8e8] p-2 rounded-full transition-colors active:scale-95 cursor-pointer" />

                    {token ? (
                        <>
                            <div
                                onClick={() => navigate("/services")}
                                className="w-10 h-10 rounded-full border-2 border-[#16a34a] overflow-hidden flex items-center justify-center bg-white cursor-pointer active:scale-95 transition-all shadow-sm"
                                title="Go to Dashboard"
                            >
                                {profileImage ? (
                                    <img
                                        src={profileImage.startsWith("http") ? profileImage : `http://localhost:8000/${profileImage}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FontAwesomeIcon icon={faUser} className="text-[#16a34a] text-lg" />
                                )}
                            </div>
                            <button
                                onClick={handleSignOut}
                                title="Log Out"
                                className="hover:bg-[#e8e8e8] p-2 rounded-full transition-colors active:scale-95 cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faRightFromBracket} className="text-lg text-gray-700 hover:text-red-600" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setShowSignIn(true)}
                                className="border-2 border-[#16a34a] text-[#16a34a] font-extralight px-6 py-2 rounded-lg hover:bg-[#16a34a] hover:text-white active:scale-95 transition-all"
                            >
                                Log In
                            </button>
                            <button
                                onClick={handleRegister}
                                className="bg-[#16a34a] text-white font-extralight px-6 py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all"
                            >
                                Get Started
                            </button>
                        </>
                    )}

                </div>

            </header>

            {showSignIn && <Sign setShowSignIn={setShowSignIn} />}
        </>
    )
}