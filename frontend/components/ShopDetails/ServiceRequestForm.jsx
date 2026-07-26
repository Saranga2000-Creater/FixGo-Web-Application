import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimes, faTruckPickup, faCar, faInfoCircle, faCamera,
    faCheckCircle, faExclamationTriangle, faClock, faChevronLeft,
    faCopy, faStar, faMapMarkerAlt, faBolt, faMotorcycle, faTruck,
    faCogs, faBatteryFull, faLifeRing, faWrench, faQuestionCircle,
    faPaperPlane, faShieldAlt, faLock, faCheck
} from "@fortawesome/free-solid-svg-icons";
import { api } from "../../src/services/api";


export const ServiceRequestModal = ({ isOpen, onClose, shop, distance, initialNeedsTow = false, onTrackRequest }) => {
    // NEW: Wizard Step State (1: Form, 2: Review, 3: Success)
    const [step, setStep] = useState(1);

    // Form State
    const [brand, setBrand] = useState('');
    const [color, setColor] = useState('');
    const [description, setDescription] = useState('');
    const [requiresTow, setRequiresTow] = useState(initialNeedsTow);
    const [imageFile, setImageFile] = useState(null);
    const [vehicleCategory, setVehicleCategory] = useState(2);

    // NEW: Premium Data States matching our DB upgrades
    const [issueCategory, setIssueCategory] = useState('');
    const [pickupLandmark, setPickupLandmark] = useState('');
    const [urgencyLevel, setUrgencyLevel] = useState('Normal');
    const [preferredDate, setPreferredDate] = useState('');
    const [preferredTime, setPreferredTime] = useState('');
    const [lat, setLat] = useState(6.9061); // Default to Malabe for now
    const [lng, setLng] = useState(79.9696);
    const [locationStatus, setLocationStatus] = useState(''); // To show "Locating..." or "Acquired"

    // NEW: Review Checkboxes
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Submission State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [referenceId, setReferenceId] = useState(''); // NEW: To store the formatted ID

    // Reset the form
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setRequiresTow(initialNeedsTow);
            setBrand('');
            setColor('');
            setDescription('');
            setImageFile(null);
            setIssueCategory('');
            setPickupLandmark('');
            setUrgencyLevel('Normal');
            setAgreedToTerms(false);
            setError('');
            setReferenceId('');
            setPreferredDate('');
            setPreferredTime('');
        }
    }, [isOpen, initialNeedsTow]);

    // NEW FIX: Force modal to scroll to top whenever it is opened or the step changes
    useEffect(() => {
        if (isOpen) {
            const modalScrollContainer = document.getElementById("modal-scroll-container");
            if (modalScrollContainer) {
                modalScrollContainer.scrollTop = 0;
            }
        }
    }, [isOpen, step]);

    if (!isOpen || !shop) return null;

    // Helper: Convert Image
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };

    // Helper: Format the ID for the success screen
    const formatReferenceId = (rawId) => {
        const year = new Date().getFullYear();
        const paddedId = String(rawId).padStart(5, '0');
        return `REQ-${year}-${paddedId}`;
    };

    // NEW: Handle moving to Review step
    const handleProceedToReview = (e) => {
        e.preventDefault();
        setStep(2);
    };

    // Handle Final Submit
    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem("jwt_token");
            if (!token) {
                setError("Please log in again.");
                setIsSubmitting(false);
                return;
            }
            let base64Image = null;
            if (imageFile) {
                base64Image = await convertToBase64(imageFile);
            }

            const requestData = {
                shop_id: shop.info.id,
                vehicle_category_id: vehicleCategory,
                vehicle_brand: brand,
                vehicle_color: color,
                description: description,
                requires_tow: requiresTow,
                problem_image: base64Image,
                lat: lat,
                lng: lng,
                urgency_level: shop.shopCategories?.includes('Garages') ? urgencyLevel : null,
                preferred_date: !shop.shopCategories?.includes('Garages') ? preferredDate : null,
                preferred_time: !shop.shopCategories?.includes('Garages') ? preferredTime : null,
                issue_category: issueCategory,
                pickup_landmark: requiresTow ? pickupLandmark : null
            };

            const data = await api.post('createServiceRequest.php', requestData);
            setReferenceId(formatReferenceId(data.request_id));
            setStep(3);

        } catch (err) {
            setError(err.message);
            setStep(1);
        } finally {
            setIsSubmitting(false);
        }
    };


    // --- SUB-COMPONENTS FOR CLEANER CODE ---
    // 1. The Sticky Top Navigation (Does NOT scroll)
    const renderStickyTopBar = () => (
        <div className="px-5 py-4 border-b border-slate-100 bg-white flex items-center justify-between shrink-0 z-10">
            {/* Left: Static Title */}
            <h2 className="text-[19px] font-extrabold text-[#14532d]">Request Service</h2>

            {/* Center: Progress Tracker */}
            <div className="flex items-center gap-3">
                {/* Step 1 Indicator */}
                <div className="flex items-center gap-2">
                    {step === 1 ? (
                        <div className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[10px] font-bold">1</div>
                    ) : (
                        <div className="w-5 h-5 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center text-[10px]">
                            <FontAwesomeIcon icon={faCheck} />
                        </div>
                    )}
                    <span className="text-xs font-bold text-slate-500">Service Details</span>
                </div>

                <div className="w-8 h-[1px] bg-slate-200 hidden sm:block"></div>

                {/* Step 2 Indicator */}
                <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 2 ? 'bg-[#16a34a] text-white' : 'bg-[#f3f4f6] text-slate-400'}`}>2</div>
                    <span className={`text-xs ${step === 2 ? 'font-bold text-[#16a34a]' : 'font-medium text-slate-400'}`}>Review & Submit</span>
                </div>
            </div>

            {/* Right: Close Button */}
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
        </div>
    );

    // 2. The Shop Info Card (DOES scroll)
    const renderShopInfoCard = () => (
        <div className="p-4 sm:p-6 pb-0">
            {/* Shows only on Step 2 */}
            {step === 2 && (
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-[#1f2937]">Review your request</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Please review the details below before sending your request.</p>
                </div>
            )}

            {/* DYNAMIC SHOP INFO CARD - Refined Proportions */}
            <div className="border border-slate-100 rounded-xl p-4 flex items-center gap-5 sm:gap-6 bg-white shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#f3f4f6] flex flex-col items-center justify-center flex-shrink-0 border border-slate-200">
                    <FontAwesomeIcon icon={faCar} className="text-2xl text-slate-400 mb-0.5" />
                </div>
                <div className="flex flex-col justify-center gap-1.5">
                    <h3 className="text-[17px] font-extrabold text-[#1f2937] leading-tight">{shop?.info?.name || 'Service Center'}</h3>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[13px] text-slate-500 mt-0.5">
                        <div className="flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faStar} className="text-[#f59e0b]" />
                            <span className="font-bold text-slate-700">{shop?.stats?.averageRating || 'New'}</span>
                            {shop?.stats?.reviewCount > 0 && <span>({shop.stats.reviewCount} reviews)</span>}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-slate-400" />
                            <span>{distance + ' km away' || 'Distance unknown'}</span>
                        </div>
                        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-[12px] font-bold tracking-wide ${(shop?.info?.is_open_now ?? shop?.info?.isAvailable) ? 'border-[#16a34a]/20 bg-[#ecfdf5] text-[#059669]' : 'border-red-500/20 bg-red-50 text-red-600'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${(shop?.info?.is_open_now ?? shop?.info?.isAvailable) ? 'bg-[#059669]' : 'bg-red-600'}`}></div>
                            {shop?.info?.open_status_text || (shop?.info?.isAvailable ? 'Open Now' : 'Closed')}
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] text-slate-500 font-medium mt-1">
                        <FontAwesomeIcon icon={faBolt} className="text-slate-400" />
                        <span>Average response time: {shop?.info?.response_time_minutes || shop?.responseTime || 15} minutes</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const handleTowSelection = () => {
        setRequiresTow(true);
        setLocationStatus('Acquiring GPS...');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLat(position.coords.latitude);
                    setLng(position.coords.longitude);
                    setLocationStatus('GPS Locked ✓');
                },
                (error) => {
                    setLocationStatus('GPS unavailable - Please enter landmark below');
                },
                { enableHighAccuracy: true, timeout: 5000 }
            );
        } else {
            setLocationStatus('GPS not supported by browser');
        }
    };

    const renderStep1Form = () => (
        <form onSubmit={handleProceedToReview} className="space-y-6 pb-2">

            {/* 1. Vehicle Type */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[11px] font-bold">1</div>
                    <h3 className="font-bold text-[#1f2937] text-[13px]">Vehicle Type</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 1, label: "2/3 Wheeler", icon: faMotorcycle },
                        { id: 2, label: "4 Wheeler", icon: faCar },
                        { id: 3, label: "Commercial", icon: faTruck }
                    ].map((type) => (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => setVehicleCategory(type.id)}
                            className={`py-3 px-2 flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 ${vehicleCategory === type.id
                                    ? 'border-[#16a34a] bg-[#f0fdf4] shadow-sm'
                                    : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <FontAwesomeIcon icon={type.icon} className={`text-2xl mb-2 ${vehicleCategory === type.id ? 'text-[#16a34a]' : 'text-gray-400'}`} />
                            <span className={`text-[11px] font-bold text-center leading-tight ${vehicleCategory === type.id ? 'text-[#14532d]' : 'text-gray-500'}`}>
                                {type.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* CONDITIONAL GARAGE BLOCK: 1a. Tow Truck Options */}
            {shop.shopCategories?.includes('Garages') && shop.info?.carriageService == 1 && (
                <div className="animate-in fade-in duration-300">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[10px] font-bold">1a</div>
                        <h3 className="font-bold text-[#1f2937] text-[13px]">Is your vehicle drivable?</h3>
                    </div>

                    {/* The Two Choice Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        {/* Option 1: Drivable */}
                        <button
                            type="button"
                            onClick={() => setRequiresTow(false)}
                            className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${!requiresTow ? 'border-[#16a34a] bg-[#f0fdf4] shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                        >
                            <FontAwesomeIcon icon={faCar} className={`text-lg ${!requiresTow ? 'text-[#16a34a]' : 'text-gray-400'}`} />
                            <div className="flex-1">
                                <span className={`block text-[12px] font-bold ${!requiresTow ? 'text-[#14532d]' : 'text-gray-600'}`}>Yes, I can bring it to the garage</span>
                            </div>
                            {/* Custom Radio Button Circle */}
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!requiresTow ? 'border-[#16a34a]' : 'border-gray-300'}`}>
                                {!requiresTow && <div className="w-2 h-2 rounded-full bg-[#16a34a]"></div>}
                            </div>
                        </button>

                        {/* Option 2: Needs Tow */}
                        <button
                            type="button"
                            onClick={handleTowSelection}
                            className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${requiresTow ? 'border-[#16a34a] bg-[#f0fdf4] shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                        >
                            <FontAwesomeIcon icon={faTruckPickup} className={`text-lg ${requiresTow ? 'text-[#16a34a]' : 'text-gray-400'}`} />
                            <div className="flex-1">
                                <span className={`block text-[12px] font-bold ${requiresTow ? 'text-[#14532d]' : 'text-gray-600'}`}>No, I need roadside assistance / towing</span>
                            </div>
                            {/* Custom Radio Button Circle */}
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${requiresTow ? 'border-[#16a34a]' : 'border-gray-300'}`}>
                                {requiresTow && <div className="w-2 h-2 rounded-full bg-[#16a34a]"></div>}
                            </div>
                        </button>
                    </div>

                    {/* Expanded Towing Details Box */}
                    {requiresTow && (
                        <div className="animate-in slide-in-from-top-2 duration-200 p-4 rounded-xl border border-[#16a34a]/30 bg-[#f0fdf4]/50 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-[#14532d]">Tow Truck Required</span>
                                <span className="text-[10px] bg-[#16a34a] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mb-1.5">
                                    <label className="block text-[11px] font-bold text-[#14532d]">Additional Landmark (Optional)</label>
                                    {locationStatus && <span className="text-[9px] font-mono font-bold text-[#16a34a] bg-[#16a34a]/10 px-2 py-0.5 rounded">{locationStatus}</span>}
                                </div>
                                <div className="relative w-full">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                    <input
                                        type="text"
                                        value={pickupLandmark}
                                        onChange={(e) => setPickupLandmark(e.target.value)}
                                        placeholder="Type landmark or directions..."
                                        className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-[#16a34a]/30 bg-white outline-none focus:border-[#16a34a] text-sm transition-colors"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 mt-2">
                                    Dispatching {shop.default_truck_brand} <span className="font-mono">({shop.tow_truck_plate})</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 2. Vehicle Details */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[11px] font-bold">2</div>
                    <h3 className="font-bold text-[#1f2937] text-[13px]">Vehicle Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] text-gray-500 mb-1.5">Vehicle Brand</label>
                        <input type="text" required value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Toyota" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-[#16a34a] outline-none transition-colors text-sm" />
                    </div>
                    <div>
                        <label className="block text-[11px] text-gray-500 mb-1.5">Vehicle Color</label>
                        <input type="text" required value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Silver" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-[#16a34a] outline-none transition-colors text-sm" />
                    </div>
                </div>
            </div>

            {/* 3. Issue Chips */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[11px] font-bold">3</div>
                    <h3 className="font-bold text-[#1f2937] text-[13px]">What do you need help with?</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {[
                        { name: 'Engine', icon: faCogs },
                        { name: 'Battery', icon: faBatteryFull },
                        { name: 'Tire', icon: faLifeRing },
                        { name: 'Brakes', icon: faWrench },
                        { name: 'General Service', icon: faWrench },
                        { name: 'Other', icon: faQuestionCircle }
                    ].map(issue => (
                        <button
                            key={issue.name}
                            type="button"
                            onClick={() => setIssueCategory(issue.name)}
                            className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-[12px] font-bold transition-all duration-200 ${issueCategory === issue.name
                                    ? 'bg-[#f0fdf4] text-[#16a34a] border-[#16a34a] shadow-sm'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <FontAwesomeIcon icon={issue.icon} className={issueCategory === issue.name ? 'text-[#16a34a]' : 'text-gray-400'} />
                            {issue.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. Description */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[11px] font-bold">4</div>
                    <h3 className="font-bold text-[#1f2937] text-[13px]">Describe the issue</h3>
                </div>
                <div className="relative">
                    <textarea
                        required
                        maxLength={500}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What seems to be the problem? e.g. Engine stalled, flat tire..."
                        rows="3"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#16a34a] outline-none transition-colors text-sm resize-none pb-8"
                    ></textarea>
                    <div className="absolute bottom-3 right-3 text-[10px] font-mono text-gray-400">{description.length}/500</div>
                </div>
            </div>

            {/* 5. Photo Upload */}
            {(shop.shopCategories?.length > 0) && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[11px] font-bold">5</div>
                        <h3 className="font-bold text-[#1f2937] text-[13px]">Attach a Photo (Optional)</h3>
                    </div>

                    {imageFile ? (
                        /* STATE 1: IMAGE UPLOADED (Centered on a Full-Width Stage) */
                        <div className="w-full py-6 flex justify-center items-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 animate-in fade-in duration-200">

                            <div className="relative inline-block group">

                                {/* The Image Container */}
                                <div className="w-48 sm:w-64 h-32 sm:h-40 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative bg-white">
                                    <img
                                        src={URL.createObjectURL(imageFile)}
                                        alt="Upload preview"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />

                                    {/* Sleek Gradient Overlay for Text */}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-10 flex flex-col justify-end pointer-events-none">
                                        <span className="text-white text-[12px] sm:text-[13px] font-bold truncate drop-shadow-md">
                                            {imageFile.name}
                                        </span>
                                        <span className="text-white/80 text-[10px] sm:text-[11px] font-medium mt-0.5 drop-shadow-md">
                                            {(imageFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </span>
                                    </div>
                                </div>

                                {/* Floating Close Button */}
                                <button
                                    type="button"
                                    onClick={() => setImageFile(null)}
                                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-white hover:bg-red-500 hover:border-red-500 flex items-center justify-center transition-all shadow-md z-10 cursor-pointer"
                                    title="Remove photo"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="text-sm" />
                                </button>
                            </div>

                        </div>
                    ) : (
                        /* STATE 2: EMPTY UPLOAD ZONE (Clickable Label) */
                        <label className="flex flex-col items-center justify-center w-full py-8 px-4 rounded-xl border-2 border-dashed border-[#16a34a]/30 bg-[#f0fdf4]/50 hover:bg-[#f0fdf4] cursor-pointer transition-colors text-sm text-gray-600 group">

                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                                <FontAwesomeIcon icon={faCamera} className="text-[#16a34a] text-xl opacity-80" />
                            </div>

                            <span className="font-bold text-[#14532d]">Drag & drop photos here or click to browse</span>
                            <span className="text-[11px] text-gray-500 mt-1">PNG, JPG up to 10MB</span>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setImageFile(e.target.files[0]);
                                    }
                                }}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>
            )}

            {/* 6. DYNAMIC FINAL STEP: Urgency (Garages) OR Appointment (Service Centers) */}
            <div>
                {shop.shopCategories?.includes('Garages') ? (
                    /* GARAGE UI: Urgency Level */
                    <div className="animate-in fade-in duration-300">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[11px] font-bold">6</div>
                            <h3 className="font-bold text-[#1f2937] text-[13px]">Urgency Level</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" onClick={() => setUrgencyLevel('Normal')} className={`py-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${urgencyLevel === 'Normal' ? 'border-[#16a34a] bg-[#f0fdf4] text-[#14532d]' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}>
                                <FontAwesomeIcon icon={faClock} /> Normal
                            </button>
                            <button type="button" onClick={() => setUrgencyLevel('Urgent')} className={`py-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${urgencyLevel === 'Urgent' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}>
                                <FontAwesomeIcon icon={faExclamationTriangle} /> Urgent
                            </button>
                        </div>
                    </div>
                ) : (
                    /* SERVICE CENTER UI: Preferred Appointment */
                    <div className="animate-in fade-in duration-300">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[11px] font-bold">6</div>
                            <h3 className="font-bold text-[#1f2937] text-[13px]">Preferred Appointment Slot</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] text-gray-500 mb-1.5">Date</label>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]} // Prevents picking past dates
                                    value={preferredDate}
                                    onChange={(e) => setPreferredDate(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-[#16a34a] outline-none transition-colors text-sm text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] text-gray-500 mb-1.5">Time Slot</label>
                                <select
                                    value={preferredTime}
                                    onChange={(e) => setPreferredTime(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-[#16a34a] outline-none transition-colors text-sm text-gray-700 appearance-none"
                                >
                                    <option value="" disabled>Select a time...</option>
                                    <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM</option>
                                    <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                                    <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
                                    <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Premium Footer Row - Actions Only */}
            <div className="flex items-center justify-end gap-3 pt-6 mt-8 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 sm:px-6 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-xs sm:text-sm h-[44px]"
                >
                    Cancel
                </button>

                <button
                    type="button" // Changed to button to let handleProceedToReview manage the state transition
                    onClick={handleProceedToReview}
                    disabled={!brand || !color || !description}
                    className="px-4 sm:px-6 py-2.5 rounded-xl font-bold text-white bg-[#16a34a] hover:bg-[#15803d] transition-all text-xs sm:text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm h-[44px]"
                >
                    Review Request <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                </button>
            </div>
        </form>
    );

    const renderStep2Review = () => {
        // Helper to translate vehicle ID to text
        const getVehicleTypeText = () => {
            if (vehicleCategory === 1) return "2/3 Wheeler";
            if (vehicleCategory === 2) return "4 Wheeler";
            if (vehicleCategory === 3) return "Commercial";
            return "Unknown";
        };

        return (
            <div className="animate-in slide-in-from-right-4 duration-300">

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* LEFT COLUMN: Data */}
                    <div className="space-y-4">

                        {/* Vehicle Info Card */}
                        <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-[#14532d] font-bold text-sm">
                                    <FontAwesomeIcon icon={faCar} /> Vehicle Information
                                </div>
                                <button onClick={() => setStep(1)} className="text-[#16a34a] bg-[#f0fdf4] px-3 py-1 rounded-md text-xs font-bold hover:bg-[#dcfce7] transition-colors">Edit</button>
                            </div>
                            {/* Perfectly aligned 3-column grid */}
                            <div className="grid grid-cols-[110px_10px_1fr] gap-y-2.5 text-[13px]">
                                <span className="text-gray-500">Vehicle Type</span> <span>:</span> <span className="font-bold text-gray-800">{getVehicleTypeText()}</span>
                                <span className="text-gray-500">Brand</span> <span>:</span> <span className="font-bold text-gray-800">{brand}</span>
                                <span className="text-gray-500">Color</span> <span>:</span> <span className="font-bold text-gray-800">{color}</span>
                            </div>
                        </div>

                        {/* Service Details Card */}
                        <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-[#14532d] font-bold text-sm">
                                    <FontAwesomeIcon icon={faWrench} /> Service Details
                                </div>
                                <button onClick={() => setStep(1)} className="text-[#16a34a] bg-[#f0fdf4] px-3 py-1 rounded-md text-xs font-bold hover:bg-[#dcfce7] transition-colors">Edit</button>
                            </div>
                            <div className="grid grid-cols-[110px_10px_1fr] gap-y-2.5 text-[13px]">
                                <span className="text-gray-500">Category</span> <span>:</span> <span className="font-bold text-gray-800">{issueCategory || 'General Checkup'}</span>

                                {shop.shopCategories?.includes('Garages') ? (
                                    <>
                                        <span className="text-gray-500">Urgency</span> <span>:</span>
                                        <span className={`font-bold ${urgencyLevel === 'Urgent' ? 'text-red-600' : 'text-gray-800'}`}>{urgencyLevel}</span>
                                        <span className="text-gray-500">Tow Required</span> <span>:</span>
                                        <span className="font-bold text-gray-800">{requiresTow ? 'Yes' : 'No'}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-gray-500">Appointment</span> <span>:</span>
                                        <span className="font-bold text-gray-800">{preferredDate ? `${preferredDate} at ${preferredTime}` : 'As soon as possible'}</span>
                                    </>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <span className="text-gray-500 text-[13px] block mb-1.5">Issue Description :</span>
                                <p className="font-medium text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 text-[13px] leading-relaxed">{description}</p>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Visuals & Expectations */}
                    <div className="space-y-4 flex flex-col h-full">

                        {/* Photos Card */}
                        {(shop.shopCategories?.length > 0) && (
                            <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2 text-[#14532d] font-bold text-sm">
                                        <FontAwesomeIcon icon={faCamera} /> Photos {imageFile ? '(1)' : '(0)'}
                                    </div>
                                    <button onClick={() => setStep(1)} className="text-[#16a34a] bg-[#f0fdf4] px-3 py-1 rounded-md text-xs font-bold hover:bg-[#dcfce7] transition-colors">Edit</button>
                                </div>
                                <div className="flex gap-2">
                                    {imageFile ? (
                                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 relative group">
                                            <img src={URL.createObjectURL(imageFile)} alt="Problem" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-full py-6 text-center border-2 border-dashed border-gray-200 rounded-xl text-[13px] text-gray-400 font-medium bg-gray-50/50">
                                            No photos attached
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* What Happens Next - Timeline */}
                        <div className="border border-[#16a34a]/20 bg-[#f0fdf4]/50 rounded-xl p-6 flex-1">
                            <h4 className="font-bold text-[#14532d] text-sm mb-5">What happens next?</h4>
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-[80%] before:w-[2px] before:bg-gradient-to-b before:from-[#16a34a] before:to-transparent before:left-0">

                                <div className="relative flex items-start gap-4">
                                    <div className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[10px] font-bold shrink-0 z-10 outline outline-4 outline-[#f0fdf4]">1</div>
                                    <div className="pt-0.5">
                                        <p className="text-[13px] font-bold text-gray-800">Shop receives your request</p>
                                        <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">Your request will be sent to the selected shop instantly.</p>
                                    </div>
                                </div>

                                <div className="relative flex items-start gap-4">
                                    <div className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[10px] font-bold shrink-0 z-10 outline outline-4 outline-[#f0fdf4]">2</div>
                                    <div className="pt-0.5">
                                        <p className="text-[13px] font-bold text-gray-800">Shop reviews your issue</p>
                                        <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">The team will review your details and photos.</p>
                                    </div>
                                </div>

                                <div className="relative flex items-start gap-4">
                                    <div className="w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[10px] font-bold shrink-0 z-10 outline outline-4 outline-[#f0fdf4]">3</div>
                                    <div className="pt-0.5">
                                        <p className="text-[13px] font-bold text-gray-800">You receive a response</p>
                                        <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">The shop will confirm your booking or suggest a time.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* FULL WIDTH: Terms and Conditions Card */}
                <div className="mt-5 border border-[#f59e0b]/30 bg-[#fffbeb] rounded-xl p-5">
                    <div className="flex items-center gap-2 text-[#b45309] font-bold text-sm mb-3">
                        <FontAwesomeIcon icon={faShieldAlt} /> By submitting this request
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer group">

                        {/* THE FIX: The hidden input that actually handles the click state */}
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                        />

                        {/* Perfectly aligned, amber-themed custom checkbox */}
                        <div className={`mt-0.5 w-5 h-5 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${agreedToTerms ? 'bg-[#b45309] border-[#b45309]' : 'border-[#d97706]/40 bg-white group-hover:border-[#b45309]'}`}>
                            {agreedToTerms && <FontAwesomeIcon icon={faCheck} className="text-white text-[11px]" />}
                        </div>

                        <span className="text-[13px] text-gray-700 leading-relaxed">
                            I understand that submitting this request does not guarantee repair service. I agree to share my contact information securely with the selected shop.
                        </span>

                    </label>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between mb-4">
                        <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-sm flex items-center gap-2 h-[44px]">
                            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" /> Back
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={!agreedToTerms || isSubmitting}
                            className={`px-8 py-2.5 rounded-xl font-bold text-white transition-all text-sm flex items-center gap-2 h-[44px] ${!agreedToTerms || isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#16a34a] hover:bg-[#15803d] active:scale-95 shadow-md'}`}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Request'} <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                        </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                        <FontAwesomeIcon icon={faLock} className="text-[10px]" /> Your information is secure and encrypted
                    </div>
                </div>

            </div>
        );
    };

    const renderStep3Success = () => (
        <div className="relative pt-10 pb-6 flex flex-col items-center justify-center animate-in zoom-in duration-400">

            {/* Top Right Close Button */}
            <button onClick={onClose} className="absolute -top-2 -right-2 text-gray-400 hover:text-gray-700 transition-colors p-2">
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>

            {/* Main Success Icon */}
            <div className="relative mb-6">
                <div className="w-20 h-20 bg-[#16a34a] text-white rounded-full flex items-center justify-center text-4xl shadow-lg shadow-[#16a34a]/20">
                    <FontAwesomeIcon icon={faCheck} />
                </div>
                {/* Simplified Confetti Dots */}
                <div className="absolute top-1 -left-4 w-2 h-2 rounded-full bg-blue-400"></div>
                <div className="absolute top-4 -right-4 w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                <div className="absolute -bottom-2 left-2 w-2 h-2 rounded-full bg-green-300"></div>
            </div>

            <h4 className="text-[24px] font-bold text-[#14532d] mb-1.5">Request Sent Successfully!</h4>
            <p className="text-[14px] text-gray-500 mb-8">Your request has been sent to</p>

            {/* --- ALL CONTAINERS BELOW SCALED TO max-w-md FOR PERFECT ALIGNMENT --- */}

            {/* DYNAMIC Shop Info Card Mini */}
            <div className="border border-gray-100 rounded-xl p-3.5 flex items-center gap-4 bg-white shadow-sm w-full max-w-md mb-5">
                <div className="w-12 h-12 rounded-full bg-[#f3f4f6] flex flex-col items-center justify-center flex-shrink-0 border border-gray-200">
                    <FontAwesomeIcon icon={faCar} className="text-lg text-gray-400" />
                </div>
                <div className="flex flex-col justify-center">
                    <h3 className="text-[14px] font-bold text-[#1f2937]">{shop?.info?.name || 'Service Center'}</h3>
                    <div className="flex items-center gap-3 text-[12px] text-gray-500 mt-0.5">
                        <div className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faStar} className="text-[#f59e0b]" />
                            <span className="font-bold text-gray-700">{shop?.stats?.averageRating || 'New'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                            <span>{distance || 'Distance unknown'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reference ID Box */}
            <div className="w-full max-w-md border border-dashed border-[#16a34a]/40 bg-[#f0fdf4]/50 rounded-xl p-5 flex flex-col items-center justify-center relative mb-4">
                <span className="text-[11px] font-bold text-[#14532d] uppercase tracking-wider mb-1">Reference ID</span>
                <span className="text-xl font-mono font-bold text-gray-800 tracking-wide">{referenceId || 'REQ-2026-00124'}</span>
                <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(referenceId)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#16a34a] transition-colors p-2 cursor-pointer"
                    title="Copy ID"
                >
                    <FontAwesomeIcon icon={faCopy} className="text-lg" />
                </button>
            </div>

            {/* DYNAMIC Estimated Response Time Box */}
            <div className="w-full max-w-md bg-[#f0fdf4] border border-[#dcfce7] rounded-xl p-4 flex items-center justify-center gap-3 mb-6 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-[#dcfce7] flex items-center justify-center">
                    <FontAwesomeIcon icon={faBolt} className="text-[#16a34a] text-sm" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[12px] text-[#14532d] font-bold">Estimated Response Time</span>
                    <span className="text-[15px] font-bold text-[#16a34a]">~ {shop?.info?.response_time_minutes || shop?.responseTime || 15} Minutes</span>
                </div>
            </div>

            {/* What's Next Tracker */}
            <div className="w-full max-w-md border border-gray-100 rounded-xl p-6 mb-6 bg-white shadow-sm">
                <h4 className="text-[13px] font-bold text-[#14532d] mb-5">What's next?</h4>
                <div className="flex items-start justify-between relative px-2">
                    {/* Background Line */}
                    <div className="absolute top-4 left-8 right-8 h-[2px] bg-gray-100 -z-10"></div>

                    {/* Step 1 */}
                    <div className="flex flex-col items-center gap-2 bg-white relative">
                        <div className="w-8 h-8 rounded-full bg-[#ecfdf5] border-2 border-[#16a34a] text-[#16a34a] flex items-center justify-center text-[11px] shadow-sm">
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </div>
                        <span className="text-[10px] font-bold text-[#16a34a] whitespace-nowrap absolute -bottom-5">Request Sent</span>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center gap-2 bg-white relative">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-300 flex items-center justify-center text-[11px]">
                            <FontAwesomeIcon icon={faClock} />
                        </div>
                        <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap absolute -bottom-5">Reviewing</span>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center gap-2 bg-white relative">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-300 flex items-center justify-center text-[11px]">
                            <FontAwesomeIcon icon={faCheckCircle} />
                        </div>
                        <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap absolute -bottom-5">Responded</span>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center gap-2 bg-white relative">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-300 flex items-center justify-center text-[11px]">
                            <FontAwesomeIcon icon={faWrench} />
                        </div>
                        <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap absolute -bottom-5">Repairing</span>
                    </div>
                </div>
            </div>

            {/* Notification Info Banner */}
            <div className="w-full max-w-md bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4 flex items-start gap-3 mb-6">
                <FontAwesomeIcon icon={faInfoCircle} className="text-[#3b82f6] mt-0.5 text-sm" />
                <div className="text-[12px] text-[#1e3a8a] leading-relaxed">
                    You will be notified as soon as the shop responds.<br />
                    You can track the status of your request anytime.
                </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-md flex gap-3 mb-6">
                <button
                    onClick={() => {
                        onClose();
                        if (onTrackRequest) onTrackRequest(referenceId);
                    }}
                    className="flex-1 py-3.5 rounded-xl font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
                >
                    <FontAwesomeIcon icon={faClock} className="text-[#16a34a]" /> Track Request
                </button>
                <button onClick={onClose} className="flex-1 py-3.5 rounded-xl font-bold bg-[#16a34a] text-white hover:bg-[#15803d] transition-colors text-sm flex items-center justify-center gap-2 shadow-md">
                    <FontAwesomeIcon icon={faCar} /> Back to Shops
                </button>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <FontAwesomeIcon icon={faLock} className="text-[10px]" /> Thank you for choosing FixGo!
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* THE FIX 1: Sticky Top Bar stays OUTSIDE the overflow container */}
                {step !== 3 && renderStickyTopBar()}

                {/* THE FIX 2: Everything else goes INSIDE the scrolling container */}
                <div id="modal-scroll-container" className="flex-1 overflow-y-auto">

                    {/* The Shop Card now scrolls out of the way gracefully */}
                    {step !== 3 && renderShopInfoCard()}

                    {/* Modal Body / Form */}
                    <div className="p-4 sm:p-6">
                        {error && (
                            <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-sm font-mono">
                                <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5 text-red-500" />
                                <p>{error}</p>
                            </div>
                        )}

                        {step === 1 && renderStep1Form()}
                        {step === 2 && renderStep2Review()}
                        {step === 3 && renderStep3Success()}
                    </div>
                </div>

            </div>
        </div>
    );
};