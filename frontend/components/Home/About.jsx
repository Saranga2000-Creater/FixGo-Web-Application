import {
    HiOutlineShieldCheck,
    HiOutlineUserGroup,
    HiOutlineMapPin,
    HiStar,
    HiOutlineMap,
    HiOutlineWrench
} from "react-icons/hi2";

const About = () => {
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
                        <span className="text-2xl md:text-3xl font-mono font-semibold text-gray-900 leading-none">500+</span>
                        <span className="text-xs md:text-sm text-gray-500 font-mono font-semibold mt-1">Verified Garages</span>
                    </div>
                </div>

                {/* Stat 2 */}
                <div className="flex items-center gap-4 justify-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#f0fdf4] text-green-500  shrink-0">
                        <HiOutlineUserGroup className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-2xl md:text-3xl font-mono font-semibold text-gray-900 leading-none">12,000+</span>
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
                        <span className="text-2xl md:text-3xl font-mono font-semibold text-gray-900 leading-none">4.8 <span className="text-sm font-normal text-gray-400">/ 5</span></span>
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
        </section>
    );
};

export default About;