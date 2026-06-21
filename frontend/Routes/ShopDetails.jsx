import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { faArrowLeft, faStar, faLock, faLocationDot, faPhone,faTimes, faImage } from "@fortawesome/free-solid-svg-icons";
import { ServiceRequestModal } from "../components/ShopDetails/ServiceRequestForm";
import { FaWrench, FaStar, FaShieldAlt, FaSmile, FaClock, FaMapMarkerAlt, FaPhoneAlt, FaCheckCircle, FaTruckPickup, FaCar } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// NEW: Upgraded SafeImage with Darker Backgrounds & Lightbox Support
const SafeImage = ({ src, alt, className, isLightbox = false }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    // Dark grey for the grid, deep slate for the fullscreen Lightbox
    const bgClass = isLightbox ? "bg-slate-800 text-slate-500 w-full h-[60vh] rounded-2xl" : "bg-slate-200 text-slate-500 h-full w-full";
    // Strip out object-cover/contain so the fallback div doesn't act weird
    const cleanClassName = className ? className.replace('object-cover', '').replace('object-contain', '') : '';
    
    return (
      <div className={`flex flex-col items-center justify-center ${bgClass} ${cleanClassName}`}>
        <FontAwesomeIcon icon={faImage} className={`${isLightbox ? 'text-6xl mb-4' : 'text-3xl mb-2'} opacity-40`} />
        <span className={`${isLightbox ? 'text-sm' : 'text-[11px]'} font-bold uppercase tracking-wider`}>No Photo</span>
      </div>
    );
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setHasError(true)} 
    />
  );
};



