import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from "react"
import { NavBar } from "../components/NavBar"
import { Footer } from "../components/footer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import serviceHero from "../src/assets/service center.jpg"

import {
    faClock,
    faLocationDot,
    faStar,
    faXmark,
    faMapLocationDot,
    faRoute,
    faBolt,
} from "@fortawesome/free-solid-svg-icons"

// CHANGED: Imported the required Google Maps components
import { useLoadScript, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api"

const vehicleFilters = [
    { id: 1, label: "3-Wheelers and Bikes" },
    { id: 2, label: "4-Wheelers" },
    { id: 3, label: "Commercial Vehicles" },
]

const serviceFilters = [
    { id: 1, label: "Garages" },
    { id: 2, label: "Service Centers" },
    { id: 3, label: "Spare Parts" },
]

// ADDED: Map styling container
const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '1rem',
};

function Shops() {
    // ADDED: Make user location dynamic, defaulting to Colombo
    const [userLocation, setUserLocation] = useState({ lat: 6.9271, lng: 79.8612 })
    
    // ADDED: State to control the UI warning banner
    const [locationAlert, setLocationAlert] = useState(null)

    // ADDED: Load the Google Maps API Script

    // ADDED: Load the Google Maps API Script securely via Vite Environment Variables
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, 
    });

    const [selectedShop, setSelectedShop] = useState(null)
    const [activeMarker, setActiveMarker] = useState(null) // State for clicking pins on the map
    
    const [shopsList, setShopsList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    
    // ADDED: Initialize the router hook to read the URL
    const [searchParams] = useSearchParams();

    // CHANGED: These now check the URL first. If nothing is in the URL, they default to empty ("")
    const [activeVehicle, setActiveVehicle] = useState(searchParams.get('vehicle') || "")
    const [activeService, setActiveService] = useState(searchParams.get('service') || "")
    const [sortBy, setSortBy] = useState('distance')

    // ADDED: The Geolocation Engine
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // USER CLICKED ALLOW: Save their exact coordinates
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setLocationAlert(null); // Clear any warnings
                },
                (error) => {
                    // USER CLICKED BLOCK: Show the warning
                    console.warn("Geolocation error:", error.message);
                    setLocationAlert("Location access denied. Showing default results for Colombo. Enable GPS for accurate distances.");
                }
            );
        } else {
            setLocationAlert("Geolocation is not supported by your browser. Showing default results for Colombo.");
        }
    }, []); // Empty array ensures this only runs once when the page loads

    useEffect(() => {
        const fetchShops = async () => {
            setIsLoading(true)
            setError(null)
            
            try {
                let url = `http://localhost:8000/api/search.php?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=15&sort=${sortBy}`
                
                if (activeVehicle) url += `&vehicle_category=${activeVehicle}`
                if (activeService) url += `&shop_category=${activeService}`

                const response = await fetch(url)
                const jsonResponse = await response.json()

                if (!response.ok) {
                    throw new Error(jsonResponse.message || "Failed to fetch shops")
                }

                setShopsList(jsonResponse.data)
                console.log("PHP DATA:", jsonResponse.data);
            } catch (err) {
                setError(err.message)
                setShopsList([]) 
            } finally {
                setIsLoading(false)
            }
        }

        fetchShops()
    }, [activeVehicle, activeService, sortBy, userLocation])

    const hasActiveFilters = activeVehicle !== "" || activeService !== "" || sortBy !== 'distance';

    return (
        <>
            <NavBar />

            <main className="min-h-screen bg-[#f7fbf8]">
                {/* 1. HERO SECTION */}
                <section className="bg-white px-4 py-8 md:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="relative overflow-hidden rounded-2xl border border-[#d1e7d7] bg-[#102818] shadow-xl">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${serviceHero})` }}
                            />
                            <div className="absolute inset-0 bg-linear-to-r from-[#07140d]/95 via-[#14532d]/75 to-[#07140d]/25" />
                            <div className="relative p-8 lg:p-12">
                                <div className="max-w-3xl">
                                    <h1 className="font-mono text-3xl font-bold leading-tight text-white md:text-5xl">
                                        Find the right shop for your vehicle
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. THE FILTER SECTION */}
                <section className="border-b border-[#d1e7d7] bg-[#f7fbf8] px-4 py-4 md:px-8 shadow-sm">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col md:flex-row items-end justify-between gap-4 w-full rounded-2xl border border-[#d1e7d7] bg-white p-5 shadow-sm">
                            
                            <div className="flex w-full flex-1 flex-col">
                                <label className="mb-1 pl-1 font-mono text-[10px] font-bold uppercase tracking-widest text-black/50">
                                    Vehicle Category
                                </label>
                                <select 
                                    value={activeVehicle}
                                    onChange={(e) => setActiveVehicle(e.target.value)}
                                    className={`w-full rounded-xl border px-4 py-3 font-mono text-sm font-bold outline-none transition-colors cursor-pointer
                                        ${activeVehicle !== "" ? 'border-[#16a34a] bg-[#16a34a]/10 text-[#14532d]' : 'border-[#d1e7d7] bg-[#f7fbf8] text-black/80 hover:bg-white'}`}
                                >
                                    <option value="">🚗 All Vehicles</option>
                                    {vehicleFilters.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                                </select>
                            </div>

                            <div className="flex w-full flex-1 flex-col">
                                <label className="mb-1 pl-1 font-mono text-[10px] font-bold uppercase tracking-widest text-black/50">
                                    Service Type
                                </label>
                                <select 
                                    value={activeService}
                                    onChange={(e) => setActiveService(e.target.value)}
                                    className={`w-full rounded-xl border px-4 py-3 font-mono text-sm font-bold outline-none transition-colors cursor-pointer
                                        ${activeService !== "" ? 'border-[#16a34a] bg-[#16a34a]/10 text-[#14532d]' : 'border-[#d1e7d7] bg-[#f7fbf8] text-black/80 hover:bg-white'}`}
                                >
                                    <option value="">🔧 All Services</option>
                                    {serviceFilters.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                                </select>
                            </div>

                            <div className="flex w-full flex-1 flex-col">
                                <label className="mb-1 pl-1 font-mono text-[10px] font-bold uppercase tracking-widest text-black/50">
                                    Sort Results By
                                </label>
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full rounded-xl border border-[#d1e7d7] bg-[#f7fbf8] hover:bg-white px-4 py-3 font-mono text-sm font-bold text-black/80 outline-none cursor-pointer transition-colors"
                                >
                                    <option value="distance">📍 Nearest first</option>
                                    <option value="rating">⭐ Top rated</option>
                                </select>
                            </div>

                            {hasActiveFilters && (
                                <div className="flex shrink-0 items-center justify-center pb-[2px]">
                                    <button 
                                        onClick={() => { setActiveVehicle(""); setActiveService(""); setSortBy('distance'); }}
                                        className="rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200"
                                    >
                                        ✕ Clear filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* 3. MAIN CONTENT SECTION */}
                <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
                    
                    <div className="mb-6">
                        <p className="font-mono text-sm uppercase tracking-widest text-black/70">Shop directory</p>
                        <h2 className="font-mono text-2xl font-bold text-black">Top matches near you</h2>
                    </div>
                    
                    {/* MOVED: Location Warning Banner is now here! */}
                    {/* CHANGED: Added rounded corners (rounded-xl), a full border, and bottom margin (mb-6) so it sits beautifully above the grid */}
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

                    <div className="grid gap-8 lg:grid-cols-2 items-start relative">
                        
                        {/* LEFT COLUMN: Shop List */}
                        <div className="flex flex-col order-last lg:order-first">
                            {isLoading && <div className="py-10 font-mono text-[#16a34a] font-bold">Loading nearby shops...</div>}
                            {error && <div className="py-10 font-mono text-red-500">{error}</div>}

                            <div className="flex flex-col gap-5">
                                {!isLoading && !error && shopsList.map((shop) => (
                                    <article key={shop.id} className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-[#d1e7d7] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                        
                                        <div className="relative h-48 sm:h-auto sm:w-48 shrink-0 bg-[#14532d]">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center opacity-70"
                                                style={{ backgroundImage: `url(${shop.thumbnail_url})` }}
                                            />
                                            {/* Replace your existing badge span with this one */}
                                            <span className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md
                                                ${shop.is_open_now ? 'bg-[#16a34a]' : 'bg-gray-600'}`}>
                                                <FontAwesomeIcon icon={faClock} className="w-3" />
                                                {shop.open_status_text}
                                            </span>
                                        </div>
                                        
                                        <div className="flex flex-col justify-between p-5 w-full">
                                            <div>
                                                {/* CHANGED: Dynamic Rating Block */}
                                                <div className="mb-3 flex items-start justify-between gap-4">
                                                    <h3 className="font-mono text-lg font-bold text-black leading-tight">{shop.name}</h3>
                                                    
                                                    <div className="shrink-0 flex flex-col items-end mt-1">
                                                        {shop.review_count > 0 ? (
                                                            // Renders if the shop has at least 1 review
                                                            <>
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 font-mono text-sm font-bold text-yellow-700 border border-yellow-200 shadow-sm">
                                                                    <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                                                                    {Number(shop.avg_rating).toFixed(1)}
                                                                </span>
                                                                <span className="text-[10px] text-black/50 font-mono mt-1 font-bold uppercase tracking-widest">
                                                                    {shop.review_count} {shop.review_count === 1 ? 'review' : 'reviews'}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            // Renders if the shop is brand new (0 reviews)
                                                            <span className="inline-flex items-center rounded-full bg-[#16a34a]/10 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#14532d] border border-[#16a34a]/20">
                                                                <FontAwesomeIcon icon={faBolt} className="w-3 text-yellow-500" />
                                                                New Shop
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* CHANGED: Completely redesigned Address and Distance block */}
                                                <div className="flex flex-col gap-2 mb-4 font-mono text-sm">
                                                    {/* Row 1: Address */}
                                                    <div className="flex items-start gap-2 text-black/70">
                                                        <FontAwesomeIcon icon={faLocationDot} className="mt-[2px] w-4 shrink-0 opacity-70" />
                                                        <span className="leading-tight">{shop.location_text}</span>
                                                    </div>
                                                    
                                                    {/* Row 2: Distance */}
                                                    <div className="flex items-center gap-2 text-[#16a34a] font-bold">
                                                        <FontAwesomeIcon icon={faRoute} className="w-4 shrink-0" />
                                                        <span>{shop.distance_km} km away</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {shop.tags.map((tag) => (
                                                        <span key={tag} className="rounded-full bg-[#f7fbf8] px-2 py-1 font-mono text-[10px] uppercase font-bold text-[#274c3a] border border-[#d1e7d7]">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <button
                                                className="mt-auto w-full rounded-xl border border-[#16a34a] px-4 py-2 font-mono text-sm font-bold text-[#16a34a] transition hover:bg-[#16a34a] hover:text-white active:scale-95"
                                                onClick={() => setSelectedShop(shop)}
                                                type="button"
                                            >
                                                VIEW DETAILS
                                            </button>
                                        </div>
                                    </article>
                                ))}
                                {!isLoading && shopsList.length === 0 && (
                                    <div className="py-10 font-mono text-black/50">No shops match your exact filters. Try clearing them.</div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: The Interactive Google Map */}
                        {/* CHANGED: Replaced the gray placeholder with the actual GoogleMap component */}
                        <div className="order-first lg:order-last w-full h-[400px] lg:h-[calc(100vh-4rem)] lg:sticky lg:top-8 rounded-2xl border border-[#d1e7d7] bg-[#e5e9ea] shadow-xl overflow-hidden relative">
                            {loadError && <div className="p-8 font-mono text-red-500">Error loading maps API</div>}
                            {!isLoaded && <div className="p-8 font-mono text-[#16a34a]">Loading Map Engine...</div>}
                            
                            {isLoaded && (
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={userLocation}
                                    zoom={12}
                                    options={{
                                        disableDefaultUI: false,
                                        zoomControl: true,
                                        mapTypeControl: false,
                                        streetViewControl: false,
                                    }}
                                >
                                    {/* 1. The Blue User Marker */}
                                    <Marker 
                                        position={userLocation}
                                        icon={{
                                            // CHANGED: This URL points to the classic teardrop pin, but in blue!
                                            url: "https://mt.google.com/vt/icon/name=icons/spotlight/spotlight-waypoint-blue.png" 
                                        }}
                                        title="Your Current Location"
                                        // ADDED: Makes the blue pin drop from the sky on load just like the red ones
                                        animation={2} 
                                    />

                                    {/* 2. The Dynamic Red Shop Markers (CLEAN & PROFESSIONAL) */}
                                    {shopsList.map((shop) => {
                                        const pinLat = parseFloat(shop.latitude || shop.lat);
                                        const pinLng = parseFloat(shop.longitude || shop.lng);

                                        if (isNaN(pinLat) || isNaN(pinLng)) return null;

                                        return (
                                            <Marker
                                                key={shop.id}
                                                position={{ lat: pinLat, lng: pinLng }}
                                                
                                                // CHANGED: Removed the bulky 'label' prop. 
                                                // 'title' provides a clean hover tooltip!
                                                title={shop.name} 
                                                
                                                // ADDED: Makes the pins drop from the sky on load (2 is the Google Maps constant for DROP)
                                                animation={2} 
                                                
                                                onClick={() => setActiveMarker(shop)} 
                                            />
                                        );
                                    })}

                                    {/* 3. The Interactive Info Bubble (Popping up on Click) */}
                                    {activeMarker && (
                                        <InfoWindow
                                            position={{ lat: parseFloat(activeMarker.latitude || activeMarker.lat), lng: parseFloat(activeMarker.longitude || activeMarker.lng) }}
                                            onCloseClick={() => setActiveMarker(null)}
                                        >
                                            {/* CHANGED: Styled the popup bubble to look like a mini-card */}
                                            <div className="p-2 font-mono max-w-[200px]">
                                                <p className="text-[10px] font-bold text-[#16a34a] uppercase tracking-widest">{activeMarker.open_status_text}</p>
                                                <p className="font-bold text-base text-black leading-tight mt-1 mb-2">{activeMarker.name}</p>
                                                <p className="text-xs text-black/70 flex items-start gap-1">
                                                    <FontAwesomeIcon icon={faLocationDot} className="mt-[2px] text-[#16a34a]" />
                                                    {activeMarker.location_text}
                                                </p>
                                            </div>
                                        </InfoWindow>
                                    )}
                                </GoogleMap>
                            )}
                        </div>

                    </div>
                </section>
            </main>

            {/* Modal Overlay Component */}
            {selectedShop && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm" onClick={() => setSelectedShop(null)}>
                    <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="relative overflow-hidden rounded-t-2xl bg-[#14532d] p-6 text-white md:p-8">
                            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${selectedShop.thumbnail_url})` }}/>
                            <div className="absolute inset-0 bg-[#14532d]/80" />
                            <button className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25" onClick={() => setSelectedShop(null)}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                            <div className="relative pr-12">
                                <h2 className="mt-2 font-mono text-3xl font-bold">{selectedShop.name}</h2>
                            </div>
                        </div>
                        <div className="p-6 md:p-8">
                            <p className="text-black text-center font-mono py-10 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                                Detailed Booking UI goes here.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    )
}

export default Shops