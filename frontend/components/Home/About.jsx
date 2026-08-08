import { useState, useEffect } from "react";
import { api } from "../../src/services/api";
import {
    HiOutlineShieldCheck,
    HiOutlineUserGroup,
    HiOutlineMapPin,
    HiStar,
    HiOutlineMap,
    HiOutlineWrench,
    HiOutlineMagnifyingGlass,
    HiOutlineCalendar
} from "react-icons/hi2";

const About = () => {
    const [stats, setStats] = useState({
        verifiedGarages: "...",
        successfulBookings: "...",
        averageRating: "..."
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.getPublic('home/getHomeStats.php');
                if (res?.success && res.data) {
                    setStats(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch home stats:", error);
                // Fallback to static values if API fails
                setStats({
                    verifiedGarages: "500+",
                    successfulBookings: "12,000+",
                    averageRating: "4.8"
                });
            }
        };
        fetchStats();
    }, []);

    const testimonials = [
        {
            id: 1,
            name: "Nuwan Perera",
            location: "Colombo",
            stars: 5,
            text: "Found a great garage near me in minutes. The booking process was super easy!",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
        },
        {
            id: 2,
            name: "Dilini Fernando",
            location: "Kandy",
            stars: 5,
            text: "Excellent service and transparent pricing. Highly recommended FixGo!",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
        },
        {
            id: 3,
            name: "Tharindu Silva",
            location: "Galle",
            stars: 5,
            text: "Their roadside assistance saved me during an emergency. Very professional!",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
        }
    ];

    // Create a 3x extended array for smooth loop boundaries
    const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials];

    // Initial index starts at the middle set's first element
    const [activeIndex, setActiveIndex] = useState(3);
    const [isMobile, setIsMobile] = useState(false);

    // Track mobile responsiveness for carousel translation
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Auto-play interval: rotates testimonials every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prevIndex) => {
                if (prevIndex === 5) return 3; // Loop back to the middle T1
                return prevIndex + 1;
            });
        }, 5000);
        
        return () => clearInterval(timer);
    }, []);

    const handleDotClick = (index) => {
        // Map dots 0, 1, 2 to indices 3, 4, 5 in the extended array
        setActiveIndex(index + 3);
    };

    // Calculate translation based on viewport size
    const getTransformStyle = () => {
        if (isMobile) {
            // Slide width: 80% on mobile. Center offset: 10%
            return `translateX(calc(-${activeIndex * 80}% + 10%))`;
        } else {
            // Slide width: 33.333% on desktop. Centers activeIndex by shifting left by (activeIndex - 1) cards
            return `translateX(-${(activeIndex - 1) * 33.3333}%)`;
        }
    };

    return (
        <section className="w-full max-screen mx-auto px-4 md:px-10 mt-20 ">
            {/* 1. Statistics Strip */}
            <div className="bg-green-100 border border-[#e2e8f0] rounded-2xl py-8 px-6 md:px-16 md:py-20 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 items-start">
                {/* Stat 1 */}
                <div className="flex items-center gap-4 justify-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#f0fdf4] text-green-500 shrink-0">
                        <HiOutlineShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-2xl md:text-3xl font-mono font-semibold text-gray-900 leading-none">
                            {stats.verifiedGarages === "..." ? "..." : `${stats.verifiedGarages}+`}
                        </span>
                        <span className="text-xs md:text-sm text-gray-500 font-mono font-semibold mt-1">Verified Garages</span>
                    </div>
                </div>

                {/* Stat 2 */}
                <div className="flex items-center gap-4 justify-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#f0fdf4] text-green-500  shrink-0">
                        <HiOutlineUserGroup className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-2xl md:text-3xl font-mono font-semibold text-gray-900 leading-none">
                            {stats.successfulBookings === "..." ? "..." : `${Number(stats.successfulBookings).toLocaleString()}+`}
                        </span>
                        <span className="text-xs md:text-sm text-gray-500 font-mono font-semibold mt-1">Successful Bookings</span>
                    </div>
                </div>

                {/* Stat 3 */}
                <div className="flex items-center gap-4 justify-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#f0fdf4] text-green-500  shrink-0">
                        <HiOutlineMapPin className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-2xl md:text-3xl font-mono font-semibold text-gray-900 leading-none">Across</span>
                        <span className="text-xs md:text-sm text-gray-500 font-mono font-semibold mt-1">Western Province</span>
                    </div>
                </div>

                {/* Stat 4 */}
                <div className="flex items-center gap-4 justify-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#f0fdf4] text-green-500  shrink-0">
                        <HiStar className="w-6 h-6 text-[#16a34a]" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-2xl md:text-3xl font-mono font-semibold text-gray-900 leading-none">
                            {stats.averageRating} <span className="text-sm font-normal text-gray-400">/ 5</span>
                        </span>
                        <span className="text-xs md:text-sm text-gray-500 font-mono font-semibold mt-1">Average Rating</span>
                    </div>
                </div>
            </div>

            {/* 2. Popular Services Title & Subtitle */}
            <div className="text-center mt-10 mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-wider">Popular Services</h2>
                <p className="text-gray-500 font-mono font-semibold text-sm mt-3">Explore our most in-demand vehicle services</p>
            </div>

            {/* 3. Popular Services Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="bg-white border border-[#f1f5f9] rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center justify-center">
                    <div className="mb-6 text-green-500 ">
                        <HiOutlineMap className="w-16 h-16" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Find Nearest Garage</h3>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-[240px]">
                        Locate trusted garages near you in seconds.
                    </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white border border-[#f1f5f9] rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center justify-center">
                    <div className="mb-6 text-green-500 ">
                        <HiOutlineWrench className="w-16 h-16" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Find Quick Spare Parts</h3>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-[240px]">
                        Find the right spare parts quickly and easily.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white border border-[#f1f5f9] rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center justify-center">
                    <div className="mb-6 text-green-500 ">
                        <HiOutlineShieldCheck className="w-16 h-16" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Find Reliable Service Centers</h3>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-[240px]">
                        Connect with reliable service centers for quality care.
                    </p>
                </div>
            </div>

            {/* 4. How FixGo Works Section */}
            <div className="text-center mt-10 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-wider">How FixGo Works</h2>
                <p className="text-gray-500 font-mono font-semibold text-sm mt-3">Simple steps to get your vehicle fixed</p>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-4 max-w-7xl mx-auto px-4 mb-20">
                {/* Step 1 */}
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative shrink-0">
                        {/* Number Badge */}
                        <span className="absolute -left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-[#16a34a] text-white text-xs font-bold border-2 border-white shadow-sm">
                            1
                        </span>
                        {/* Main Circle Icon */}
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#f0fdf4] border border-[#d1e7d7] text-[#16a34a] shadow-sm">
                            <HiOutlineMagnifyingGlass className="w-8 h-8" />
                        </div>
                    </div>
                    <div className="flex flex-col text-left">
                        <h4 className="font-bold text-gray-900 text-base">Search</h4>
                        <p className="text-gray-500 text-xs mt-1 max-w-[160px] leading-relaxed">Find and compare verified garages</p>
                    </div>
                </div>

                {/* Arrow 1 */}
                <div className="hidden lg:flex items-center justify-center shrink-0">
                    <svg className="w-12 h-6 text-[#16a34a]/30" fill="none" stroke="currentColor" viewBox="0 0 48 24">
                        <path strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h36M32 6l6 6-6 6" />
                    </svg>
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative shrink-0">
                        {/* Number Badge */}
                        <span className="absolute -left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-[#16a34a] text-white text-xs font-bold border-2 border-white shadow-sm">
                            2
                        </span>
                        {/* Main Circle Icon */}
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#f0fdf4] border border-[#d1e7d7] text-[#16a34a] shadow-sm">
                            <HiOutlineCalendar className="w-8 h-8" />
                        </div>
                    </div>
                    <div className="flex flex-col text-left">
                        <h4 className="font-bold text-gray-900 text-base">Book</h4>
                        <p className="text-gray-500 text-xs mt-1 max-w-[160px] leading-relaxed">Choose a time and book your service</p>
                    </div>
                </div>

                {/* Arrow 2 */}
                <div className="hidden lg:flex items-center justify-center shrink-0">
                    <svg className="w-12 h-6 text-[#16a34a]/30" fill="none" stroke="currentColor" viewBox="0 0 48 24">
                        <path strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h36M32 6l6 6-6 6" />
                    </svg>
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative shrink-0">
                        {/* Number Badge */}
                        <span className="absolute -left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-[#16a34a] text-white text-xs font-bold border-2 border-white shadow-sm">
                            3
                        </span>
                        {/* Main Circle Icon */}
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#f0fdf4] border border-[#d1e7d7] text-[#16a34a] shadow-sm">
                            <HiOutlineWrench className="w-8 h-8" />
                        </div>
                    </div>
                    <div className="flex flex-col text-left">
                        <h4 className="font-bold text-gray-900 text-base">Get It Fixed</h4>
                        <p className="text-gray-500 text-xs mt-1 max-w-[160px] leading-relaxed">Experts fix your vehicle with quality care</p>
                    </div>
                </div>

                {/* Arrow 3 */}
                <div className="hidden lg:flex items-center justify-center shrink-0">
                    <svg className="w-12 h-6 text-[#16a34a]/30" fill="none" stroke="currentColor" viewBox="0 0 48 24">
                        <path strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h36M32 6l6 6-6 6" />
                    </svg>
                </div>

                {/* Step 4 */}
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative shrink-0">
                        {/* Number Badge */}
                        <span className="absolute -left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-[#16a34a] text-white text-xs font-bold border-2 border-white shadow-sm">
                            4
                        </span>
                        {/* Main Circle Icon */}
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#f0fdf4] border border-[#d1e7d7] text-[#16a34a] shadow-sm">
                            <HiOutlineShieldCheck className="w-8 h-8" />
                        </div>
                    </div>
                    <div className="flex flex-col text-left">
                        <h4 className="font-bold text-gray-900 text-base">Drive With Confidence</h4>
                        <p className="text-gray-500 text-xs mt-1 max-w-[160px] leading-relaxed">Safe rides, every time</p>
                    </div>
                </div>
            </div>

            {/* 5. What Our Customers Say Section */}
            <div className="text-center mt-24 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-wider">What Our Customers Say</h2>
            </div>

            {/* Testimonials Carousel Container */}
            <div className="relative w-full max-w-7xl mx-auto overflow-hidden px-4 mb-4">
                <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: getTransformStyle() }}
                >
                    {extendedTestimonials.map((t, idx) => {
                        const isCenter = idx === activeIndex;
                        return (
                            <div 
                                key={idx} 
                                className={`w-[80%] md:w-1/3 shrink-0 px-3 transition-all duration-500 ${
                                    isCenter ? 'opacity-100 scale-100 z-10' : 'opacity-60 scale-95 z-0'
                                }`}
                            >
                                <div className={`h-full border rounded-3xl p-8 shadow-sm transition-all duration-500 flex flex-col justify-between items-start text-left min-h-[240px] ${
                                    isCenter ? 'bg-white border-[#16a34a] shadow-md' : 'bg-white border-[#f1f5f9]'
                                }`}>
                                    <div>
                                        <div className="flex gap-1 text-yellow-400 mb-4">
                                            <HiStar className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            <HiStar className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            <HiStar className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            <HiStar className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            <HiStar className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-6 font-sans">
                                            &ldquo;{t.text}&rdquo;
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={t.avatar} 
                                            alt={t.name} 
                                            className="w-12 h-12 rounded-full object-cover border-2 border-green-500/10" 
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 text-sm">{t.name}</span>
                                            <span className="text-gray-400 text-xs">{t.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Carousel Indicator Dots */}
            <div className="flex justify-center gap-3 mt-8 mb-20">
                {testimonials.map((_, idx) => {
                    const isActive = (activeIndex % 3) === idx;
                    return (
                        <button
                            key={idx}
                            onClick={() => handleDotClick(idx)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                                isActive ? 'bg-[#16a34a] scale-125' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    );
                })}
            </div>
        </section>
    );
};

export default About;