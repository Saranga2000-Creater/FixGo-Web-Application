import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBicycle, faSearch, faCar, faTruck, faWarehouse, faLocationDot, faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";

export const QuickSearchHub = ({ onRequireAuth }) => {
    const navigate = useNavigate();

    // 1. Core UI State
    const [homeVehicle, setHomeVehicle] = useState("");
    const [homeService, setHomeService] = useState("");
    const [homeCity, setHomeCity] = useState("Current Location");

    // 2. Custom Autocomplete State (Replacing the React Library)
    const [predictions, setPredictions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null); 
    
    // Reference to detect clicks outside the dropdown menu
    const dropdownRef = useRef(null);

    // Close dropdown automatically if the user clicks anywhere else on the screen
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- NEW: THE RAW JAVASCRIPT FETCH LOGIC ---

    // Function A: Ask Google for City Suggestions as the user types
    const handleTyping = async (text) => {
        setHomeCity(text);
        setSelectedLocation(null); // Clear previous math if they type a new city

        // Don't waste API calls on 1 or 2 letters
        if (text.length < 3) {
            setPredictions([]);
            setShowDropdown(false);
            return;
        }

        try {
            // Talk directly to the Places API (New) Endpoint
            const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                },
                body: JSON.stringify({
                    input: text,
                    includedRegionCodes: ["lk"] // Restricts results to Sri Lanka
                })
            });
            
            const data = await response.json();
            
            // If Google finds matches, show the custom dropdown
            if (data.suggestions) {
                setPredictions(data.suggestions);
                setShowDropdown(true);
            } else {
                setPredictions([]);
            }
        } catch (error) {
            console.error("Error fetching API predictions:", error);
        }
    };

    // Function B: When the user clicks a suggestion, get the exact Lat/Lng
    const handleSelectPlace = async (placeId, description) => {
        // Update the text box and hide the menu
        setHomeCity(description);
        setShowDropdown(false);
        setPredictions([]);

        try {
            // Fetch the exact coordinates for the selected place ID
            const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?fields=location`, {
                headers: {
                    'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                }
            });
            const data = await response.json();
            
            // Save the exact math to send to your backend
            if (data.location) {
                setSelectedLocation({
                    lat: data.location.latitude,
                    lng: data.location.longitude
                });
            }
        } catch (error) {
            console.error("Error fetching location coordinates:", error);
        }
    };
    // --- END NEW LOGIC ---

    // 4. The Routing Logic
    const handleSearchClick = () => {
        const isUserLoggedIn = true; // Temporary mock auth
        
        if (!isUserLoggedIn) {
            onRequireAuth(); 
            return; 
        }

        const params = new URLSearchParams();
        if (homeVehicle) params.append('vehicle', homeVehicle);
        if (homeService) params.append('service', homeService);

        // Attach exact coordinates if our API successfully fetched them
        if (selectedLocation) {
            params.append('lat', selectedLocation.lat);
            params.append('lng', selectedLocation.lng);
        }

        if (homeCity && homeCity !== "Current Location") {
            params.append('city', homeCity.trim());
        }
        
        navigate(`/shops?${params.toString()}`);
    }

    return (
        <section className="relative -mt-16 z-20 px-4 md:px-8 max-w-5xl mx-auto mb-20">
        {/* FIX: Removed 'overflow-hidden' from the line below so the dropdown can overlay outside the card */}
        <div className="bg-white border border-[#d1e7d7] rounded-2xl shadow-[0_8px_30px_rgb(22,163,74,0.08)] transition-shadow hover:shadow-[0_12px_40px_rgb(22,163,74,0.12)]">
            <div className="p-5 md:p-7">
                
                <h2 className="font-mono text-xl mb-5 flex items-center gap-3 text-[#14532d] font-bold">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#16a34a]/10 border border-[#16a34a]/20">
                        <FontAwesomeIcon icon={faSearch} className="text-[#16a34a] text-sm" />
                    </span>
                    Quick Search
                </h2>

                    <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-x-6 gap-y-4 mb-5 pb-5 border-b border-[#d1e7d7]/60">
                        {/* Vehicle Category */}
                        <div>
                            <p className="font-mono text-[11px] text-[#274c3a] uppercase font-bold tracking-widest mb-2">Vehicle Category</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button onClick={() => setHomeVehicle("1")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border rounded-xl transition-all ${homeVehicle === "1" ? 'border-[#16a34a] bg-[#16a34a]/10 text-[#16a34a]' : 'border-[#d1e7d7] hover:border-[#16a34a] hover:bg-[#16a34a]/5 text-[#274c3a]'}`}>
                                    <FontAwesomeIcon icon={faBicycle} className="text-lg" />
                                    <span className="font-mono text-sm font-bold whitespace-nowrap">3-Wheelers &amp; Bikes</span>
                                </button>
                                <button onClick={() => setHomeVehicle("2")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border rounded-xl transition-all ${homeVehicle === "2" ? 'border-[#16a34a] bg-[#16a34a]/10 text-[#16a34a]' : 'border-[#d1e7d7] hover:border-[#16a34a] hover:bg-[#16a34a]/5 text-[#274c3a]'}`}>
                                    <FontAwesomeIcon icon={faCar} className="text-lg" />
                                    <span className="font-mono text-sm font-bold whitespace-nowrap">4-Wheelers</span>
                                </button>
                                <button onClick={() => setHomeVehicle("3")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border rounded-xl transition-all ${homeVehicle === "3" ? 'border-[#16a34a] bg-[#16a34a]/10 text-[#16a34a]' : 'border-[#d1e7d7] hover:border-[#16a34a] hover:bg-[#16a34a]/5 text-[#274c3a]'}`}>
                                    <FontAwesomeIcon icon={faTruck} className="text-lg" />
                                    <span className="font-mono text-sm font-bold whitespace-nowrap">Commercial</span>
                                </button>
                            </div>
                        </div>

                        {/* Service Type */}
                        <div>
                            <p className="font-mono text-[11px] text-[#274c3a] uppercase font-bold tracking-widest mb-2">Service Type</p>
                            <div className="relative w-full">
                                <select value={homeService} onChange={(e) => setHomeService(e.target.value)} className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-[#d1e7d7] bg-[#f8f4f0] font-mono text-sm cursor-pointer outline-none focus:border-[#16a34a] transition-colors">
                                    <option value="">All Services</option>
                                    <option value="1">Garages</option>
                                    <option value="2">Service Centers</option>
                                    <option value="3">Spare Parts</option>
                                </select>
                                <FontAwesomeIcon icon={faWarehouse} className="text-sm text-[#274c3a] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 items-stretch">
                        
                        {/* THE CUSTOM LOCATION INPUT & DROPDOWN */}
                        <div className="relative grow w-full flex items-center" ref={dropdownRef}>
                            <FontAwesomeIcon icon={homeCity === "Current Location" ? faLocationCrosshairs : faLocationDot} className={`absolute left-4 pointer-events-none z-20 text-sm transition-colors ${homeCity === "Current Location" ? 'text-[#16a34a]' : 'text-[#14532d]/50'}`} />
                            
                            <input 
                                value={homeCity}
                                onChange={(e) => handleTyping(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                                onFocus={() => { if (homeCity === "Current Location") setHomeCity(""); }}
                                onBlur={() => { if (homeCity.trim() === "") setHomeCity("Current Location"); }}
                                className={`w-full h-full pl-10 pr-4 py-3 rounded-xl border outline-none font-body-md transition-all text-sm ${homeCity === "Current Location" ? 'bg-[#16a34a]/5 border-[#16a34a]/30 text-[#16a34a] font-bold' : 'bg-[#f8f4f0] border-[#d1e7d7] text-black focus:border-[#16a34a]'}`}
                                placeholder="Enter a city in Western Province..." 
                                type="text" 
                            />

                            {/* THE TAILWIND DROPDOWN MENU */}
                            {showDropdown && predictions.length > 0 && (
                                <ul className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#d1e7d7] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto font-mono text-sm">
                                    {predictions.map((pred) => (
                                        <li 
                                            key={pred.placePrediction.placeId} 
                                            onClick={() => handleSelectPlace(pred.placePrediction.placeId, pred.placePrediction.text.text)}
                                            className="px-4 py-3 hover:bg-[#16a34a]/10 cursor-pointer border-b border-[#d1e7d7]/50 last:border-0 text-black/80 flex items-center gap-2"
                                        >
                                            <FontAwesomeIcon icon={faLocationDot} className="text-[#16a34a]/50 w-3 shrink-0" />
                                            {pred.placePrediction.text.text}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button onClick={handleSearchClick} className="w-full md:w-auto shrink-0 bg-[#16a34a] text-white font-mono text-sm font-bold px-8 py-3 rounded-xl hover:bg-[#16a34a]/80 transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2">
                            <FontAwesomeIcon icon={faSearch} />
                            SEARCH NOW
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};