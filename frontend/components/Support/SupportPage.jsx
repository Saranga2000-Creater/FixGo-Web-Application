import { useState, useEffect } from "react";
import { HiStar } from "react-icons/hi2";
import { FaPhoneAlt, FaEnvelope, FaClock, FaMapMarkerAlt, FaLinkedinIn, FaBook, FaCalendarAlt, FaCar, FaShieldAlt, FaHandshake, FaArrowRight, FaHeadset, FaPaperPlane, FaCheckCircle, FaBolt, FaTools } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import sahanImg from "../../src/assets/sahan_kavinda.jpeg";
import sanduniImg from "../../src/assets/sanduni_jayawardhana.jpeg";
import sarangaImg from "../../src/assets/saranga_pradeep.jpeg";
import irushiImg from "../../src/assets/irushi_prabodhya.jpeg";

// ─── FAQ Data ────────────────────────────────────────────────────────────────
const faqData = [
  {
    question: "How do I book a service?",
    answer:
      "You can book a service by finding a shop on our platform, selecting your preferred time slot, and confirming the booking. You'll receive a confirmation email with all the details.",
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer:
      "We take quality seriously. If you're not satisfied, please contact us within 48 hours of the service. We'll work with the shop to resolve the issue or offer a refund where applicable.",
  },
  {
    question: "Can I cancel or reschedule my booking?",
    answer:
      "Yes, you can cancel or reschedule your booking up to 2 hours before the appointment time through your dashboard. Late cancellations may incur a small fee.",
  },
  {
    question: "How does roadside assistance work?",
    answer:
      "Our roadside assistance connects you with the nearest available mechanic in real time. Simply tap the Roadside Help button, share your location, and a technician will be dispatched to you.",
  },

  {
    question: "How do reviews and ratings work?",
    answer:
      "After each completed service, you can leave a star rating and written review for the shop. Reviews are verified and help other customers make informed decisions.",
  },
  {
    question: "How do I contact a service center?",
    answer:
      "You can contact any service center directly through their shop profile page. Click the 'Contact Shop' button to send them a message or call them directly.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "FixGo currently operates across the Western Province of Sri Lanka, including Colombo, Gampaha, and Kalutara districts. We're rapidly expanding to other provinces.",
  },
];

