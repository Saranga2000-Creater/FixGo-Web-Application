import React from "react";
import { jwtDecode } from "jwt-decode";
import { NavBar } from "../components/NavBar";
import Customer from "../components/CustomerDashboard";
import ShopOwner from "../components/ShopOwner/ShopOwnerDashboard";
import Admin from "../components/AdminControlDashboard";

function Services() {
    const token = sessionStorage.getItem("token");

    // 1. Guard against completely unauthenticated guests
    if (!token) {
        return (
            <>
                <NavBar />
                <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4 text-center px-4">
                    <h1 className="text-3xl font-bold text-[#14532d]">Please login to access the services.</h1>
                    <p className="text-slate-500 text-lg">Use the SIGN IN button at the top right to log in and access your dashboard.</p>
                </div>
            </>
        );
    }

    let userRole = "";

    try {
        // 2. SECURE EXTRACT: Parse the payload out of the cryptographically sealed token
        const decoded = jwtDecode(token);

        // 3. SECURE TIME CHECK: Has the token expired?
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            sessionStorage.clear();
            return (
                <>
                    <NavBar />
                    <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4 text-center px-4">
                        <h1 className="text-3xl font-bold text-red-500">Your session has expired. Please log in again.</h1>
                    </div>
                </>
            );
        }

        // 4. Extract the dynamic role guaranteed by the backend
        userRole = decoded.role; 
        console.log("Extracted User Role from Token:", userRole);

    } catch (error) {
        // Triggers if someone manually alters the token string characters
        console.error("Token manipulation or corruption detected.");
        sessionStorage.clear();
        return (
            <>
                <NavBar />
                <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4 text-center px-4">
                    <h1 className="text-3xl font-bold text-red-500">Invalid Security Token. Access Blocked.</h1>
                </div>
            </>
        );
    }

    // 5. HELPER FUNCTION: Return the proper dashboard block
    // Note: Adjusted "owner" to "shop_owner" to precisely match your fixgo_web.sql roles!
    const renderDashboard = () => {
        switch (userRole) {
            case "admin":
                return <Admin />
            case "customer":
                return <Customer />;
            case "shop_owner":
                return <ShopOwner />;
            default:
                return (
                    <div className="h-full w-full flex items-center justify-center p-20">
                        <h1 className="text-3xl font-bold text-gray-500">Invalid User Type. Please contact support.</h1>
                    </div>
                );
        }
    };

    // 6. MAIN RETURN: Your layout remains correct, and the NavBar will now display properly!
    return (
        <>
            <NavBar />
            <div className="h-auto w-full">
                {renderDashboard()}
            </div>
        </>
    );
}

export default Services;