import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { faArrowLeft, faStar, faLock, faLocationDot, faPhone, faTimes, faImage, faFlag, faTriangleExclamation, faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ServiceRequestModal } from "../components/ShopDetails/ServiceRequestForm";
import { FaWrench, FaStar, FaShieldAlt, FaSmile, FaClock, FaMapMarkerAlt, FaPhoneAlt, FaCheckCircle, FaTruckPickup, FaCar } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { api, UPLOADS_URL } from "../src/services/api";


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

  // NEW: State for Report Garage Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportType, setReportType] = useState("PROFILE FLAG");
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccessMsg, setReportSuccessMsg] = useState("");
  const [reportErrorMsg, setReportErrorMsg] = useState("");

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) {
      setReportErrorMsg("Please enter a reason for reporting this garage.");
      return;
    }
    setSubmittingReport(true);
    setReportErrorMsg("");
    try {
      const res = await api.post("customer/reportShop.php", {
        shop_id: id,
        flag_type: reportType,
        description: reportReason.trim()
      });
      if (res && res.success) {
        setReportSuccessMsg(res.message || "Report submitted successfully.");
        setReportReason("");
        setTimeout(() => {
          setIsReportModalOpen(false);
          setReportSuccessMsg("");
        }, 2200);
      }
    } catch (err) {
      setReportErrorMsg(err.data?.error || err.message || "Failed to submit report. Please log in first.");
    } finally {
      setSubmittingReport(false);
    }
  };

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
        const data = await api.getOptionalAuth('shop-details/getShopDetails.php', { id });
        setShop(data.data);
      } catch (err) {
        setError(err.message || "Shop not found.");
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

  // NEW: Google Maps Navigation Handler
  const handleGetDirections = () => {
    if (!isFullyUnlocked || !info?.mapQuery) return;
    
    // Create the Universal Google Maps Directions URL
    const destination = encodeURIComponent(info.mapQuery);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    
    // Open in a new tab (or launch the native app on mobile)
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

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
                          <SafeImage src={`${UPLOADS_URL}/${imgUrl.replace(/\\/g, '/')}`} alt={`Gallery ${index}`} className="h-full w-full object-cover" />
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
                      <SafeImage src={`${UPLOADS_URL}/${validGallery[0].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover rounded-xl transition-transform duration-500 hover:scale-[1.02]" />
                    </div>
                  )}

                  {/* Layout 2 Images */}
                  {validGallery.length === 2 && (
                    <div className="grid grid-cols-2 gap-3 h-full">
                      <div onClick={() => openLightbox(0)} className="h-full overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`${UPLOADS_URL}/${validGallery[0].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                      <div onClick={() => openLightbox(1)} className="h-full overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`${UPLOADS_URL}/${validGallery[1].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                    </div>
                  )}

                  {/* Layout 3 Images */}
                  {validGallery.length === 3 && (
                    <div className="grid grid-cols-3 gap-3 h-full">
                      <div onClick={() => openLightbox(0)} className="col-span-2 h-full overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`${UPLOADS_URL}/${validGallery[0].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                      <div className="col-span-1 grid grid-rows-2 gap-3 h-full">
                        <div onClick={() => openLightbox(1)} className="h-full overflow-hidden rounded-xl cursor-pointer">
                          <SafeImage src={`${UPLOADS_URL}/${validGallery[1].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                        </div>
                        <div onClick={() => openLightbox(2)} className="h-full overflow-hidden rounded-xl cursor-pointer">
                          <SafeImage src={`${UPLOADS_URL}/${validGallery[2].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Layout 4 Images */}
                  {validGallery.length === 4 && (
                    <div className="grid grid-cols-5 grid-rows-2 gap-3 h-full">
                      <div onClick={() => openLightbox(0)} className="col-span-3 row-span-2 h-full overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`${UPLOADS_URL}/${validGallery[0].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                      <div onClick={() => openLightbox(1)} className="col-span-1 row-span-1 h-full overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`${UPLOADS_URL}/${validGallery[1].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                      <div onClick={() => openLightbox(2)} className="col-span-1 row-span-1 h-full overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`${UPLOADS_URL}/${validGallery[2].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                      <div onClick={() => openLightbox(3)} className="col-span-2 row-span-1 h-full overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`${UPLOADS_URL}/${validGallery[3].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                    </div>
                  )}

                  {/* Layout 5+ Images */}
                  {validGallery.length >= 5 && (
                    <div className="grid grid-cols-5 grid-rows-2 gap-3 h-full">
                      <div onClick={() => openLightbox(0)} className="col-span-3 row-span-2 h-full relative group overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`${UPLOADS_URL}/${validGallery[0].replace(/\\/g, '/')}`} alt="Main Shop" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      
                      <div onClick={() => openLightbox(1)} className="col-span-1 row-span-1 h-full relative group overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`${UPLOADS_URL}/${validGallery[1].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      
                      <div onClick={() => openLightbox(2)} className="col-span-1 row-span-1 h-full relative group overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`${UPLOADS_URL}/${validGallery[2].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      
                      <div onClick={() => openLightbox(3)} className="col-span-1 row-span-1 h-full relative group overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`${UPLOADS_URL}/${validGallery[3].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>

                      <div onClick={() => openLightbox(4)} className="col-span-1 row-span-1 h-full relative group overflow-hidden rounded-xl cursor-pointer">
                        <SafeImage src={`${UPLOADS_URL}/${validGallery[4].replace(/\\/g, '/')}`} alt="Shop View" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
          
            <div className="space-y-8 px-4 pb-6 pt-4 sm:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* LEFT COLUMN (Span 2 on Desktop) */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* SHOP INFORMATION CARD */}
                  <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
                    
                    {/* Title & Verified Badge + Report Option */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{info.name}</h1>
                        <span className="flex items-center gap-1.5 rounded-full bg-[#16a34a] px-3 py-1 text-xs font-bold text-white shadow-sm">
                          <FaCheckCircle className="text-white/90" /> Verified
                        </span>
                      </div>
                      
                      <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                        title="Report this garage to platform moderation"
                      >
                        <FontAwesomeIcon icon={faFlag} className="text-red-500 text-xs" />
                        <span>Report Garage</span>
                      </button>
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
                        <span key={`sc-${idx}`} className="rounded-full bg-green-50 px-4 py-1.5 text-[13px] font-bold text-green-700 border border-green-100">
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

                    {/* Tow Truck Banner */}
                    {info.carriageService == 1 && (
                      <div className="mt-6 flex items-center gap-4 rounded-xl bg-green-50 border border-green-100/80 px-5 py-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100/80">
                          <FaTruckPickup className="text-lg text-green-600" />
                        </div>
                        <p className="text-[14.5px] leading-relaxed text-slate-700 font-medium m-0">
                          <strong className="font-bold text-slate-900 mr-1">Pickup Available.</strong>
                          We offer tow truck transport and pickup services for all supported vehicle types.
                        </p>
                      </div>
                    )}

                    {/* Description */}
                    <p className="mt-6 text-[15px] leading-relaxed text-slate-600 m-0">
                      {info.description || "No description provided."}
                    </p>

                    {/* Info Grid */}
                    <div className="mt-8 mb-8 border-t border-slate-100 pt-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-6 items-start">
                        
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
                          <div className={`h-2.5 w-2.5 rounded-full ${info.isAvailable ? 'bg-green-600' : 'bg-red-500'}`}></div>
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
                            <span>Everyday {info.openTime.substring(0, 5)} - {info.closeTime.substring(0, 5)}</span>
                          </div>
                        </div>

                        {/* Col 1 & 2: Address */}
                        <div className="md:col-span-2 flex items-start gap-2.5">
                          <FaMapMarkerAlt className="text-red-600 mt-0.5 text-[18px] shrink-0" />
                          <p className={`text-[15px] pr-6 leading-snug m-0 ${!isFullyUnlocked ? "text-slate-500 font-medium italic" : "text-slate-700 font-medium"}`}>
                            {info.location}
                          </p>
                        </div>

                        {/* Col 3: Phone */}
                        <div className="col-span-1 flex items-start gap-3">
                          <FaPhoneAlt className="text-slate-700 mt-0.5 text-[17px] shrink-0" />
                          <div>
                            <p className={`text-[15px] leading-snug m-0 ${!isFullyUnlocked ? "text-slate-500 font-medium italic" : "text-slate-800 font-bold tracking-wide"}`}>
                              {info.phone}
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-6 border-t border-slate-100">
                      <div className="rounded-xl border border-slate-200 bg-white p-4.5 flex flex-col justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 mb-3">
                          <FaWrench className="text-green-600 text-lg" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-extrabold text-slate-900 leading-none mb-1">{stats.jobsCompleted}</h3>
                          <p className="text-xs font-medium text-slate-500 m-0">Jobs Completed</p>
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4.5 flex flex-col justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 mb-3">
                          <FaStar className="text-green-600 text-lg" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-extrabold text-slate-900 leading-none mb-1">{stats.averageRating}</h3>
                          <p className="text-xs font-medium text-slate-500 m-0">Rating</p>
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4.5 flex flex-col justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 mb-3">
                          <FaShieldAlt className="text-green-600 text-lg" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-extrabold text-slate-900 leading-none mb-1">{stats.yearsExperience}</h3>
                          <p className="text-xs font-medium text-slate-500 m-0">Years Experience</p>
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4.5 flex flex-col justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 mb-3">
                          <FaSmile className="text-green-600 text-lg" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-extrabold text-slate-900 leading-none mb-1">{stats.completionRate}</h3>
                          <p className="text-xs font-medium text-slate-500 m-0">Completion</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* OUR SERVICES SECTION */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-slate-900 m-0">Our Services</h2>
                    </div>
                    
                    {services && services.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {services.map((service, index) => (
                          <div key={index} className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-green-300 hover:shadow-md">
                            
                            {/* Top Section: Icon, Name & Category */}
                            <div>
                              <div className="flex items-start gap-2.5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 border border-green-100/60 mt-0.5">
                                  <FaWrench className="text-xs text-green-600" />
                                </div>
                                
                                <div className="flex flex-col min-w-0 flex-1">
                                  {service.category && (
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded w-fit mb-1 border border-green-100">
                                      {service.category}
                                    </span>
                                  )}
                                  <h3 className="text-[14px] leading-snug font-bold text-slate-900 break-words m-0">
                                    {service.name}
                                  </h3>
                                </div>
                              </div>

                              {/* Starting Price Banner */}
                              <div className="mt-2">
                                <span className="text-xs font-extrabold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-md inline-block">
                                  from {service.price}
                                </span>
                              </div>
                            </div>

                            {/* Bottom Section: Duration */}
                            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <FaClock className="text-slate-400 text-xs shrink-0" />
                              <span>{service.duration}</span>
                            </div>
                            
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500">
                        <FaWrench className="text-2xl text-slate-300 mb-2" />
                        <p className="text-sm font-semibold text-slate-700 m-0">No Services Listed Yet</p>
                        <p className="text-xs text-slate-400 mt-1 m-0">This workshop has not added specific services to their menu yet.</p>
                      </div>
                    )}
                  </div>

                </div>

                {/* RIGHT SIDEBAR COLUMN (Span 1 on Desktop) */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* 1. Book a Service Card */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold text-slate-900 m-0">Book a Service</h3>
                    {shopCategories?.includes("Spare Parts") ? (
                      <div className="space-y-3 mt-4">
                        <button 
                          disabled 
                          className="w-full rounded-xl bg-slate-100 py-3 text-slate-400 font-semibold cursor-not-allowed border border-slate-200 transition text-sm"
                        >
                          Service Unavailable
                        </button>
                        <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl">
                          <p className="text-xs text-amber-700 leading-snug m-0">
                            <strong className="font-bold">Note:</strong> Online service requests are not available for retail Spare Parts shops. Please contact the shop directly for part inquiries.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="w-full rounded-xl bg-green-600 py-3 text-white font-bold hover:bg-green-700 transition shadow-sm active:scale-95 text-sm cursor-pointer mt-4"
                      >
                        Request Service
                      </button>
                    )}
                  </div>

                  {/* 2. Shop Location Card */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold text-slate-900 m-0">Shop Location</h3>
                    <div className="overflow-hidden rounded-xl bg-slate-100 relative group border border-slate-200">
                      <iframe 
                        title="shop-location" 
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(info.mapQuery)}&t=&z=${isFullyUnlocked ? 15 : 14}&ie=UTF8&iwloc=&output=embed`} 
                        className="h-56 w-full" 
                        loading="lazy"
                      />
                      {!isFullyUnlocked && (
                        <div 
                           className="absolute inset-0 z-10 bg-transparent cursor-not-allowed" 
                           title="Complete booking to unlock interactive map"
                        ></div>
                      )}
                    </div>
                    
                    <button 
                      disabled={!isFullyUnlocked} 
                      onClick={handleGetDirections}
                      className={`mt-4 w-full rounded-xl py-3 font-bold text-sm transition cursor-pointer ${isFullyUnlocked ? 'bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}
                    >
                      {isFullyUnlocked ? "Get Directions" : "Directions Locked"}
                    </button>
                  </div>

                  {/* 3. Why Choose Us Card */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold text-slate-900 m-0">Why Choose Us?</h3>
                    <div className="space-y-3.5 text-xs sm:text-sm">
                      <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-green-600 text-base shrink-0" />
                        <span className="font-semibold text-slate-700">Certified Technicians</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-green-600 text-base shrink-0" />
                        <span className="font-semibold text-slate-700">Modern Diagnostics</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-green-600 text-base shrink-0" />
                        <span className="font-semibold text-slate-700">Transparent Pricing</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* FULL-WIDTH CUSTOMER REVIEWS SECTION (Spans 100% of container width on desktop) */}
              <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-2xl font-bold text-slate-900 m-0">Customer Reviews</h2>
                      {stats.averageRating && (
                        <span className="inline-flex items-center gap-1 text-sm font-extrabold text-slate-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                          {stats.averageRating} <FaStar className="text-yellow-500 text-xs" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-500 mt-1 m-0">
                      Based on {stats.reviewCount} {stats.reviewCount === 1 ? "review" : "reviews"} • {stats.recommendPercentage}% recommend
                    </p>
                  </div>
                  
                  {/* Sort Dropdown */}
                  <select 
                    value={activeSort} 
                    onChange={(e) => setActiveSort(e.target.value)} 
                    className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 focus:border-green-500 outline-none cursor-pointer bg-white shadow-2xs self-start sm:self-auto"
                  >
                    <option>Most Recent</option>
                    <option>Highest Rated</option>
                    <option>Lowest Rated</option>
                  </select>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2">
                  {["All", "5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"].map(filter => (
                    <button 
                      key={filter} 
                      onClick={() => setActiveFilter(filter)}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${activeFilter === filter ? 'bg-green-600 text-white border-transparent shadow-xs' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                      {filter === "All" ? `All (${stats.reviewCount})` : filter}
                    </button>
                  ))}
                </div>

                {/* Filtered Reviews Output */}
                {processedReviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-1">
                    {processedReviews.map((review, i) => (
                      <div key={i} className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition-all">
                        <div>
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white shrink-0">
                                {review.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                              </div>
                              <div>
                                <p className="font-bold text-sm text-slate-900 m-0">{review.name}</p>
                                <div className="mt-0.5 flex items-center gap-0.5 text-yellow-400 text-xs">
                                  {Array.from({ length: parseInt(review.rating) }).map((_, index) => (
                                    <FontAwesomeIcon key={index} icon={faStar} />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs font-medium text-slate-400 shrink-0">{review.date}</span>
                          </div>
                          <p className="text-xs leading-relaxed text-slate-600 m-0">{review.summary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-medium text-slate-500 m-0">No reviews match this filter.</p>
                  </div>
                )}
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
                    src={`${UPLOADS_URL}/${imgUrl.replace(/\\/g, '/')}`} 
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

      
      {/* REPORT GARAGE MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-150 relative">
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faFlag} className="text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 m-0">Report {info?.name || "Garage"}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 m-0">Submit a flag to FixGo Platform Moderation</p>
                </div>
              </div>
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 bg-transparent border-none cursor-pointer"
              >
                <FontAwesomeIcon icon={faTimes} className="text-lg" />
              </button>
            </div>

            {reportSuccessMsg && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold p-3 rounded-xl flex items-center gap-2">
                <FontAwesomeIcon icon={faCheck} className="text-green-600" />
                {reportSuccessMsg}
              </div>
            )}

            {reportErrorMsg && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-xl flex items-center gap-2">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500" />
                {reportErrorMsg}
              </div>
            )}

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Category</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-green-500 bg-white font-sans"
                >
                  <option value="PROFILE FLAG">Garage Profile / Compliance Issue</option>
                  <option value="REVIEW REPORT">Fraudulent or Misleading Information</option>
                  <option value="FRAUD SIGNAL">Overcharging / Service Misconduct</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Details & Description *</label>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Explain what happened or why this garage is being reported..."
                  rows={4}
                  required
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-green-500 resize-none font-sans"
                />
              </div>

              <div className="flex gap-2.5 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  disabled={submittingReport}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReport}
                  className="px-4 py-2 text-xs font-bold rounded-xl border-none bg-red-600 hover:bg-red-700 text-white cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  {submittingReport ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faFlag} />}
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ServiceRequestModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    shop={shop}
    distance={passedDistance}
    initialNeedsTow={false}
    onTrackRequest={(requestId) => {
        setIsModalOpen(false);
        navigate("/services", { state: { navigateTo: "repair", requestId } });
    }}
/>
      <Footer />
    </>
  );
}

export default ShopDetails;
