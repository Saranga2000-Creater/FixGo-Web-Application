import { useNavigate } from 'react-router-dom';
import { QuickSearchHub } from '../components/Home/QuickSearchHub';
import { NavBar } from '../components/NavBar'
import image from '../src/assets/image4.jpg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBicycle, faSearch, faCar, faTruck, faWarehouse, faTriangleExclamation, faLocationDot, faUserTie, faArrowRight, faWrench, faRocket, faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import Sign from "../components/SignIn"
import { useState } from 'react';
import car from "../src/assets/car.avif"
import serviceCenter from "../src/assets/service.jpg"
import { Footer } from "../components/footer"
import Customer from "../components/Registration/Customer";
import ShopOwner from "../components/Registration/ShopOwner"
import LandingImage from '../components/Home/LandingPage';

function Home() {

    const [showSignIn, setShowSignIn] = useState(false);

    return (

        <div>
            <NavBar />
            <main>
                
                <LandingImage />

                {/* THE NEW, CLEAN COMPONENT */}
                <QuickSearchHub onRequireAuth={() => setShowSignIn(true)} />

                {/* PROMO CARDS SECTION */}
                <section className="py-20  px-4 md:px-8 bg-green-100 " id='register' >
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                        <Customer />

                        <ShopOwner />
                    </div>
                </section>
            </main>

            <Footer />

            {/* This ensures mock auth popup still works */}
            {showSignIn && <Sign />}

        </div>
    )
}

export default Home