// ─── Help Resources Data ────────────────────────────────────────────────────
const helpResources = [
  {
    icon: <FaBook className="text-[#16a34a] text-2xl" />,
    title: "User Guide",
    desc: "Complete guide to using FixGo",
    modalTitle: "FixGo User Guide",
    modalContent: [
      { heading: "Getting Started", body: "Create your FixGo account and complete your profile. You can register as a customer or as a shop owner from the Get Started page." },
      { heading: "Finding a Shop", body: "Use the Find Shops page to search for nearby vehicle repair centers. Filter by service type, location, and ratings to find your best match." },
      { heading: "Booking a Service", body: "Click on any shop, choose a service, select a time slot, and confirm your booking. You'll receive an email confirmation immediately." },
      { heading: "Managing Your Account", body: "Access your dashboard to view booking history, update your profile, manage notifications, and track your active service requests." },
    ],
  },
  {
    icon: <FaCalendarAlt className="text-[#16a34a] text-2xl" />,
    title: "How Booking Works",
    desc: "Step-by-step booking process",
    modalTitle: "How Booking Works",
    modalContent: [
      { heading: "Step 1 – Find a Shop", body: "Browse or search for a repair shop near you. You can filter results by service category, distance, and customer ratings." },
      { heading: "Step 2 – Select a Service", body: "Pick the type of service you need from the shop's profile (e.g., full service, tyre change, oil change, AC repair)." },
      { heading: "Step 3 – Choose a Time Slot", body: "Select a convenient date and time from the shop's available calendar. Slots update in real time." },
      { heading: "Step 4 – Confirm & Track", body: "Confirm your booking and monitor its status from your dashboard. The shop will be notified and will confirm or suggest an alternative slot." },
      { heading: "Cancellations", body: "You may cancel or reschedule up to 2 hours before your appointment via the dashboard." },
    ],
  },
  {
    icon: <FaCar className="text-[#16a34a] text-2xl" />,
    title: "Roadside Assistance",
    desc: "Everything about our roadside help",
    modalTitle: "Roadside Assistance",
    modalContent: [
      { heading: "What Is Roadside Assistance?", body: "FixGo Roadside Help connects you with the nearest available mechanic when your vehicle breaks down unexpectedly on the road." },
      { heading: "How to Request Help", body: "Tap the Roadside Help button in the app or on the website. Share your location and describe the issue — a technician will be dispatched to you." },
      { heading: "Coverage", body: "Roadside assistance is currently available across the Western Province of Sri Lanka. Coverage is being expanded to other provinces soon." },
      { heading: "24/7 Hotline", body: "You can also reach our emergency hotline at +94 11 234 5678 at any time of day or night for immediate roadside support." },
    ],
  },
  {
    icon: <FaShieldAlt className="text-[#16a34a] text-2xl" />,
    title: "Safety Guidelines",
    desc: "Your safety is our priority",
    modalTitle: "Safety Guidelines",
    modalContent: [
      { heading: "Verified Shops Only", body: "All shops listed on FixGo are verified and reviewed before being approved. We check licenses, facilities, and customer feedback regularly." },
      { heading: "Secure Data", body: "Your personal information is encrypted and never shared with third parties without your consent. We are compliant with data protection standards." },
      { heading: "Review System", body: "After every completed service, you can leave a verified review. This keeps our community honest and helps others choose trusted shops." },
      { heading: "Dispute Resolution", body: "If you have a safety concern or dispute, contact our support team within 48 hours. We will investigate and mediate between you and the shop." },
    ],
  },
  {
    icon: <FaHandshake className="text-[#16a34a] text-2xl" />,
    title: "Become a Partner",
    desc: "Join FixGo as a service partner",
    modalTitle: "Become a FixGo Partner",
    modalContent: [
      { heading: "Who Can Join?", body: "Any registered vehicle repair shop, mobile mechanic, or roadside assistance provider in Sri Lanka can apply to join the FixGo partner network." },
      { heading: "Benefits", body: "Get access to thousands of customers, manage bookings digitally, receive reviews that build credibility, and grow your business with our tools." },
      { heading: "How to Apply", body: "Click Get Started on the homepage and register as a Shop Owner. Fill in your business details and submit your application for review." },
      { heading: "Approval Process", body: "Our team will verify your credentials within 2–3 business days. Once approved, your shop will be listed and visible to all FixGo users." },
    ],
  },
];

// ─── Team Data ────────────────────────────────────────────────────────────────
const teamData = [
  {
    name: "Sahan Kavinda",
    role: "Team Lead , Backend Developer",
    bio: "Leads FixGo with a vision to revolutionize automoive industry.",
    img: sahanImg,
  },
  {
    name: "Sanduni Jayawardena",
    role: "Frontend & Backend Developer",
    bio: "Ensures smooth operations and excellent support for our customers.",
    img: sanduniImg,
  },
  {
    name: "Saranga Pradeep",
    role: "Frontend & Backend Developer",
    bio: "Driving innovation and building reliable solutions for FixGo.",
    img: sarangaImg,
  },
  {
    name: "Irushi Prabodhya",
    role: "Frontend & Backend Developer",
    bio: "Focused on delivering exceptional customer experiences.",
    img: irushiImg,
  },
];

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border border-gray-200 rounded-xl transition-all duration-300 overflow-hidden ${open ? "shadow-md" : "shadow-sm"}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
        id={`faq-${question.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <span className="font-medium text-gray-800 text-sm">{question}</span>
        <FontAwesomeIcon
          icon={open ? faChevronUp : faChevronDown}
          className={`text-xs transition-transform duration-300 ml-3 shrink-0 ${open ? "text-[#16a34a]" : "text-gray-400"}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <p className="px-5 pb-4 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-3">
          {answer}
        </p>
      </div>
    </div>
  );
};

