import { useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import { Pagination, Navigation } from "swiper/modules";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ServiceRequestModal } from "../components/ShopDetails/ServiceRequestForm";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  faChevronRight,
  faCheckCircle,
  faClock,
  faMapMarkerAlt,
  faPhone,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shop = useMemo(
    () => ({
      id: id,
      category_id: 2,
      has_tow_service: 1,
      default_truck_brand: "Isuzu NPR",
      tow_truck_plate: "WP-TOW-1234",
      name: "AutoCare Pro Service Center",
      category: "Vehicle Service Center",
      verified: true,
      location: "47/B, Industrial Zone Road, Colombo 10, Sri Lanka",
      rating: 4.3,
      reviewCount: 4,
      status: "Open Now",
      closesAt: "7:00 PM",
      distance: "2.4 km away",
      phone: "+94 11 234 5678",
      description:
        "AutoCare Pro is a fully equipped, certified vehicle service center offering fast, reliable repairs and maintenance for all car makes and models. Trusted by thousands of customers for quality workmanship and honest pricing.",
    gallery: [
  "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80",
  "https://plus.unsplash.com/premium_photo-1661373022510-dfd61512e080?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YXV0b21vdGl2ZSUyMHNlcnZpY2V8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1632823469850-2f77dd9c7f93?auto=format&fit=crop&w=1200&q=80",
],
      services: [
        { name: "Engine Oil Change", price: "$25" },
        { name: "Full Vehicle Inspection", price: "$35" },
        { name: "AC Service & Regas", price: "$55" },
        { name: "Transmission Service", price: "$120" },
        { name: "Radiator Flush & Fill", price: "$45" },
        { name: "Wheel Alignment & Balancing", price: "$40" },
        { name: "Brake Pad Replacement", price: "$60" },
        { name: "Battery Replacement", price: "$80" },
        { name: "Tyre Replacement (per tyre)", price: "$70" },
        { name: "Windshield Repair", price: "$30" },
      ],
      hours: [
        { day: "Mon - Sat", time: "8:00 AM - 7:00 PM" },
        { day: "Sun", time: "9:00 AM - 4:00 PM" },
      ],
      reviewBreakdown: [
        { stars: 5, count: 2 },
        { stars: 4, count: 1 },
        { stars: 3, count: 1 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
      ],
      reviews: [
        {
          name: "Kasun Perera",
          rating: 5,
          date: "Jun 10, 2026",
          summary: "Excellent service! The team was professional and completed the oil change quickly.",
        },
        {
          name: "Rajan Fernando",
          rating: 5,
          date: "May 28, 2026",
          summary: "Very honest and transparent. They showed me exactly what needed replacing before doing any work.",
        },
        {
          name: "Amali Jayawardena",
          rating: 3,
          date: "May 20, 2026",
          summary: "Service was decent but had to wait a bit longer than quoted. The staff were friendly though.",
        },
      ],
    }),
    [id]
  );

  return (
    <>
      <NavBar />

      <main className="min-h-screen bg-[#f7fbf8] pt-3 pb-10">
        <div className="mx-auto w-full max-w-screen-2xl px-6">

    <button
  onClick={() => navigate(-1)}
  className="group mb-5 flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-x-1 hover:border-green-500 hover:text-green-600 hover:shadow-md"
>
  <FontAwesomeIcon
    icon={faArrowLeft}
    className="transition-transform duration-200 group-hover:-translate-x-1"
  />
  Back to Results
</button>

    <div className="overflow-hidden bg-white"></div>
          <div className="overflow-hidden bg-white">
            <div className="overflow-hidden">
<div className="relative overflow-hidden">
  <Swiper
    modules={[Pagination, Navigation]}
    pagination={{ clickable: true }}
    navigation={true}
    slidesPerView={1}
    onSlideChange={(swiper) => setCurrentImage(swiper.activeIndex)}
  >
    {shop.gallery.map((image, index) => (
      <SwiperSlide key={index}>
        <div className="h-[220px] sm:h-[280px] lg:h-[320px]">
          <img
            src={image}
            alt={`Shop ${index + 1}`}
            className="h-full w-full object-cover"
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>

  <div className="absolute bottom-4 right-4 z-10 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
    {currentImage + 1} / {shop.gallery.length}
  </div>
</div>
</div>

            <div className="space-y-6 px-4 pb-6 pt-4 sm:px-6">
            <div className="bg-white p-3 md:p-4">
  <div className="flex flex-wrap items-center gap-2">
    <h1 className="text-xl md:text-2xl font-bold text-slate-900">
      {shop.name}
    </h1>

    <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs text-white">
      ✓ Verified
    </span>
  </div>

  <p className="mt-1 text-base text-slate-500">
    {shop.category}
  </p>
  <div className="mt-2 flex flex-wrap gap-2">
  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
    3-Wheelers
  </span>

  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
    4-Wheelers
  </span>

  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
    Commercial Vehicles
  </span>
</div>

  <p className="mt-3 max-w-6xl text-sm leading-6 text-slate-600">
    {shop.description}
  </p>

  <div className="mt-3 flex flex-wrap items-center gap-3 text-base">
    <span className="text-slate-600">
      📍 {shop.distance}
    </span>

    <span className="font-semibold text-green-600">
      ● {shop.status}
    </span>

    <span className="text-slate-600">
      Closes at {shop.closesAt}
    </span>
  </div>

  <div className="mt-2 text-sm text-slate-600">
    🕒 Mon – Sat 8:00 AM – 7:00 PM | Sun 9:00 AM – 4:00 PM
  </div>

  <div className="mt-4 flex flex-col gap-3 border-t border-gray-200 pt-4 md:flex-row md:items-center md:justify-between">
    <div>
      <p className="text-base text-slate-700">
        📍 {shop.location}
      </p>

      <p className="mt-1 text-base font-semibold text-green-600">
        ☎ {shop.phone}
      </p>
    </div>

  <button 
  onClick={() => setIsModalOpen(true)}
  className="w-56 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-green-200 transition-all duration-300 hover:scale-105 hover:shadow-xl">
  Book Now →
</button>
  </div>
</div>
              <div className="grid gap-8 xl:grid-cols-[1.4fr,0.9fr]">
                <div className="space-y-8">
                  <div className="rounded-[28px] border border-[#d1e7d7] bg-white p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-[#0f172a]">Our Services</h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {shop.services.map((service) => (
                        <div key={service.name} className="flex items-center justify-between rounded-xl bg-[#f3f4f6] px-4 py-4">
                          <span className="text-sm text-[#334155]">{service.name}</span>
                          <span className="text-sm font-semibold text-[#16a34a]">from {service.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-[#d1e7d7] bg-[#f8faf7] p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-[#0f172a]">Customer Reviews</h2>
                    <div className="mt-6 grid gap-6 rounded-[24px] bg-white p-6 shadow-sm">
                      <div className="grid gap-4 lg:grid-cols-[1fr,0.9fr]">
                        <div>
                          <p className="text-4xl font-bold text-[#0f172a]">{shop.rating.toFixed(1)}</p>
                          <div className="mt-2 flex items-center gap-2 text-sm text-[#475569]">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <FontAwesomeIcon
                                key={index}
                                icon={faStar}
                                className={`text-sm ${index < Math.round(shop.rating) ? "text-[#f59e0b]" : "text-slate-300"}`}
                              />
                            ))}
                            <span>{shop.reviewCount} reviews</span>
                          </div>
                        </div>
                        <div className="space-y-3 text-sm text-[#475569]">
                          {shop.reviewBreakdown.map((row) => (
                            <div key={row.stars} className="flex items-center gap-4">
                              <span className="w-10 font-semibold text-[#0f172a]">{row.stars} ★</span>
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e5e7eb]">
                                <div className="h-full rounded-full bg-[#16a34a]" style={{ width: `${row.count * 20}%` }} />
                              </div>
                              <span className="w-6 text-right font-semibold text-[#14532d]">{row.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 rounded-[28px] border border-[#d1e7d7] bg-white p-6 shadow-sm">
                    {shop.reviews.map((review) => (
                      <div key={review.name} className="rounded-[24px] border border-[#e5e7eb] bg-[#f8faf7] p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#16a34a] text-sm font-semibold text-white">
                              {review.name
                                .split(" ")
                                .slice(0, 2)
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-semibold text-[#0f172a]">{review.name}</p>
                              <div className="mt-2 flex items-center gap-1 text-sm text-[#f59e0b]">
                                {Array.from({ length: review.rating }).map((_, index) => (
                                  <FontAwesomeIcon key={index} icon={faStar} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-[#94a3b8]">{review.date}</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-[#475569]">{review.summary}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[28px] border border-[#d1e7d7] bg-[#f8faf7] p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-[#0f172a]">Leave a Review</h2>
                    <form className="mt-6 space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#334155]">Your Name</label>
                        <input
                          type="text"
                          placeholder="e.g. John Smith"
                          className="w-full rounded-[20px] border border-[#d1d5db] bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#16a34a]"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#334155]">Your Rating</label>
                        <div className="flex gap-2 text-2xl text-[#d1d5db]">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <button key={index} type="button" className="transition hover:text-[#f59e0b]">
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#334155]">Your Review</label>
                        <textarea
                          rows={5}
                          placeholder="Share your experience with this service center..."
                          className="w-full rounded-[20px] border border-[#d1d5db] bg-white px-4 py-4 text-sm text-[#0f172a] outline-none transition focus:border-[#16a34a]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded-[20px] bg-[#16a34a] px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#15803d]"
                      >
                        Submit Review
                      </button>
                    </form>
                  </div>
                </div>

               
              </div>
            </div>
          </div>
        </div>
      </main>
            {/* Our New Booking Modal */}
        <ServiceRequestModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          shop={shop}
          initialNeedsTow={false}
        />
      <Footer />
    </>
  );
}

export default ShopDetails;
