import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar'
import image from '../src/assets/image4.jpg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBicycle, faSearch, faCar, faTruck, faWarehouse, faTriangleExclamation, faLocationDot, faUserTie, faArrowRight, faWrench, faRocket, faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import Sign from "../components/SignIn"
import { useState } from 'react';
import car from "../src/assets/car.avif"
import serviceCenter from "../src/assets/service.jpg"
import { Footer } from "../components/footer"

function Home() {

    const navigate = useNavigate();
    const [showSignIn, setShowSignIn] = useState(false)

    // ADDED: States to track what the user clicks in the Quick Search Hub
    const [homeVehicle, setHomeVehicle] = useState("");
    const [homeService, setHomeService] = useState("");
    const [homeCity, setHomeCity] = useState("Current Location");

    // ADDED: The routing and auth logic
    const handleSearchClick = () => {
        // TEMPORARY MOCK AUTH CHECK (Set to false to test the login popup)
        const isUserLoggedIn = true; 
        
        if (!isUserLoggedIn) {
            // Because you already built a SignIn component, let's open it!
            setShowSignIn(true); 
            return; 
        }

        // Build the URL parameters using the standardized IDs from your Shops page
        const params = new URLSearchParams();
        if (homeVehicle) params.append('vehicle', homeVehicle);
        if (homeService) params.append('service', homeService);

        // CHANGED: Only send the city to the URL if it is an actual typed city
        if (homeCity && homeCity !== "Current Location") {
            params.append('city', homeCity.trim());
        }
        
        // Send the user to the shops page with the data attached!
        navigate(`/shops?${params.toString()}`);
    }

    return (

        <div>
            <NavBar />
            <main>
                <section className="relative min-h-[70vh] flex items-center justify-center py-20 px-4 md:px-8 overflow-hidden ">
                    <div className="absolute inset-0 z-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}
                    ></div>
                    <div className="relative z-10 max-w-max-width mx-auto text-center">
                        <div className="inline-block px-4 py-1 mb-6 rounded-full bg-[#16a34a]/20 border border-[#16a34a] text-white font-bold text-sm tracking-wider uppercase">
                            Trusted across Western Province
                        </div>
                        <h1 className="font-display text-display text-white mb-6 leading-tight md:max-w-4xl mx-auto">
                            Expert Vehicle Care. <br /> <span className="text-[#16a34a]">Verified &amp; Fast.</span>
                        </h1>
                        <p className="font-body-lg text-white mb-10 max-w-2xl mx-auto">
                            The ultimate automotive management platform for Western Province. Find certified garages, book services, and get emergency roadside assistance in clicks.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button className="w-full sm:w-auto bg-[#16a34a] text-white font-label-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:brightness-110 transition-all transform active:scale-95">
                                FIND A REPAIR SHOP
                            </button>
                            <button className="w-full sm:w-auto border-2 border-[#16a34a] text-[#16a34a] font-label-bold text-lg px-10 py-4 rounded-xl hover:bg-[#16a34a]/10 transition-all active:scale-95">
                                LEARN MORE
                            </button>
                        </div>
                    </div>
                </section>

                {/* ----------------------------------------------------
                  UPGRADED: QUICK SEARCH HUB - SLEEK FILTER BAR UI
                  ----------------------------------------------------
                */}
                <section className="relative -mt-16 z-20 px-4 md:px-8 max-w-5xl mx-auto mb-20">
                    <div className="bg-white border border-[#d1e7d7] rounded-2xl shadow-[0_8px_30px_rgb(22,163,74,0.08)] overflow-hidden transition-shadow hover:shadow-[0_12px_40px_rgb(22,163,74,0.12)]">
                        <div className="p-5 md:p-7">
                            
                            {/* COMPACT HEADER */}
                            <h2 className="font-mono text-xl mb-5 flex items-center gap-3 text-[#14532d] font-bold">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#16a34a]/10 border border-[#16a34a]/20">
                                    <FontAwesomeIcon icon={faSearch} className="text-[#16a34a] text-sm" />
                                </span>
                                Quick Search
                            </h2>

                            {/* ROW 1: THE CATEGORY CHOICES */}
                            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-x-6 gap-y-4 mb-5 pb-5 border-b border-[#d1e7d7]/60">
                                
                                {/* 1. Vehicle Category (Now Sleek Horizontal Pills) */}
                                <div>
                                    <p className="font-mono text-[11px] text-[#274c3a] uppercase font-bold tracking-widest mb-2">Vehicle Category</p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button 
                                            onClick={() => setHomeVehicle("1")}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border rounded-xl transition-all
                                                ${homeVehicle === "1" ? 'border-[#16a34a] bg-[#16a34a]/10 text-[#16a34a]' : 'border-[#d1e7d7] hover:border-[#16a34a] hover:bg-[#16a34a]/5 text-[#274c3a]'}`}
                                        >
                                            <FontAwesomeIcon icon={faBicycle} className="text-lg" />
                                            <span className="font-mono text-sm font-bold whitespace-nowrap">3-Wheelers &amp; Bikes</span>
                                        </button>

                                        <button 
                                            onClick={() => setHomeVehicle("2")}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border rounded-xl transition-all
                                                ${homeVehicle === "2" ? 'border-[#16a34a] bg-[#16a34a]/10 text-[#16a34a]' : 'border-[#d1e7d7] hover:border-[#16a34a] hover:bg-[#16a34a]/5 text-[#274c3a]'}`}
                                        >
                                            <FontAwesomeIcon icon={faCar} className="text-lg" />
                                            <span className="font-mono text-sm font-bold whitespace-nowrap">4-Wheelers</span>
                                        </button>

                                        <button 
                                            onClick={() => setHomeVehicle("3")}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border rounded-xl transition-all
                                                ${homeVehicle === "3" ? 'border-[#16a34a] bg-[#16a34a]/10 text-[#16a34a]' : 'border-[#d1e7d7] hover:border-[#16a34a] hover:bg-[#16a34a]/5 text-[#274c3a]'}`}
                                        >
                                            <FontAwesomeIcon icon={faTruck} className="text-lg" />
                                            <span className="font-mono text-sm font-bold whitespace-nowrap">Commercial</span>
                                        </button>
                                    </div>
                                </div>

                                {/* 2. Service Type */}
                                <div>
                                    <p className="font-mono text-[11px] text-[#274c3a] uppercase font-bold tracking-widest mb-2">Service Type</p>
                                    <div className="relative w-full">
                                        <select 
                                            value={homeService}
                                            onChange={(e) => setHomeService(e.target.value)}
                                            className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-[#d1e7d7] bg-[#f8f4f0] font-mono text-sm cursor-pointer outline-none focus:border-[#16a34a] transition-colors"
                                        >
                                            <option value="">All Services</option>
                                            <option value="1">Garages</option>
                                            <option value="2">Service Centers</option>
                                            <option value="3">Spare Parts</option>
                                        </select>
                                        <FontAwesomeIcon icon={faWarehouse} className="text-sm text-[#274c3a] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* ROW 2: THE LOCATION & MASTER GO BUTTON */}
                            <div className="flex flex-col md:flex-row gap-3 items-stretch">
                                
                                {/* 3. The Location Input */}
                                <div className="relative grow w-full flex items-center">
                                    <FontAwesomeIcon
                                        icon={homeCity === "Current Location" ? faLocationCrosshairs : faLocationDot}
                                        className={`absolute left-4 pointer-events-none transition-colors z-10 text-sm ${homeCity === "Current Location" ? 'text-[#16a34a]' : 'text-[#14532d]/50'}`}
                                    />
                                    
                                    <input 
                                        value={homeCity}
                                        onChange={(e) => setHomeCity(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                                        onFocus={() => {
                                            if (homeCity === "Current Location") setHomeCity("");
                                        }}
                                        onBlur={() => {
                                            if (homeCity.trim() === "") setHomeCity("Current Location");
                                        }}
                                        className={`w-full h-full pl-10 pr-4 py-3 rounded-xl border outline-none font-body-md transition-all text-sm
                                            ${homeCity === "Current Location" ? 'bg-[#16a34a]/5 border-[#16a34a]/30 text-[#16a34a] font-bold' : 'bg-[#f8f4f0] border-[#d1e7d7] text-black focus:border-[#16a34a]'}`}
                                        placeholder="Enter a city in Western Province..." 
                                        type="text" 
                                    />
                                </div>

                                {/* 4. THE MASTER SEARCH BUTTON */}
                                <button 
                                    onClick={handleSearchClick}
                                    className="w-full md:w-auto shrink-0 bg-[#16a34a] text-white font-mono text-sm font-bold px-8 py-3 rounded-xl hover:bg-[#16a34a]/80 transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faSearch} />
                                    SEARCH NOW
                                </button>
                            </div>

                        </div>
                    </div>
                </section>

                <section className="py-20  px-4 md:px-8 bg-green-100 " id='register' >
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div className="relative group overflow-hidden rounded-3xl bg-white border border-gray-800 p-10 flex flex-col justify-between min-h-100 shadow-sm hover:shadow-xl transition-all">
                            <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:scale-110 transition-transform duration-700">

                                <img src={car} />
                            </div>
                            <div>
                                <span className="inline-block p-3 rounded-2xl bg-gray-300 text-black mb-6">
                                    <FontAwesomeIcon
                                        icon={faUserTie}
                                        className="text-2xl mb-3 text-black group-hover:text-black/90"
                                    />
                                </span>
                                <h3 className="font-mono text-2xl mb-4">Are you a vehicle owner?</h3>
                                <p className="font-mono text-black max-w-sm">Manage your vehicle health, track repair history, and get roadside help anywhere in Western Province.</p>
                            </div>
                            <button className="w-fit mt-8 bg-black text-white font-bold px-8 py-4 rounded-xl flex items-center gap-3 group-hover:bg-black/90 transition-all">
                                Register as a Customer
                                <span className="flex justify-center items-center">
                                    <FontAwesomeIcon
                                        icon={faArrowRight}
                                        className="text-2xl mb-3 text-white group-hover:text-white/50"
                                    />
                                </span>
                            </button>
                        </div>

                        <div className="relative group overflow-hidden rounded-3xl bg-black/90 text-white p-10 flex flex-col justify-between min-h-100 shadow-sm hover:shadow-2xl transition-all">
                            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700 ">
                                <img src={serviceCenter} />
                            </div>
                            <div>
                                <span className="inline-block p-3 rounded-2xl bg-green-500 text-on-primary-container mb-6">
                                    <span className="text-4xl">
                                        <FontAwesomeIcon
                                            icon={faWrench}
                                            className="text-2xl mb-3 text-black group-hover:text-black/90"
                                        />
                                    </span>
                                </span>
                                <h3 className="font-mono text-2xl mb-4 text-white">Own a workshop?</h3>
                                <p className="font-mono text-white/70 max-w-sm">Reach more customers, manage appointments, and digitize your automotive business today.</p>
                            </div>
                            <button className="w-fit mt-8 bg-green-500 text-black font-bold px-8 py-4 rounded-xl flex items-center gap-3 hover:brightness-110 transition-all">
                                Register Your Shop
                                <span className="text-4xl">
                                    <FontAwesomeIcon
                                        icon={faRocket}
                                        className="text-2xl mb-3 text-black group-hover:text-black/90"
                                    />
                                </span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

        </div>
    )
}

export default Home