function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const locationData = useLocation();
  // Check if we passed a distance. If they visited the URL directly, it gracefully falls back to null.
  const passedDistance = locationData.state?.distance;
  console.log("What did the router pass?", locationData.state);
  
  // NEW: State for our Safety Nets and Data
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // NEW: State for Review Filtering
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSort, setActiveSort] = useState("Most Recent");

  // NEW: State for the Fullscreen Lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // NEW: Helper function to open Lightbox at specific image
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // NEW: API Fetching Effect
  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        setLoading(true);
        // Retrieve your JWT token from where you store it upon login
        const token = localStorage.getItem('jwt_token'); 

        const response = await fetch(`http://localhost:8000/api/getShopDetails.php?id=${id}`, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            // Only attach the header if the user is actually logged in
            ...(token && { 'Authorization': `Bearer ${token}` }) 
          }
        });
        const json = await response.json();
        
        if (json.success) {
          setShop(json.data);
        } else {
          setError(json.message || "Shop not found.");
        }
      } catch (err) {
        setError("Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [id]);

  // NEW: Review Filtering & Sorting Engine
  const processedReviews = useMemo(() => {
    if (!shop || !shop.reviews) return [];
    let result = [...shop.reviews];

    // 1. Filter by Stars
    if (activeFilter !== "All") {
      const targetStars = parseInt(activeFilter.split(" ")[0]); // Extracts "5" from "5 Stars"
      result = result.filter((r) => parseInt(r.rating) === targetStars);
    }

    // 2. Sort Logic
    if (activeSort === "Highest Rated") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (activeSort === "Lowest Rated") {
      result.sort((a, b) => a.rating - b.rating);
    } else {
      // Most Recent
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return result;
  }, [shop, activeFilter, activeSort]);

  // SAFETY NET 1: The Loading Screen
  if (loading) {
    return (
      <>
        <NavBar />
        <main className="min-h-screen bg-[#f7fbf8] flex items-center justify-center">
          <div className="flex flex-col items-center animate-pulse">
            <FaWrench className="text-4xl text-green-500 mb-4 animate-spin" />
            <h2 className="text-xl font-bold text-slate-700">Loading shop details...</h2>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // SAFETY NET 2: The 404 / Error Screen
  if (error || !shop) {
    return (
      <>
        <NavBar />
        <main className="min-h-screen bg-[#f7fbf8] flex items-center justify-center pt-20">
          <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-red-100 max-w-md">
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Oops!</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <button onClick={() => navigate(-1)} className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">
              Go Back
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // --- RENDER MAIN UI ---
  const { info, stats, gallery, services, isHandshakeComplete, shopCategories, vehicleCategories } = shop;

  // THE FIX: Strip out empty or null strings from the database array so Swiper only gets real URLs!
  const validGallery = gallery?.filter(imgUrl => imgUrl && imgUrl.trim() !== '') || [];

  // NEW: A single variable to control all UI locks!
  const isFullyUnlocked = isHandshakeComplete || shopCategories?.includes("Spare Parts");

  return (
    <>
      <NavBar />

      <main className="min-h-screen bg-[#f7fbf8] pt-3 pb-10">
        <div className="mx-auto w-full max-w-screen-2xl px-6">

          {/* Top Navigation Row: Small Back Button & Breadcrumbs */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <button
              onClick={() => navigate(-1)}
              className="group flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13.5px] font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-x-1 hover:border-[#16a34a] hover:text-[#16a34a] hover:shadow-md"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="transition-transform duration-200 group-hover:-translate-x-1" />
              Go Back
            </button>

            {/* Dynamic Breadcrumbs */}
            <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium">
              <Link to="/" className="hover:text-[#16a34a] transition-colors">Home</Link>
              <span className="text-slate-300">›</span>
              <span className="cursor-pointer hover:text-[#16a34a] transition-colors" onClick={() => navigate(-1)}>Shops</span>
              <span className="text-slate-300">›</span>
              <span className="text-slate-800 font-bold">{info.name}</span>
            </div>
            
          </div>

          <div className="overflow-hidden bg-white">
            {/* IMAGE GALLERY SECTION (Premium Bento UX) */}
          <div className="relative mb-8 rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200">
            {validGallery && validGallery.length > 0 ? (
              <>
                {/* MOBILE: Swiper Carousel */}
                <div className="block md:hidden">
                  <Swiper
                    modules={[Pagination, Navigation]}
                    pagination={{ clickable: true }}
                    navigation={true}
                    slidesPerView={1}
                    onSlideChange={(swiper) => setCurrentImage(swiper.activeIndex)}
                  >
                    {validGallery.map((imgUrl, index) => (
                      <SwiperSlide key={index}>
                        <div className="h-[240px] w-full">
                          <SafeImage src={`http://localhost:8000/${imgUrl.replace(/\\/g, '/')}`} alt={`Gallery ${index}`} className="h-full w-full object-cover" />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* DESKTOP: Premium Bento Grid Layout */}
                <div className="hidden md:block h-[260px] lg:h-[320px] w-full p-2 lg:p-3 bg-white">
                  
                  {/* Layout 1 Image */}
                  {validGallery.length === 1 && (
                    <div onClick={() => openLightbox(0)} className="w-full h-full cursor-pointer">
                      <SafeImage src={`http://localhost:8000/${validGallery[0].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover rounded-xl transition-transform duration-500 hover:scale-[1.02]" />
                    </div>
                  )}

                  {/* Layout 2 Images */}
                  {validGallery.length === 2 && (
                    <div className="grid grid-cols-2 gap-3 h-full">
                      <div onClick={() => openLightbox(0)} className="h-full overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`http://localhost:8000/${validGallery[0].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                      <div onClick={() => openLightbox(1)} className="h-full overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`http://localhost:8000/${validGallery[1].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                    </div>
                  )}

                  {/* Layout 3 Images */}
                  {validGallery.length === 3 && (
                    <div className="grid grid-cols-3 gap-3 h-full">
                      <div onClick={() => openLightbox(0)} className="col-span-2 h-full overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`http://localhost:8000/${validGallery[0].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                      <div className="col-span-1 grid grid-rows-2 gap-3 h-full">
                        <div onClick={() => openLightbox(1)} className="h-full overflow-hidden rounded-xl cursor-pointer">
                          <SafeImage src={`http://localhost:8000/${validGallery[1].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                        </div>
                        <div onClick={() => openLightbox(2)} className="h-full overflow-hidden rounded-xl cursor-pointer">
                          <SafeImage src={`http://localhost:8000/${validGallery[2].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Layout 4 Images */}
                  {validGallery.length === 4 && (
                    <div className="grid grid-cols-5 grid-rows-2 gap-3 h-full">
                      <div onClick={() => openLightbox(0)} className="col-span-3 row-span-2 h-full overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`http://localhost:8000/${validGallery[0].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                      <div onClick={() => openLightbox(1)} className="col-span-1 row-span-1 h-full overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`http://localhost:8000/${validGallery[1].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                      <div onClick={() => openLightbox(2)} className="col-span-1 row-span-1 h-full overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`http://localhost:8000/${validGallery[2].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                      <div onClick={() => openLightbox(3)} className="col-span-2 row-span-1 h-full overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`http://localhost:8000/${validGallery[3].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                    </div>
                  )}

                  {/* Layout 5+ Images */}
                  {validGallery.length >= 5 && (
                    <div className="grid grid-cols-5 grid-rows-2 gap-3 h-full">
                      <div onClick={() => openLightbox(0)} className="col-span-3 row-span-2 h-full relative group overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`http://localhost:8000/${validGallery[0].replace(/\\/g, '/')}`} alt="Main Shop" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      
                      <div onClick={() => openLightbox(1)} className="col-span-1 row-span-1 h-full relative group overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`http://localhost:8000/${validGallery[1].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      
                      <div onClick={() => openLightbox(2)} className="col-span-1 row-span-1 h-full relative group overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`http://localhost:8000/${validGallery[2].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      
                      <div onClick={() => openLightbox(3)} className="col-span-1 row-span-1 h-full relative group overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`http://localhost:8000/${validGallery[3].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>

                      <div onClick={() => openLightbox(4)} className="col-span-1 row-span-1 h-full relative group overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`http://localhost:8000/${validGallery[4].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        {validGallery.length > 5 && (
                          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white transition-colors group-hover:bg-black/60 backdrop-blur-[2px]">
                            <span className="text-2xl font-bold">+{validGallery.length - 5}</span>
                            <span className="text-sm font-medium tracking-wide">View all photos</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* DYNAMIC EMPTY STATE: When a shop has 0 images in the database */
              <div className="h-[240px] lg:h-[300px] w-full flex flex-col items-center justify-center bg-slate-50 rounded-xl border-2 border-slate-200 border-dashed text-slate-400 transition-all hover:bg-slate-100 m-2" style={{ width: 'calc(100% - 16px)' }}>
                <FontAwesomeIcon icon={faImage} className="text-4xl sm:text-5xl mb-3 opacity-30 text-slate-400" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">No Gallery Images</span>
                <span className="text-[11px] sm:text-xs font-medium mt-1 text-slate-400">This shop hasn't uploaded any photos yet.</span>
              </div>
            )}
          </div>
          
            <div className="space-y-6 px-4 pb-6 pt-4 sm:px-6">
              <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
                
                {/* LEFT SIDE */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200">
                  
                  {/* Title & Verified Badge */}
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{info.name}</h1>
                    <span className="flex items-center gap-1.5 rounded-full bg-[#16a34a] px-3 py-1 text-xs font-bold text-white shadow-sm">
                      <FaCheckCircle className="text-white/90" /> Verified
                    </span>
                  </div>

                  {/* Rating Row */}
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-[14px]">
                    <span className="text-[17px] font-extrabold text-slate-900">{stats.averageRating}</span>
                    <div className="flex items-center text-yellow-400 text-sm gap-0.5">
                      {[...Array(5)].map((_, i) => (
                         <FaStar key={i} className={i < Math.round(stats.averageRating) ? "text-yellow-400" : "text-slate-200"} />
                      ))}
                    </div>
                    <span className="text-slate-500 font-medium ml-1">({stats.reviewCount} reviews)</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold text-slate-600">{stats.recommendPercentage}% recommend</span>
                  </div>

                  {/* Dynamic Categories (Pills) */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {/* Shop Categories */}
                    {shopCategories && shopCategories.map((category, idx) => (
                      <span key={`sc-${idx}`} className="rounded-full bg-emerald-50 px-4 py-1.5 text-[13px] font-bold text-emerald-700 border border-emerald-100">
                        {category}
                      </span>
                    ))}

                    {/* Vehicle Categories */}
                    {vehicleCategories && vehicleCategories.map((vehicle, idx) => (
                      <span key={`vc-${idx}`} className="rounded-full bg-slate-50 px-4 py-1.5 text-[13px] font-semibold text-slate-600 border border-slate-200">
                        {vehicle}
                      </span>
                    ))}
                    
                    {(!shopCategories?.length && !vehicleCategories?.length) && (
                       <span className="text-sm text-slate-400 italic">Categories not specified</span>
                    )}
                  </div>

                  {/* Premium Dynamic Tow Truck Banner */}
                  {info.carriageService == 1 && (
                    <div className="mt-6 flex items-center gap-4 rounded-2xl px-5 py-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100/80">
                        <FaTruckPickup className="text-lg text-green-600" />
                      </div>
                      <p className="text-[14.5px] leading-relaxed text-slate-700 font-medium">
                        <strong className="font-bold text-slate-900 mr-1">Pickup Available.</strong>
                        We offer tow truck transport and pickup services for all supported vehicle types.
                      </p>
                    </div>
                  )}

                  {/* Description */}
                  <p className="mt-6 text-[15px] leading-relaxed text-slate-600">
                    {info.description || "No description provided."}
                  </p>

                 {/* Flawless Info Grid (True 3-Column Layout matching the original design) */}
                  <div className="mt-8 mb-10 border-t border-slate-100 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-7 gap-x-6 items-start">
                      
                      {/* --- ROW 1 --- */}

                      {/* Col 1: Distance */}
                      <div className="col-span-1 flex items-center gap-2.5">
                        {passedDistance && (
                          <>
                            <FaMapMarkerAlt className="text-red-600 text-[18px] shrink-0" />
                            <span className="font-medium text-slate-600 text-[15px]">
                              {typeof passedDistance === 'string' && passedDistance.includes('km') 
                                ? passedDistance 
                                : parseFloat(passedDistance) > 100 
                                  ? (parseFloat(passedDistance) / 1000).toFixed(1) + ' km' 
                                  : parseFloat(passedDistance).toFixed(1) + ' km'} away
                            </span>
                          </>
                        )}
                      </div>

                      {/* Col 2: Status */}
                      <div className="col-span-1 flex items-center gap-2.5">
                        <div className={`h-2 w-2 rounded-full ${info.isAvailable ? 'bg-green-600' : 'bg-red-500'}`}></div>
                        <span className={`font-bold text-[15px] ${info.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                          {info.isAvailable ? "Open Now" : "Currently Busy"}
                        </span>
                        {info.isAvailable && info.closeTime && (
                          <span className="text-slate-500 text-[14px] font-medium ml-1">
                            Closes at {info.closeTime.substring(0, 5)}
                          </span>
                        )}
                      </div>

                      {/* Col 3: Schedule */}
                      <div className="col-span-1 flex items-start gap-3">
                        <FaClock className="text-slate-500 mt-0.5 text-[18px] shrink-0" />
                        <div className="flex flex-col text-[14px] text-slate-700 font-medium leading-snug">
                          {/* If your DB supports specific days later, replace this text */}
                          <span>Everyday {info.openTime.substring(0, 5)} - {info.closeTime.substring(0, 5)}</span>
                        </div>
                      </div>

                      {/* --- ROW 2 --- */}

                      {/* Col 1 & 2: Address (Spans across the first two columns!) */}
                      <div className="md:col-span-2 flex items-start gap-2.5">
                        <FaMapMarkerAlt className="text-red-600 mt-0.5 text-[18px] shrink-0" />
                        <p className={`text-[15px] pr-6 leading-snug ${!isFullyUnlocked ? "text-slate-500 font-medium italic" : "text-slate-700 font-medium"}`}>
                          {info.location}
                        </p>
                      </div>

                      {/* Col 3: Phone (Aligns perfectly under the schedule) */}
                      <div className="col-span-1 flex items-start gap-3">
                        <FaPhoneAlt className="text-slate-700 mt-0.5 text-[17px] shrink-0" />
                        <div>
                          <p className={`text-[15px] leading-snug ${!isFullyUnlocked ? "text-slate-500 font-medium italic" : "text-slate-800 font-bold tracking-wide"}`}>
                            {info.phone}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50"><FaWrench className="text-green-600 text-xl" /></div><div><h3 className="text-2xl font-bold text-slate-900">{stats.jobsCompleted}</h3><p className="text-xs text-slate-500">Jobs Completed</p></div></div></div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50"><FaStar className="text-green-600 text-xl" /></div><div><h3 className="text-2xl font-bold text-slate-900">{stats.averageRating}</h3><p className="text-xs text-slate-500">Rating</p></div></div></div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50"><FaShieldAlt className="text-green-600 text-xl" /></div><div><h3 className="text-2xl font-bold text-slate-900">{stats.yearsExperience}</h3><p className="text-xs text-slate-500">Experience</p></div></div></div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50"><FaSmile className="text-green-600 text-xl" /></div><div><h3 className="text-2xl font-bold text-slate-900">{stats.completionRate}</h3><p className="text-xs text-slate-500">Completion</p></div></div></div>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="space-y-5">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-10">
                    <h3 className="mb-4 text-lg font-bold">Book a Service</h3>
                    {/* CONDITIONAL RENDER: Check if it's a Spare Parts shop */}
                    {shopCategories?.includes("Spare Parts") ? (
                      <div className="space-y-3">
                        <button 
                          disabled 
                          className="w-full rounded-xl bg-slate-100 py-3 text-slate-400 font-semibold cursor-not-allowed border border-slate-200 transition"
                        >
                          Service Unavailable
                        </button>
                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                          <p className="text-[12.5px] text-amber-700 leading-snug">
                            <strong className="font-bold">Note:</strong> Online service requests are not available for retail Spare Parts shops. Please contact the shop directly for part inquiries.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="w-full rounded-xl bg-green-600 py-3 text-white font-semibold hover:bg-green-700 transition shadow-sm active:scale-95"
                      >
                        Request Service
                      </button>
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="mb-4 text-lg font-bold">Shop Location</h3>
                    <div className="overflow-hidden rounded-xl bg-slate-200 relative group">
                      <iframe 
                        title="shop-location" 
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(info.mapQuery)}&t=&z=${isFullyUnlocked ? 15 : 14}&ie=UTF8&iwloc=&output=embed`} 
                        className="h-56 w-full" 
                        loading="lazy"
                      />
                      
                      {/* INVISIBLE SHIELD: Blocks all mouse clicks & dragging if locked */}
                      {!isFullyUnlocked && (
                        <div 
                           className="absolute inset-0 z-10 bg-transparent cursor-not-allowed" 
                           title="Complete booking to unlock interactive map"
                        ></div>
                      )}
                    </div>
                    
                    <button disabled={!isFullyUnlocked} className={`mt-4 w-full rounded-xl py-3 font-semibold transition ${isFullyUnlocked ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}>
                      {isFullyUnlocked ? "Get Directions" : "Directions Locked"}
                    </button>
                  </div>
                </div>
              </div>

              {/* SERVICES AND REVIEWS SECTION */}
              <div className="grid gap-8 xl:grid-cols-[1.4fr,0.9fr]">
                <div className="space-y-8">
                  
                  <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
                    {/* Services Box */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Our Services</h2>
                      </div>
                      
                     {services && services.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          {services.map((service, index) => (
                            <div key={index} className="flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-4 transition-all hover:border-green-200 hover:shadow-sm">
                              
                              {/* Top Section: Icon, Full Name & Price */}
                              <div className="flex items-center gap-3">
                                {/* Circular Icon */}
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100/50">
                                  <FaWrench className="text-[15px] text-emerald-600" />
                                </div>
                                
                                {/* Text Block: Removed all truncation to show full name */}
                                <div className="flex flex-col min-w-0 flex-1">
                                  <h3 className="text-[14px] leading-tight font-bold text-slate-800 break-words">
                                    {service.name}
                                  </h3>
                                  <p className="mt-1 text-[13px] font-bold text-emerald-600">
                                    from {service.price}
                                  </p>
                                </div>
                              </div>

                              {/* Bottom Section: Duration Only */}
                              <div className="mt-5 flex items-center gap-2 text-[13px] font-medium text-slate-500">
                                <FaClock className="text-[14px] text-slate-400" />
                                <span>{service.duration}</span>
                              </div>
                              
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 italic">No specific services listed yet.</p>
                      )}
                    </div>
                    
                    {/* Why Choose Us */}
                    <div className="rounded-2xl border border-[#d1e7d7] bg-white p-8 shadow-sm self-start">
                      <h2 className="text-xl font-bold text-[#0f172a]">Why Choose Us?</h2>
                      <div className="mt-4 space-y-3 text-sm">
                        <div className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span><span>Certified Technicians</span></div>
                        <div className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span><span>Modern Diagnostics</span></div>
                        <div className="flex items-start gap-2"><span className="text-green-600 font-bold">✓</span><span>Transparent Pricing</span></div>
                      </div>
                    </div>
                  </div>

                  {/* REVIEWS SECTION */}
                  <div className="flex flex-col gap-4 rounded-2xl border border-[#d1e7d7] bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-slate-900">Customer Reviews</h2>
                        <span className="text-slate-500">{stats.reviewCount} Reviews</span>
                      </div>
                      
                      {/* Sort Dropdown */}
                      <select 
                        value={activeSort} 
                        onChange={(e) => setActiveSort(e.target.value)} 
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-green-500 outline-none cursor-pointer"
                      >
                        <option>Most Recent</option>
                        <option>Highest Rated</option>
                        <option>Lowest Rated</option>
                      </select>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-3">
                      {["All", "5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"].map(filter => (
                        <button 
                          key={filter} 
                          onClick={() => setActiveFilter(filter)}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeFilter === filter ? 'bg-green-600 text-white border-transparent' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                          {filter === "All" ? `All (${stats.reviewCount})` : filter}
                        </button>
                      ))}
                    </div>

                    {/* Filtered Reviews Output */}
                    {processedReviews.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mt-4">
                        {processedReviews.map((review, i) => (
                          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white">
                                  {review.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900">{review.name}</p>
                                  <div className="mt-1 flex items-center gap-1 text-yellow-500">
                                    {Array.from({ length: parseInt(review.rating) }).map((_, index) => (
                                      <FontAwesomeIcon key={index} icon={faStar} />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="text-sm text-slate-400">{review.date}</span>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-slate-600">{review.summary}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center text-slate-500 bg-slate-50 rounded-xl mt-4 border border-slate-100">
                        <p>No reviews match this filter.</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* FULLSCREEN IMAGE LIGHTBOX */}
      {isLightboxOpen && validGallery.length > 0 && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
          
          {/* Lightbox Header: Counter & Close Button */}
          <div className="absolute top-0 left-0 right-0 z-[101] flex items-center justify-between p-4 sm:p-6 text-white bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
            <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-sm font-semibold tracking-wide pointer-events-auto">
              {lightboxIndex + 1} / {validGallery.length}
            </div>
            <button 
              onClick={() => setIsLightboxOpen(false)} 
              className="p-2 w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors pointer-events-auto"
            >
              <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            </button>
          </div>

          {/* Lightbox Swiper Gallery */}
          <div className="flex-1 w-full h-full flex items-center justify-center">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation={true}
              initialSlide={lightboxIndex}
              onSlideChange={(swiper) => setLightboxIndex(swiper.activeIndex)}
              className="w-full h-full max-w-6xl mx-auto"
            >
              {validGallery.map((imgUrl, idx) => (
                <SwiperSlide key={idx} className="flex items-center justify-center p-4 sm:p-12">
                  <SafeImage 
                    src={`http://localhost:8000/${imgUrl.replace(/\\/g, '/')}`} 
                    alt={`Fullscreen Gallery ${idx}`} 
                    className="max-h-full max-w-full object-contain drop-shadow-2xl select-none rounded-xl"
                    isLightbox={true}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      <ServiceRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} shop={shop} distance={passedDistance} initialNeedsTow={false} />
      <Footer />
    </>
  );
}

export default ShopDetails;