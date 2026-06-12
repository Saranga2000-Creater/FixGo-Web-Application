import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faLocationDot,
    faLocationCrosshairs,
    faMapLocationDot
} from "@fortawesome/free-solid-svg-icons";

const vehicleFilters = [
    { id: 1, label: "3-Wheelers and Bikes" },
    { id: 2, label: "4-Wheelers" },
    { id: 3, label: "Commercial Vehicles" },
];

const serviceFilters = [
    { id: 1, label: "Garages" },
    { id: 2, label: "Service Centers" },
    { id: 3, label: "Spare Parts" },
];

export const ShopFilterBar = ({
    initialLocationText,
    onLocationChange, // Function to pass coordinates back to Shops.jsx
    searchName,
    setSearchName,
    activeVehicle,
    setActiveVehicle,
    activeService,
    setActiveService,
    sortBy,
    setSortBy
}) => {
    // UI State
    const [activeTab, setActiveTab] = useState('explore');
    const [locationInputText, setLocationInputText] = useState(initialLocationText || "Current Location");
    
    // Google Autocomplete State
    const [predictions, setPredictions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Sync input box if parent changes the location (e.g., GPS loads)
    useEffect(() => {
        if (initialLocationText) setLocationInputText(initialLocationText);
    }, [initialLocationText]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Google API Call (Debounced)
    const handleLocationTyping = (text) => {
        setLocationInputText(text);

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        if (text.length < 3 || text === "Current Location") {
            setPredictions([]);
            setShowDropdown(false);
            return;
        }

        typingTimeoutRef.current = setTimeout(async () => {
            try {
                const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                    },
                    body: JSON.stringify({ input: text, includedRegionCodes: ["lk"] })
                });
                const data = await response.json();
                
                if (data.suggestions) {
                    setPredictions(data.suggestions);
                    setShowDropdown(true);
                }
            } catch (error) {
                console.error("Error fetching API predictions:", error);
            }
        }, 500);
    };

    // Handle user selecting a city from the dropdown
    const handleSelectPlace = async (placeId, description) => {
        setLocationInputText(description);
        setShowDropdown(false);
        setPredictions([]);

        try {
            const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?fields=location`, {
                headers: { 'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_MAPS_API_KEY }
            });
            const data = await response.json();
            
            if (data.location) {
                // Pass the new coordinates back to the parent component!
                onLocationChange(data.location.latitude, data.location.longitude, description);
            }
        } catch (error) {
            console.error("Error fetching location coordinates:", error);
        }
    };

    const hasActiveFilters = activeVehicle !== "" || activeService !== "" || sortBy !== 'distance';

    return (
        
                <div className="flex flex-col w-full rounded-2xl border border-[#d1e7d7] bg-white p-5 shadow-xl min-h-[180px]">
                    
                    {/* THE TAB BAR */}
                    <div className="flex justify-center gap-2 mb-6 border-b border-[#d1e7d7]/50 pb-4">
                        <button onClick={() => { setActiveTab('explore'); setSearchName(""); }} className={`px-6 py-2.5 rounded-full font-mono text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'explore' ? 'bg-[#16a34a] text-white shadow-sm' : 'bg-transparent text-black/50 hover:bg-[#16a34a]/10 hover:text-[#14532d]'}`}>
                            <FontAwesomeIcon icon={faMapLocationDot} /> Explore Nearby
                        </button>
                        <button onClick={() => { setActiveTab('specific'); setActiveVehicle(""); setActiveService(""); }} className={`px-6 py-2.5 rounded-full font-mono text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'specific' ? 'bg-[#16a34a] text-white shadow-sm' : 'bg-transparent text-black/50 hover:bg-[#16a34a]/10 hover:text-[#14532d]'}`}>
                            <FontAwesomeIcon icon={faSearch} /> Find Specific Shop
                        </button>
                    </div>

                    {/* STATE 1: EXPLORE NEARBY */}
                    {activeTab === 'explore' && (
                        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                            {/* Unified Location Box */}
                            <div className="relative w-full" ref={dropdownRef}>
                                <FontAwesomeIcon icon={locationInputText === "Current Location" ? faLocationCrosshairs : faLocationDot} className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-20 text-sm transition-colors ${locationInputText === "Current Location" ? 'text-[#16a34a]' : 'text-black/40'}`} />
                                <input 
                                    type="text" value={locationInputText} onChange={(e) => handleLocationTyping(e.target.value)}
                                    onFocus={() => { if (locationInputText === "Current Location") setLocationInputText(""); }}
                                    onBlur={() => { 
                                        if (locationInputText.trim() === "") {
                                            setLocationInputText("Current Location");
                                            if ("geolocation" in navigator) {
                                                navigator.geolocation.getCurrentPosition((pos) => {
                                                    onLocationChange(pos.coords.latitude, pos.coords.longitude, "Current Location");
                                                });
                                            }
                                        } 
                                    }}
                                    placeholder="City or Area..." 
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none font-mono text-sm transition-all ${locationInputText === "Current Location" ? 'bg-[#16a34a]/5 border-[#16a34a]/30 text-[#16a34a] font-bold' : 'bg-[#f8f4f0] border-[#d1e7d7] text-black focus:border-[#16a34a] focus:bg-white'}`}
                                />
                                {/* Dropdown Menu */}
                                {showDropdown && predictions.length > 0 && (
                                    <ul className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#d1e7d7] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto font-mono text-sm">
                                        {predictions.map((pred) => (
                                            <li key={pred.placePrediction.placeId} onClick={() => handleSelectPlace(pred.placePrediction.placeId, pred.placePrediction.text.text)} className="px-4 py-3 hover:bg-[#16a34a]/10 cursor-pointer border-b border-[#d1e7d7]/50 last:border-0 text-black/80 flex items-center gap-2">
                                                <FontAwesomeIcon icon={faLocationDot} className="text-[#16a34a]/50 w-3 shrink-0" /> {pred.placePrediction.text.text}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="h-px w-full bg-[#d1e7d7]/60 my-1"></div>

                            {/* Filters */}
                            <div className="flex flex-col md:flex-row items-end justify-between gap-4">
                                <div className="flex w-full flex-1 flex-col">
                                    <label className="mb-1 pl-1 font-mono text-[10px] font-bold uppercase tracking-widest text-black/50">Vehicle Category</label>
                                    <select value={activeVehicle} onChange={(e) => setActiveVehicle(e.target.value)} className={`w-full rounded-xl border px-4 py-3 font-mono text-sm font-bold outline-none transition-colors cursor-pointer ${activeVehicle !== "" ? 'border-[#16a34a] bg-[#16a34a]/10 text-[#14532d]' : 'border-[#d1e7d7] bg-[#f8f4f0] text-black/80 hover:bg-white'}`}>
                                        <option value="">🚗 All Vehicles</option>
                                        {vehicleFilters.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                                    </select>
                                </div>
                                <div className="flex w-full flex-1 flex-col">
                                    <label className="mb-1 pl-1 font-mono text-[10px] font-bold uppercase tracking-widest text-black/50">Service Type</label>
                                    <select value={activeService} onChange={(e) => setActiveService(e.target.value)} className={`w-full rounded-xl border px-4 py-3 font-mono text-sm font-bold outline-none transition-colors cursor-pointer ${activeService !== "" ? 'border-[#16a34a] bg-[#16a34a]/10 text-[#14532d]' : 'border-[#d1e7d7] bg-[#f8f4f0] text-black/80 hover:bg-white'}`}>
                                        <option value="">🔧 All Services</option>
                                        {serviceFilters.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                                    </select>
                                </div>
                                <div className="flex w-full flex-1 flex-col">
                                    <label className="mb-1 pl-1 font-mono text-[10px] font-bold uppercase tracking-widest text-black/50">Sort Results By</label>
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full rounded-xl border border-[#d1e7d7] bg-[#f8f4f0] hover:bg-white px-4 py-3 font-mono text-sm font-bold text-black/80 outline-none cursor-pointer transition-colors">
                                        <option value="distance">📍 Nearest first</option>
                                        <option value="rating">⭐ Top rated</option>
                                    </select>
                                </div>
                                {hasActiveFilters && (
                                    <div className="flex shrink-0 items-center justify-center pb-[2px]">
                                        <button onClick={() => { setActiveVehicle(""); setActiveService(""); setSortBy('distance'); }} className="rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200">
                                            ✕ Clear filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STATE 2: FIND SPECIFIC SHOP */}
                    {activeTab === 'specific' && (
                        <div className="flex flex-col gap-3 animate-in fade-in duration-300 h-full justify-center pb-4">
                            <div className="relative w-full">
                                <FontAwesomeIcon icon={faSearch} className="absolute left-5 top-1/2 -translate-y-1/2 text-black/40 text-lg" />
                                <input 
                                    type="text" value={searchName} onChange={(e) => setSearchName(e.target.value)}
                                    placeholder="Enter the name of the shop..." 
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-[#d1e7d7] bg-[#f8f4f0] focus:bg-white font-mono text-base font-bold outline-none focus:border-[#16a34a] transition-all shadow-inner"
                                    autoFocus
                                />
                            </div>
                            <p className="font-mono text-xs font-bold uppercase tracking-widest text-black/40 pl-2">
                                Tip: We'll automatically show you the closest matching branches first.
                            </p>
                        </div>
                    )}

                </div>
            
    );
};