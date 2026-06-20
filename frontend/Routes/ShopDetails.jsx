import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { faArrowLeft, faStar, faLock, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { ServiceRequestModal } from "../components/ShopDetails/ServiceRequestForm";
import { FaWrench, FaStar, FaShieldAlt, FaSmile, FaClock, FaMapMarkerAlt, FaPhoneAlt, FaCheckCircle, FaTruckPickup } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";



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

  // NEW: API Fetching Effect
  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        setLoading(true);
        // Retrieve your JWT token from where you store it upon login
        const token = localStorage.getItem('jwt_token'); 

        const response = await fetch(`http://localhost:8000/api/getShopDetails.php?id=${id}`, {
          method: 'GET',
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

  return (
    <>
      <NavBar />

      <main className="min-h-screen bg-[#f7fbf8] pt-3 pb-10">
        <div className="mx-auto w-full max-w-screen-2xl px-6">

          <button
            onClick={() => navigate(-1)}
            className="group mb-5 flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-x-1 hover:border-green-500 hover:text-green-600 hover:shadow-md"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Results
          </button>

          <div className="overflow-hidden bg-white">
            <div className="overflow-hidden">
              <div className="relative overflow-hidden bg-slate-100 rounded-t-2xl">
                
                {/* SAFETY NET: Handle shops with no images */}
                {gallery && gallery.length > 0 ? (
                  <Swiper
                    modules={[Pagination, Navigation]}
                    pagination={{ clickable: true }}
                    navigation={true}
                    slidesPerView={1}
                    onSlideChange={(swiper) => setCurrentImage(swiper.activeIndex)}
                  >
                    {gallery.map((imgUrl, index) => (
                      <SwiperSlide key={index}>
                        <div className="h-[220px] sm:h-[280px] lg:h-[320px]">
                          <img src={`http://localhost:8000/${imgUrl}`} alt="Shop Gallery" className="h-full w-full object-cover" />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="h-[220px] sm:h-[280px] lg:h-[320px] flex items-center justify-center text-slate-400">
                    <p>No images available</p>
                  </div>
                )}
              </div>
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
                        <p className={`text-[15px] pr-6 leading-snug ${!isHandshakeComplete ? "text-slate-500 font-medium italic" : "text-slate-700 font-medium"}`}>
                          {info.location}
                        </p>
                      </div>

                      {/* Col 3: Phone (Aligns perfectly under the schedule) */}
                      <div className="col-span-1 flex items-start gap-3">
                        <FaPhoneAlt className="text-slate-700 mt-0.5 text-[17px] shrink-0" />
                        <div>
                          <p className={`text-[15px] leading-snug ${!isHandshakeComplete ? "text-slate-500 font-medium italic" : "text-slate-800 font-bold tracking-wide"}`}>
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
                    <button onClick={() => setIsModalOpen(true)} className="w-full rounded-xl bg-green-600 py-3 text-white font-semibold hover:bg-green-700 transition">
                      Request Service
                    </button>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="mb-4 text-lg font-bold">Shop Location</h3>
                    <div className="overflow-hidden rounded-xl bg-slate-200 relative group">
                      <iframe 
                        title="shop-location" 
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(info.mapQuery)}&t=&z=${isHandshakeComplete ? 15 : 14}&ie=UTF8&iwloc=&output=embed`} 
                        className="h-56 w-full" 
                        loading="lazy"
                      />
                      
                      {/* INVISIBLE SHIELD: Blocks all mouse clicks & dragging if locked */}
                      {!isHandshakeComplete && (
                        <div 
                           className="absolute inset-0 z-10 bg-transparent cursor-not-allowed" 
                           title="Complete booking to unlock interactive map"
                        ></div>
                      )}
                    </div>
                    
                    <button disabled={!isHandshakeComplete} className={`mt-4 w-full rounded-xl py-3 font-semibold transition ${isHandshakeComplete ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}>
                      {isHandshakeComplete ? "Get Directions" : "Directions Locked"}
                    </button>
                  </div>
                </div>
              </div>

              {/* SERVICES AND REVIEWS SECTION */}
              <div className="grid gap-8 xl:grid-cols-[1.4fr,0.9fr]">
                <div className="space-y-8">
                  
                  <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
                    {/* Services Box */}
                    <div className="rounded-xl border border-[#d1e7d7] bg-white p-5 shadow-sm">
                      <h2 className="text-2xl font-bold text-[#0f172a] mb-5">Our Services</h2>
                      
                      {services && services.length > 0 ? (
                        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          {services.map((service, index) => (
                            <div key={index} className="rounded-xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-md">
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 shrink-0">
                                  <FaWrench className="text-lg text-green-600" />
                                </div>
                                <div>
                                  <h3 className="text-sm font-semibold text-slate-800 leading-5">{service.name}</h3>
                                  <p className="mt-1 text-sm font-semibold text-green-600">from {service.price}</p>
                                </div>
                              </div>
                              <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                                <FaClock /><span>{service.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500">No specific services listed yet.</p>
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

      <ServiceRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} shop={shop} distance={passedDistance} initialNeedsTow={false} />
      <Footer />
    </>
  );
}

export default ShopDetails;