// ─── Contact Form ─────────────────────────────────────────────────────────────
const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Contact Us</h2>
      <p className="text-gray-500 text-sm mb-6">
        Send us a message and we'll get back to you as soon as possible.
      </p>

      {submitted && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-5 text-sm animate-pulse">
          <FaCheckCircle />
          <span>Your ticket has been submitted! We'll reply within 24 hours.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Name</label>
            <input
              id="contact-name"
              type="text"
              required
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] transition-all bg-gray-50"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</label>
            <input
              id="contact-email"
              type="email"
              required
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] transition-all bg-gray-50"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Subject</label>
          <select
            id="contact-subject"
            required
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] transition-all bg-gray-50 text-gray-600"
          >
            <option value="">Select a subject</option>
            <option value="booking">Booking Issue</option>
            <option value="roadside">Roadside Assistance</option>
            <option value="account">Account Help</option>
            <option value="cancellation">Cancellation / Reschedule</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Message</label>
          <textarea
            id="contact-message"
            required
            rows={5}
            placeholder="Describe your issue in detail..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] transition-all bg-gray-50 resize-none"
          />
        </div>

        <button
          id="submit-ticket-btn"
          type="submit"
          className="flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md shadow-green-200 mt-1"
        >
          <FaPaperPlane className="text-sm" />
          Submit Ticket
        </button>
        <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
          <FaCheckCircle className="text-[#16a34a] text-xs" />
          Expected response time: <span className="text-[#16a34a] font-semibold">Within 24 hours</span>
        </p>
      </form>
    </div>
  );
};

