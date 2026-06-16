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
      rating: 4.8,
      reviewCount: 4,
       recommendPercentage: 95,
      status: "Open Now",
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
  summary:
    "Excellent service! The team was professional and completed the oil change quickly. They also explained all the work that was carried out on my vehicle.",

  images: [
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1632823469850-2f77dd9c7f93?auto=format&fit=crop&w=800&q=80",
  ],
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
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
  
  {/* LEFT SIDE */}
  <div className="bg-white rounded-2xl p-6 border border-slate-200">

  {/* Name */}
  <div className="flex items-center gap-3">
    <h1 className="text-3xl font-bold text-slate-900">
      {shop.name}
    </h1>

    <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
      ✓ Verified
    </span>
  </div>

  {/* Rating */}
  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
    <span className="text-xl font-bold">
      {shop.rating}
    </span>

    <span className="text-yellow-500">
      ★★★★★
    </span>

    <span className="text-slate-500">
      ({shop.reviewCount} reviews)
    </span>

    <span className="text-slate-400">•</span>

    <span className="font-medium text-slate-600">
      {shop.recommendPercentage}% recommend
    </span>
  </div>

  {/* Vehicle Types */}
  <div className="mt-4 flex flex-wrap gap-2">
    <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
      3-Wheelers
    </span>

    <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
      4-Wheelers
    </span>

    <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
      Commercial Vehicles
    </span>
  </div>

  {/* Pickup Banner */}
  <div className="mt-5 flex items-center gap-3">
    <span className="text-xl">🚚</span>

    <p className="text-sm">
      Pickup available for all vehicle types.
    </p>
  </div>

  {/* Description */}
  <p className="mt-5 leading-8 text-slate-600">
    AutoCare Pro is a fully equipped, certified vehicle service center
    offering fast, reliable repairs and maintenance for all car makes
    and models. Trusted by thousands of customers for quality
    workmanship and honest pricing.
  </p>

  {/* Info Row */}
  <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-600">

    <span>
      📍 {shop.distance}
    </span>

    <span className="font-semibold text-green-600">
      ● Open Now
    </span>

    <span>
      Closes at 7:00 PM
    </span>

    <span>
      🕒 Mon - Sat 8:00 AM - 7:00 PM
    </span>
  </div>

  {/* Address & Phone */}
  <div className="mt-5 mb-10 border-t border-slate-200 pt-5">

  <div className="space-y-3">

    <div className="flex items-start gap-3">
      <span className="text-green-600">📍</span>
      <span className="text-slate-700">{shop.location}</span>
    </div>

    <div className="flex items-center gap-3">
      <span className="text-green-600">☎</span>
      <span className="font-medium text-slate-700">
        {shop.phone}
      </span>
    </div>

  </div>

</div>
<div className="grid grid-cols-2 gap-4 md:grid-cols-4">

  <div className="rounded-2xl bg-white p-6 text-center shadow-sm border border-slate-100">
    <h3 className="text-3xl font-bold text-green-600">500+</h3>
    <p className="mt-2 text-sm text-slate-500">
      Jobs Completed
    </p>
  </div>

  <div className="rounded-2xl bg-white p-6 text-center shadow-sm border border-slate-100">
    <h3 className="text-3xl font-bold text-green-600">4.8</h3>
    <p className="mt-2 text-sm text-slate-500">
      Customer Rating
    </p>
  </div>

  <div className="rounded-2xl bg-white p-6 text-center shadow-sm border border-slate-100">
    <h3 className="text-3xl font-bold text-green-600">5+</h3>
    <p className="mt-2 text-sm text-slate-500">
      Years Experience
    </p>
  </div>

  <div className="rounded-2xl bg-white p-6 text-center shadow-sm border border-slate-100">
    <h3 className="text-3xl font-bold text-green-600">98%</h3>
    <p className="mt-2 text-sm text-slate-500">
      Completion Rate
    </p>
  </div>

