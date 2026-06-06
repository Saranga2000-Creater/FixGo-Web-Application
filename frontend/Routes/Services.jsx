
import { useLocation } from "react-router-dom"
import { NavBar } from "../components/NavBar"
import Customer from "../components/CustomerDashboard";
import ShopOwner from "../components/ShopOwnerDashboard";
import Admin from "../components/AdminControlDashboard"


function Services() {

    const location = useLocation();
    const role = location.state?.role || sessionStorage.getItem("role");

    return (

        <>
            <NavBar />

            <div className="h-auto w-full">

                {
                    role === "admin" && <Admin />
                }
                {
                    role === "customer" && <Customer />
                }
                {
                    role === "owner" && <ShopOwner />
                }

            </div>

        </>
    )
}

export default Services