// ─── Contact Info Panel ───────────────────────────────────────────────────────
const ContactInfo = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 h-fit">
    <h2 className="text-xl font-bold text-gray-900 mb-1">Contact Information</h2>
    <p className="text-gray-500 text-sm mb-6">Get in touch with our support team</p>

    <div className="flex flex-col gap-5">
      {/* Hotline */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
          <FaPhoneAlt className="text-[#16a34a] text-base" />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-sm">Hotline (24/7)</p>
          <p className="text-[#16a34a] font-semibold text-sm mt-0.5">+94 11 234 5678</p>
          <p className="text-gray-400 text-xs mt-0.5">For emergency roadside assistance</p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
          <FaEnvelope className="text-[#16a34a] text-base" />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-sm">Email Support</p>
          <p className="text-[#16a34a] font-semibold text-sm mt-0.5">support@fixgo.lk</p>
          <p className="text-gray-400 text-xs mt-0.5">We typically reply within 24 hours</p>
        </div>
      </div>

      {/* Hours */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
          <FaClock className="text-[#16a34a] text-base" />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-sm">Support Hours</p>
          <p className="text-[#16a34a] font-semibold text-sm mt-0.5">8:00 AM – 8:00 PM</p>
          <p className="text-gray-400 text-xs mt-0.5">For general inquiries and support</p>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
          <FaMapMarkerAlt className="text-[#16a34a] text-base" />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-sm">Our Location</p>
          <p className="text-[#16a34a] font-semibold text-sm mt-0.5">Colombo, Sri Lanka</p>
          <p className="text-gray-400 text-xs mt-0.5">We're here to help you</p>
        </div>
      </div>
    </div>
  </div>
);

// ─── Resource Modal ───────────────────────────────────────────────────────────
const ResourceModal = ({ resource, onClose }) => {
  if (!resource) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-8 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors text-sm font-bold"
        >
          ✕
        </button>

        {/* Icon + Title */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            {resource.icon}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{resource.modalTitle}</h3>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-5">
          {resource.modalContent.map((section) => (
            <div key={section.heading}>
              <p className="text-sm font-bold text-[#16a34a] mb-1">{section.heading}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-7 pt-5 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors active:scale-95"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Help Resource Card ───────────────────────────────────────────────────────
const ResourceCard = ({ icon, title, desc, onOpen }) => (
  <div
    onClick={onOpen}
    className="group bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-green-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
  >
    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
      {icon}
    </div>
    <div className="flex-1">
      <p className="font-bold text-gray-800 text-sm">{title}</p>
      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{desc}</p>
    </div>
    <div className="flex items-center gap-1 text-[#16a34a] text-xs font-semibold group-hover:gap-2 transition-all">
      Learn more <FaArrowRight className="text-[10px]" />
    </div>
  </div>
);

// ─── Team Card ────────────────────────────────────────────────────────────────
const TeamCard = ({ name, role, bio, img }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
    <img
      src={img}
      alt={name}
      className="w-20 h-20 rounded-full object-cover object-top border-4 border-green-100 shadow-sm mb-4"
    />
    <p className="font-bold text-gray-900 text-base">{name}</p>
    <p className="text-[#16a34a] text-xs font-semibold mt-0.5 mb-2">{role}</p>
    <p className="text-gray-400 text-xs leading-relaxed mb-4">{bio}</p>
    <a
      href="#"
      id={`linkedin-${name.replace(/\s+/g, "-").toLowerCase()}`}
      className="w-8 h-8 rounded-full bg-[#0077B5] hover:bg-[#006097] flex items-center justify-center text-white transition-colors"
    >
      <FaLinkedinIn size={13} />
    </a>
  </div>
);

// ─── Hero Feature Cards ───────────────────────────────────────────────────────
const heroFeatures = [
  {
    icon: <FaHeadset className="text-[#16a34a] text-2xl" />,
    title: "24/7 Support",
    desc: "Our team is always on standby. Reach us any time via phone or email — day or night.",
    accent: "bg-green-50 border-green-200",
  },
  {
    icon: <FaShieldAlt className="text-emerald-600 text-2xl" />,
    title: "Verified Service Shops",
    desc: "Every shop on FixGo is reviewed and verified. You can trust the quality before you book.",
    accent: "bg-emerald-50 border-emerald-200",
  },
  {
    icon: <FaBolt className="text-teal-600 text-2xl" />,
    title: "Instant Roadside Help",
    desc: "Stuck on the road? Connect with the nearest mechanic in minutes through our live dispatch.",
    accent: "bg-teal-50 border-teal-200",
  },
];

// ─── Testimonials Data (shared with homepage) ────────────────────────────────
const testimonials = [
  {
    name: "Nuwan Perera", location: "Colombo", stars: 5,
    text: "Found a great garage near me in minutes. The booking process was super easy!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    name: "Dilini Fernando", location: "Kandy", stars: 5,
    text: "Excellent service and transparent pricing. Highly recommended FixGo!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    name: "Tharindu Silva", location: "Galle", stars: 5,
    text: "Their roadside assistance saved me during an emergency. Very professional!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
  },
];

// ─── Review Section ───────────────────────────────────────────────────────────
const ReviewSection = () => {
  const extended = [...testimonials, ...testimonials, ...testimonials];
  const [activeIndex, setActiveIndex] = useState(3);
  const [hoverStar, setHoverStar] = useState(0);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveIndex((i) => (i === 5 ? 3 : i + 1));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return;
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setRating(0); setReviewText(""); setReviewName(""); }, 4000);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 pb-14">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">What Our Customers Say</h2>
      <p className="text-gray-500 text-sm mb-8">Real experiences from FixGo users — and we'd love to hear yours too.</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

        {/* ── Testimonial Carousel ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-hidden px-4 pt-6 pb-2">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${(activeIndex - 1) * 33.333}%)` }}
            >
              {extended.map((t, idx) => {
                const isCenter = idx === activeIndex;
                return (
                  <div
                    key={idx}
                    className={`w-1/3 shrink-0 px-2 transition-all duration-500 ${isCenter ? "opacity-100 scale-100" : "opacity-50 scale-95"
                      }`}
                  >
                    <div className={`border rounded-2xl p-5 flex flex-col gap-3 min-h-[180px] justify-between transition-all duration-500 ${isCenter ? "border-[#16a34a] bg-white shadow-md" : "border-gray-100 bg-white"
                      }`}>
                      <div>
                        <div className="flex gap-0.5 mb-3">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <HiStar key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border-2 border-green-100" />
                        <div>
                          <p className="font-bold text-gray-900 text-xs">{t.name}</p>
                          <p className="text-gray-400 text-[10px]">{t.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 py-4">
            {testimonials.map((_, idx) => {
              const isActive = (activeIndex % 3) === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx + 3)}
                  className={`rounded-full transition-all duration-300 ${isActive ? "w-5 h-2.5 bg-[#16a34a]" : "w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300"
                    }`}
                />
              );
            })}
          </div>
        </div>

        {/* ── Leave a Review Form ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <HiStar className="w-5 h-5 fill-[#16a34a] text-[#16a34a]" />
            <h3 className="font-bold text-gray-900 text-base">Leave a Review</h3>
          </div>
          <p className="text-gray-400 text-xs mb-5">Share your experience with FixGo</p>

          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                <FaCheckCircle className="text-[#16a34a] text-2xl" />
              </div>
              <p className="font-bold text-gray-800 text-sm">Thank you for your review!</p>
              <p className="text-gray-400 text-xs">Your feedback helps us improve FixGo.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Your Name</label>
                <input
                  id="review-name"
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] bg-gray-50 transition-all"
                />
              </div>

              {/* Star Rating */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Your Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      id={`star-${s}`}
                      onMouseEnter={() => setHoverStar(s)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => setRating(s)}
                      className="p-0.5 transition-transform hover:scale-110 active:scale-95"
                    >
                      <HiStar
                        className={`w-7 h-7 transition-colors ${s <= (hoverStar || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Your Review</label>
                <textarea
                  id="review-text"
                  required
                  rows={4}
                  placeholder="Tell others about your experience..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] bg-gray-50 resize-none transition-all"
                />
              </div>

              <button
                id="submit-review-btn"
                type="submit"
                className="flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-green-100 active:scale-[0.98]"
              >
                <FaPaperPlane className="text-xs" />
                Submit Review
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};

// ─── Main SupportPage Component ───────────────────────────────────────────────
const SupportPage = () => {
  const [activeResource, setActiveResource] = useState(null);

  const leftFaqs = faqData.filter((_, i) => i % 2 === 0);
  const rightFaqs = faqData.filter((_, i) => i % 2 !== 0);

  return (
    <div className="bg-[#f7f8fa] min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f0faf4] via-[#f7fdf9] to-[#eef9f4] border-b border-green-100 py-14 px-4">
        {/* Subtle decorative circles matching design style */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-50 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">

          {/* Top row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-green-200 text-[#16a34a] text-xs font-semibold px-4 py-1.5 rounded-full mb-5 shadow-sm">
                <FaHeadset /> We're here to help
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                How can we <span className="text-[#16a34a]">help you?</span>
              </h1>
              <p className="text-gray-500 mt-3 text-base max-w-md leading-relaxed">
                Browse our help topics, contact our team, or explore guides for all your FixGo needs.
              </p>
            </div>

            {/* Illustration — matches the design's headset visual */}
            <div className="shrink-0 flex items-center justify-center">
              <div className="relative w-44 h-44">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-green-100/80 scale-110" />
                {/* Inner circle */}
                <div className="relative w-full h-full rounded-full bg-white shadow-lg border border-green-100 flex items-center justify-center">
                  <FaHeadset className="text-[#16a34a] text-7xl" />
                </div>
                {/* Chat bubble dot */}
                <div className="absolute -top-1 -right-1 w-10 h-10 bg-[#16a34a] rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg leading-none">?</span>
                </div>
                {/* Wrench accent dot */}
                <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-green-100 border-2 border-white rounded-full flex items-center justify-center shadow">
                  <FaTools className="text-[#16a34a] text-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature highlight cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {heroFeatures.map((f) => (
              <div
                key={f.title}
                className={`flex items-start gap-4 border rounded-2xl px-5 py-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 ${f.accent}`}
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{f.title}</p>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <a
            id="view-all-articles-link"
            href="#"
            className="text-[#16a34a] text-sm font-semibold hover:underline flex items-center gap-1"
          >
            View all articles <FaArrowRight className="text-xs" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            {leftFaqs.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {rightFaqs.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>

      {/* ── HELP RESOURCES ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-7">Help Resources</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {helpResources.map((r) => (
            <ResourceCard key={r.title} {...r} onOpen={() => setActiveResource(r)} />
          ))}
        </div>
      </section>

      {/* ── RESOURCE MODAL ───────────────────────────────────────────────── */}
      <ResourceModal resource={activeResource} onClose={() => setActiveResource(null)} />

      {/* ── REVIEWS ──────────────────────────────────────────────────────── */}
      <ReviewSection />

      {/* ── MEET THE TEAM ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Meet the FixGo Team</h2>
        <p className="text-gray-500 text-sm mb-7">
          We're a passionate team working to make vehicle care simple and reliable for everyone.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {teamData.map((member) => (
            <TeamCard key={member.name} {...member} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
