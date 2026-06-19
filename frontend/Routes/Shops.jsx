import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import { NavBar } from "../components/NavBar"
import { Footer } from "../components/footer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ShopFilterBar } from "../components/Shops/ShopFilterBar"

// IMPORT YOUR TWO NEW COMPONENTS
import { ShopList } from "../components/Shops/ShopList"
import { ShopMap } from "../components/Shops/ShopMap"

import {
    faClock,
    faLocationDot,
    faStar,
    faXmark,
    faBolt,
    faSearch,
    faLocationCrosshairs,
} from "@fortawesome/free-solid-svg-icons"

import { useLoadScript } from "@react-google-maps/api"

function Shops() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const urlLat = searchParams.get('lat');
    const urlLng = searchParams.get('lng');
    const urlLocName = searchParams.get('locName');

    const [userLocation, setUserLocation] = useState({ 
        lat: urlLat ? parseFloat(urlLat) : 6.9271, 
        lng: urlLng ? parseFloat(urlLng) : 79.8612 
    });
    const [displayLocationName, setDisplayLocationName] = useState(urlLocName ? `Near ${urlLocName}` : "Near Colombo, Sri Lanka");
    
    const [locationAlert, setLocationAlert] = useState(null)

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, 
    });

    const [activeMarker, setActiveMarker] = useState(null) 
    const [shopsList, setShopsList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    
    const getInitialState = (key, defaultValue) => {
        const saved = sessionStorage.getItem(key);
        if (saved !== null) {
            if (saved === 'true') return true;
            if (saved === 'false') return false;
            return saved;
        }
        return defaultValue;
    };

    const [activeVehicle, setActiveVehicle] = useState(getInitialState('fixgo_activeVehicle', searchParams.get('vehicle') || ""));
    const [activeService, setActiveService] = useState(getInitialState('fixgo_activeService', searchParams.get('service') || ""));
    const [sortBy, setSortBy] = useState(getInitialState('fixgo_sortBy', 'distance'));
    const [searchName, setSearchName] = useState(getInitialState('fixgo_searchName', ""));
    const [needsTow, setNeedsTow] = useState(getInitialState('fixgo_needsTow', searchParams.get('needs_tow') === 'true'));
    
    // --- ADDED: Quick Filter State ---
    const [quickFilter, setQuickFilter] = useState('all'); 

    const [vehicleFilters, setVehicleFilters] = useState([]);
    const [serviceFilters, setServiceFilters] = useState([]);

    const handleLocationUpdate = (lat, lng, textDesc) => {
        setUserLocation({ lat, lng });
        if (textDesc && textDesc !== "Current Location") {
            setLocationAlert(`Showing results for ${textDesc}.`);
        } else {
            setLocationAlert(null);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/getCategories.php');
                const json = await response.json();
                
                if (response.ok && json.vehicles && json.services) {
                    setVehicleFilters(json.vehicles);
                    setServiceFilters(json.services);
                } else {
                    throw new Error(json.error || "Failed to fetch");
                }
            } catch (error) {
                console.warn("Backend categories not ready. Using fallbacks.", error);
                setVehicleFilters([
                    { id: 1, label: "3-Wheelers and Bikes" },
                    { id: 2, label: "4-Wheelers" },
                    { id: 3, label: "Commercial Vehicles" },
                ]);
                setServiceFilters([
                    { id: 1, label: "Garages" },
                    { id: 2, label: "Service Centers" },
                    { id: 3, label: "Spare Parts" },
                ]);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        sessionStorage.setItem('fixgo_activeVehicle', activeVehicle);
        sessionStorage.setItem('fixgo_activeService', activeService);
        sessionStorage.setItem('fixgo_sortBy', sortBy);
        sessionStorage.setItem('fixgo_searchName', searchName);
        sessionStorage.setItem('fixgo_needsTow', needsTow.toString());
    }, [activeVehicle, activeService, sortBy, searchName, needsTow]);

    useEffect(() => {
        if (urlLat && urlLng) {
            setLocationAlert("Showing results for your searched city.");
            return; 
        }

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setLocationAlert(null); 
                },
                (error) => {
                    console.warn("Geolocation error:", error.message);
                    setLocationAlert("Location access denied. Showing default results for Colombo.");
                }
            );
        } else {
            setLocationAlert("Geolocation is not supported by your browser.");
        }
    }, [urlLat, urlLng]);

    useEffect(() => {
        const fetchShops = async () => {
            // 1. ADDED: Grab the token from storage
            const token = localStorage.getItem("jwt_token"); // Adjust key if you saved it differently
            // 1. Redirect if no token exists at all
            if (!token) {
                navigate('/login'); // <-- CHANGE THIS to your actual sign-in route (e.g., '/signin')
                return;
            }

            setIsLoading(true)
            setError(null)
            
            try {
                let url = `http://localhost:8000/api/search.php?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=15&sort=${sortBy}&quick_filter=${quickFilter}`
                
                if (activeVehicle) url += `&vehicle_category=${activeVehicle}`
                if (activeService) url += `&shop_category=${activeService}`
                if (searchName) url += `&name=${encodeURIComponent(searchName)}`
                if (needsTow) url += `&needs_tow=true`

                // 2. CHANGED: Updated fetch to include the Authorization header
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.status === 401) {
                    localStorage.removeItem("jwt_token"); // clear the bad token
                    navigate('/login'); // <-- CHANGE THIS to your actual sign-in route
                    return;
                }
                
                const jsonResponse = await response.json()

                if (!response.ok) throw new Error(jsonResponse.message || "Failed to fetch shops")

                setShopsList(jsonResponse.data)
            } catch (err) {
                setError(err.message)
                setShopsList([]) 
            } finally {
                setIsLoading(false)
            }
        }
        fetchShops()
    }, [activeVehicle, activeService, sortBy, userLocation, searchName, needsTow, quickFilter])

    return (
        <>
            <NavBar />

            <main className="min-h-screen bg-[#f8faf9] pt-8">
                
                {/* 1. NEW CLEAN HEADER & LOCATION WIDGET */}
                <section className="mx-auto max-w-7xl px-4 md:px-8 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="font-sans text-3xl font-bold text-gray-900 tracking-tight">Find Nearby Repair Shops</h1>
                        <p className="text-sm text-gray-500 mt-1">Compare verified garages and book the best service for your vehicle.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faLocationDot} className="text-blue-500" /> 
                                {/* CHANGED: Now uses our dynamic state variable */}
                                {displayLocationName}
                            </span>
                            <span className="text-xs text-gray-400">Enable precise location for better results</span>
                        </div>
                        <button 
                            onClick={() => {
                                if ("geolocation" in navigator) {
                                    // 1. Give the user instant feedback (Make sure there are no typos here!)
                                    setDisplayLocationName("Locating..."); 
                                    
                                    navigator.geolocation.getCurrentPosition(async (pos) => {
                                        const lat = pos.coords.latitude;
                                        const lng = pos.coords.longitude;
                                        
                                        // 2. Update the map and search coordinates
                                        setUserLocation({ lat, lng });
                                        
                                        // 3. NEW V4 API FETCH
                                        try {
                                            const response = await fetch(`https://geocode.googleapis.com/v4/geocode/location/${lat},${lng}?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`);
                                            const data = await response.json();
                                            
                                            if (data.results && data.results.length > 0) {
                                                // V4 uses camelCase 'addressComponents' and 'longText'
                                                const cityObj = data.results[0].addressComponents.find(comp => comp.types.includes("locality"));
                                                const cityName = cityObj ? cityObj.longText : "your location";
                                                
                                                setDisplayLocationName(`Near ${cityName}`);
                                            } else {
                                                setDisplayLocationName("Near your location");
                                            }
                                        } catch (error) {
                                            console.error("Geocoding failed:", error);
                                            setDisplayLocationName("Near your location");
                                        }
                                    });
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2 border border-[#16a34a] text-[#16a34a] rounded-lg text-xs font-bold hover:bg-[#16a34a]/5 transition-colors"
                        >
                            <FontAwesomeIcon icon={faLocationCrosshairs} /> Enable Location
                        </button>
                    </div>
                </section>

                {/* 2. THE FILTER BAR */}
                <section className="mx-auto max-w-7xl px-4 md:px-8 mb-6 relative z-20">
                    <ShopFilterBar 
                        vehicleOptions={vehicleFilters}
                        serviceOptions={serviceFilters}
                        initialLocationText={urlLocName || ""}
                        onLocationChange={handleLocationUpdate}
                        searchName={searchName}
                        setSearchName={setSearchName}
                        activeVehicle={activeVehicle}
                        setActiveVehicle={setActiveVehicle}
                        activeService={activeService}
                        setActiveService={setActiveService}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        needsTow={needsTow}
                        setNeedsTow={setNeedsTow}
                    />
                </section>

                {/* 3. NEW QUICK FILTERS ROW */}
                <section className="mx-auto max-w-7xl px-4 md:px-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-gray-700 mr-2">Quick Filters:</span>
                        
                        <button onClick={() => setQuickFilter('all')} className={`px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-2 border ${quickFilter === 'all' ? 'bg-[#16a34a] text-white border-[#16a34a]' : 'bg-white text-gray-700 border-gray-200 hover:border-[#16a34a]/50'}`}>
                            All Shops
                        </button>
                        
                        {/* CHANGED: onClick now toggles back to 'all' if clicked while active */}
                        <button onClick={() => setQuickFilter(quickFilter === 'open' ? 'all' : 'open')} className={`px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-2 border ${quickFilter === 'open' ? 'bg-[#16a34a] text-white border-[#16a34a]' : 'bg-white text-gray-700 border-gray-200 hover:border-[#16a34a]/50'}`}>
                            <FontAwesomeIcon icon={faClock} /> Open Now
                        </button>
                        
                        {/* CHANGED: onClick now toggles back to 'all' if clicked while active */}
                        <button onClick={() => setQuickFilter(quickFilter === 'nearest' ? 'all' : 'nearest')} className={`px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-2 border ${quickFilter === 'nearest' ? 'bg-[#16a34a] text-white border-[#16a34a]' : 'bg-white text-gray-700 border-gray-200 hover:border-[#16a34a]/50'}`}>
                            <FontAwesomeIcon icon={faLocationDot} /> Nearest
                        </button>
                        
                        {/* CHANGED: onClick now toggles back to 'all' if clicked while active */}
                        <button onClick={() => setQuickFilter(quickFilter === 'top_rated' ? 'all' : 'top_rated')} className={`px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-2 border ${quickFilter === 'top_rated' ? 'bg-[#16a34a] text-white border-[#16a34a]' : 'bg-white text-gray-700 border-gray-200 hover:border-[#16a34a]/50'}`}>
                            <FontAwesomeIcon icon={faStar} /> Top Rated
                        </button>

                        {/* CHANGED: onClick now toggles back to 'all' if clicked while active */}
                        <button onClick={() => setQuickFilter(quickFilter === 'roadside' ? 'all' : 'roadside')} className={`px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-2 border ${quickFilter === 'roadside' ? 'bg-[#16a34a] text-white border-[#16a34a]' : 'bg-white text-gray-700 border-gray-200 hover:border-[#16a34a]/50'}`}>
                            <FontAwesomeIcon icon={faBolt} /> Roadside Assistance
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Sort by:</span>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)} 
                            className="bg-transparent font-bold text-gray-900 outline-none cursor-pointer text-sm"
                        >
                            <option value="distance">Nearest First</option>
                            <option value="rating">Highest Rated</option>
                        </select>
                    </div>
                </section>

                {/* 4. MAIN CONTENT GRID (LIST & MAP) */}
                <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8"> 
                    
                    {/* ADDED: Full border wrapper with rounded corners and light background */}
                    <div className="border border-gray-200 rounded-3xl p-4 md:p-6 bg-white/50">
                        
                        {locationAlert && (
                            <div className="mb-6 rounded-xl bg-yellow-50 border border-yellow-200 px-5 py-4 text-yellow-800 font-mono text-sm flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faLocationDot} className="text-yellow-600 text-lg" />
                                    <p>{locationAlert}</p>
                                </div>
                                <button onClick={() => setLocationAlert(null)} className="text-yellow-600 hover:text-yellow-900 transition bg-yellow-100 hover:bg-yellow-200 rounded-full w-8 h-8 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </div>
                        )}

                        <div className="grid gap-6 lg:grid-cols-12 items-start relative">
                            
                            {/* LEFT: Scrollable List Container */}
                            <div className="lg:col-span-6 flex flex-col order-last lg:order-first">
                                <ShopList 
                                    shopsList={shopsList}
                                    isLoading={isLoading}
                                    error={error} 
                                    // Ensures the dynamic city name shows in your list header
                                    locationName={displayLocationName} 
                                />
                            </div>

                            {/* RIGHT: Sticky Map Container */}
                            <div className="lg:col-span-6 order-first lg:order-last h-full">
                                
                                <div className="mb-4 text-sm font-bold invisible hidden lg:block">
                                    Spacer
                                </div>

                                <ShopMap 
                                    isLoaded={isLoaded} 
                                    loadError={loadError} 
                                    userLocation={userLocation} 
                                    shopsList={shopsList} 
                                    activeMarker={activeMarker} 
                                    setActiveMarker={setActiveMarker} 
                                />
                            </div>

                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default Shops