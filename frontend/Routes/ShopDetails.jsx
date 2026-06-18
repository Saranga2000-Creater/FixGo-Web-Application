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
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import {
  FaOilCan,
  FaCarBattery,
  FaSnowflake,
  FaCog,
  FaCarSide,
  FaClock,
} from "react-icons/fa";

import {
  FaWrench,
  FaStar,
  FaShieldAlt,
  FaSmile,
} from "react-icons/fa";

import {
  MdCarRepair,
  MdOutlineCarCrash,
} from "react-icons/md";

function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shop = useMemo(
    () => ({
      id: id,
      category_id: 2,
      carriageService: 1,
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
 services:[
  {
    name: "Engine Oil Change",
    price: "$25",
    duration: "30 mins",
    icon: FaOilCan,
  },
  {
    name: "Full Vehicle Inspection",
    price: "$35",
    duration: "45 mins",
    icon: MdCarRepair,
  },
  {
    name: "AC Service & Regas",
    price: "$55",
    duration: "1 hour",
    icon: FaSnowflake,
  },
  {
    name: "Brake Pad Replacement",
    price: "$60",
    duration: "1 - 1.5 hours",
    icon: MdOutlineCarCrash,
  },
  {
    name: "Transmission Service",
    price: "$120",
    duration: "2 - 3 hours",
    icon: FaCog,
  },
  {
    name: "Battery Replacement",
    price: "$80",
    duration: "30 mins",
    icon: FaCarBattery,
  },
  {
    name: "Tyre Replacement",
    price: "$70",
    duration: "30 mins/tyre",
    icon: FaCarSide,
  },
  {
    name: "Wheel Alignment",
    price: "$40",
    duration: "45 mins",
    icon:FaCarSide,
  },
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

  <div className="rounded-xl border border-slate-200 bg-white p-5">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
        <FaWrench className="text-green-600 text-xl" />
      </div>

      <div>
        <h3 className="text-3xl font-bold text-slate-900">500+</h3>
        <p className="text-sm text-slate-500">
          Jobs Completed
        </p>
      </div>
    </div>
  </div>

  <div className="rounded-xl border border-slate-200 bg-white p-5">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
        <FaStar className="text-green-600 text-xl" />
      </div>

      <div>
        <h3 className="text-3xl font-bold text-slate-900">4.8</h3>
        <p className="text-sm text-slate-500">
          Customer Rating
        </p>
      </div>
    </div>
  </div>

  <div className="rounded-xl border border-slate-200 bg-white p-5">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
        <FaShieldAlt className="text-green-600 text-xl" />
      </div>

      <div>
        <h3 className="text-3xl font-bold text-slate-900">5+</h3>
        <p className="text-sm text-slate-500">
          Years Experience
        </p>
      </div>
    </div>
  </div>

  <div className="rounded-xl border border-slate-200 bg-white p-5">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
        <FaSmile className="text-green-600 text-xl" />
      </div>

      <div>
        <h3 className="text-3xl font-bold text-slate-900">98%</h3>
        <p className="text-sm text-slate-500">
          Completion Rate
        </p>
      </div>
    </div>
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

      <button 
      onClick={() => setIsModalOpen(true)}
      className="w-full rounded-xl bg-green-600 py-3 text-white font-semibold">
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
  
<div className="rounded-xl border border-[#d1e7d7] bg-white p-5 shadow-sm">

  <h2 className="text-2xl font-bold text-[#0f172a]">
    Our Services
  </h2>
  <div className="mt-4 flex flex-wrap gap-2">
  {[
    "All",
    "Maintenance",
    "Engine",
    "Electrical",
    "AC",
    "Tyres",
    "Diagnostics",
    "Others",
  ].map((category, index) => (
    <button
      key={category}
      className={`rounded-full px-4 py-2 text-sm font-medium ${
        index === 0
          ? "bg-green-600 text-white"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {category}
    </button>
  ))}
</div>

  {/* Service Cards */}
  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {shop.services.map((service) => {
      const Icon = service.icon;

      return (
        <div
  key={service.name}
  className="rounded-xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-md"
>
  <div className="flex items-start gap-3">

  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 shrink-0">
    <Icon className="text-lg text-green-600" />
  </div>

  <div>
    <h3 className="text-sm font-semibold text-slate-800 leading-5">
      {service.name}
    </h3>

    <p className="mt-1 text-sm font-semibold text-green-600">
      from {service.price}
    </p>
  </div>

</div>

  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
    <FaClock />
    <span>{service.duration}</span>
  </div>
</div>
      );
    })}
  </div>
  {/* View All Services Button */}
  <div className="mt-6 text-center">
    <button className="rounded-xl border border-green-200 px-5 py-2 font-medium text-green-600 hover:bg-green-50">
      View All Services
    </button>
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

<div className="flex flex-col gap-4 rounded-2xl border border-[#d1e7d7] bg-white p-6 shadow-sm">

  {/* Header */}
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div className="flex items-center gap-4">
      <h2 className="text-2xl font-bold text-slate-900">
        Customer Reviews
      </h2>

      <span className="text-slate-500">
        {shop.reviewCount} Reviews
      </span>
    </div>

    <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
      <option>Most Recent</option>
      <option>Highest Rated</option>
      <option>Lowest Rated</option>
    </select>
  </div>

  {/* Filter Buttons */}
  <div className="flex flex-wrap gap-3">
    <button className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white">
      All ({shop.reviewCount})
    </button>

    <button className="rounded-full border border-slate-200 px-4 py-2 text-sm">
      5 Stars
    </button>

    <button className="rounded-full border border-slate-200 px-4 py-2 text-sm">
      4 Stars
    </button>

    <button className="rounded-full border border-slate-200 px-4 py-2 text-sm">
      3 Stars
    </button>

    <button className="rounded-full border border-slate-200 px-4 py-2 text-sm">
      2 Stars
    </button>

    <button className="rounded-full border border-slate-200 px-4 py-2 text-sm">
      1 Star
    </button>
  </div>

  {/* Review Cards */}
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {shop.reviews.map((review) => (
      <div
        key={review.name}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white">
              {review.name
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")}
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                {review.name}
              </p>

              <div className="mt-1 flex items-center gap-1 text-yellow-500">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={faStar}
                  />
                ))}
              </div>
            </div>

          </div>

          <span className="text-sm text-slate-400">
            {review.date}
          </span>

        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          {review.summary}
        </p>

        {review.images && (
          <div className="mt-4 flex gap-2 overflow-x-auto">
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
