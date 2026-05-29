
import { NavBar } from "../components/NavBar"
import { useLocation } from "react-router-dom"
import Customer from "../components/CustomerDashboard";
import ShopOwner from "../components/ShopOwnerDashboard";
import Admin from "../components/AdminControlDashboard"


function Services() {

    const location = useLocation();
    const role = location.state?.role;

        return(

            <>

                <NavBar />

                <div className="flex items-center justify-center h-auto">

                    {
                        role==="admin" && <Admin/>
                    }
                    {
                        role==="customer" && <Customer />
                    }
                    {
                        role==="owner" && <ShopOwner />
                    }

                </div>

            </>
        )
}

export default Services