</div>
</div>

  {/* RIGHT SIDE */}
  <div className="space-y-5">

    {/* Book Service Card */}
    <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-10">
      <h3 className="mb-4 text-lg font-bold">
        Book a Service
      </h3>

      <button className="w-full rounded-xl bg-green-600 py-3 text-white font-semibold">
        Book Now
      </button>
    </div>

    {/* Map Card */}
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-lg font-bold">
        Shop Location
      </h3>

      {/* Map Here */}
      <div className="overflow-hidden rounded-xl">
        <iframe
          title="shop-location"
          src="https://maps.google.com/maps?q=Colombo&t=&z=13&ie=UTF8&iwloc=&output=embed"
          className="h-56 w-full"
          loading="lazy"
        />
      </div>

      <button className="mt-4 w-full rounded-xl bg-green-600 py-3 text-white font-semibold">
        Get Directions
      </button>
    </div>
  </div>
  

</div>
              <div className="grid gap-8 xl:grid-cols-[1.4fr,0.9fr]">
                <div className="space-y-8">
                  <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
                    <div className="rounded-xl border border-[#d1e7d7] bg-white p-3 shadow-sm">
  <h2 className="text-2xl font-bold text-[#0f172a]">
    Our Services
  </h2>

  <div className="mt-2 divide-y divide-slate-200">
    {shop.services.map((service) => (
      <div
  key={service.name}
  className="flex items-center justify-between py-2"
>
        <span className=" text-sm text-[#334155]">
          {service.name}
        </span>

        <span className=" text-sm font-semibold text-green-600">
          from {service.price}
        </span>
      </div>
    ))}
  </div>
</div>
<div className="rounded-2xl border border-[#d1e7d7] bg-white p-8 shadow-sm self-start">

  <h2 className="text-xl font-bold text-[#0f172a]">
    Why Choose Us?
  </h2>

  <div className="mt-4 space-y-3 text-sm">

    <div className="flex items-start gap-2">
      <span className="text-green-600 font-bold">✓</span>
      <span>Certified & Experienced Technicians</span>
    </div>

    <div className="flex items-start gap-2">
      <span className="text-green-600 font-bold">✓</span>
      <span>Modern Diagnostic Equipment</span>
    </div>

    <div className="flex items-start gap-2">
      <span className="text-green-600 font-bold">✓</span>
      <span>Transparent Pricing</span>
    </div>

    <div className="flex items-start gap-2">
      <span className="text-green-600 font-bold">✓</span>
      <span>Quick Turnaround Time</span>
    </div>

    <div className="flex items-start gap-2">
      <span className="text-green-600 font-bold">✓</span>
      <span>Customer Satisfaction Guaranteed</span>
    </div>

  </div>
</div>
                  </div>

                   <div className="rounded-2xl border border-[#d1e7d7] bg-[#f8faf7] p-4 shadow-sm">
                    <h2 className="text-xl font-bold text-[#0f172a]">Customer Reviews</h2>
                    <div className="mt-3 grid gap-4 rounded-2xl bg-white p-4 shadow-sm">
                      <div className="grid gap-4 lg:grid-cols-[1fr,0.9fr]">
                        <div>
                          <p className="text-3xl font-bold text-[#0f172a]">{shop.rating.toFixed(1)}</p>
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

                  <div className="space-y-4 rounded-2xl border border-[#d1e7d7] bg-white p-4 shadow-sm">
                    {shop.reviews.map((review) => (
                      <div key={review.name} className="rounded-xl border border-[#e5e7eb] bg-[#f8faf7] p-3">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-10 items-center justify-center rounded-full bg-[#16a34a] text-sm font-semibold text-white">
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
                        <p className="mt-2 text-sm leading-6 text-[#475569]">
  {review.summary}
</p>

{review.images && (
  <div className="mt-3 flex gap-2 overflow-x-auto">
    {review.images.map((img, index) => (
      <img
        key={index}
        src={img}
        alt={`Review ${index + 1}`}
        className="h-24 w-24 rounded-xl border border-slate-200 object-cover"
      />
    ))}
  </div>
)}
                      </div>
                    ))}
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
