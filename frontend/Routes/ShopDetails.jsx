import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ServiceRequestModal } from "../components/ShopDetails/ServiceRequestForm";
import { FaWrench } from "react-icons/fa";
import { api } from "../src/services/api";

import { ShopGallery } from "../components/ShopDetails/ShopGallery";
import { ShopInfo } from "../components/ShopDetails/ShopInfo";
import { ShopServices } from "../components/ShopDetails/ShopServices";
import { ShopSidebar } from "../components/ShopDetails/ShopSidebar";
import { ShopReviews } from "../components/ShopDetails/ShopReviews";

function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const locationData = useLocation();
  // Check if we passed a distance. If they visited the URL directly, it gracefully falls back to null.
  const passedDistance = locationData.state?.distance;

  // State for our Safety Nets and Data
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for Review Filtering
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSort, setActiveSort] = useState("Most Recent");

  // API Fetching Effect
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

  // Review Filtering & Sorting Engine
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

  // Strip out empty or null strings from the database array so Swiper only gets real URLs!
  const validGallery = gallery?.filter(imgUrl => imgUrl && imgUrl.trim() !== '') || [];

  // A single variable to control all UI locks!
  const isFullyUnlocked = isHandshakeComplete || shopCategories?.includes("Spare Parts");

  // Google Maps Navigation Handler
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
            {/* IMAGE GALLERY SECTION */}
            <ShopGallery validGallery={validGallery} />

            <div className="space-y-8 px-4 pb-6 pt-4 sm:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* LEFT COLUMN (Span 2 on Desktop) */}
                <div className="lg:col-span-2 space-y-8">
                  <ShopInfo
                    info={info}
                    stats={stats}
                    shopCategories={shopCategories}
                    vehicleCategories={vehicleCategories}
                    passedDistance={passedDistance}
                    isFullyUnlocked={isFullyUnlocked}
                  />
                  <ShopServices services={services} />
                </div>

                {/* RIGHT SIDEBAR COLUMN (Span 1 on Desktop) */}
                <ShopSidebar
                  shopCategories={shopCategories}
                  isFullyUnlocked={isFullyUnlocked}
                  info={info}
                  handleGetDirections={handleGetDirections}
                  setIsModalOpen={setIsModalOpen}
                />
              </div>

              {/* FULL-WIDTH CUSTOMER REVIEWS SECTION */}
              <ShopReviews
                stats={stats}
                activeSort={activeSort}
                setActiveSort={setActiveSort}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                processedReviews={processedReviews}
              />
            </div>
          </div>
        </div>
      </main>

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
