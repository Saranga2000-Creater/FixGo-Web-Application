import { useState } from "react"
import { NavBar } from "../components/NavBar"
import { Footer } from "../components/footer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import serviceHero from "../src/assets/service center.jpg"

import {
    faBicycle,
    faCar,
    faClock,
    faPhone,
    faLocationDot,
    faMagnifyingGlass,
    faShieldHalved,
    faSliders,
    faStar,
    faTruck,
    faWarehouse,
    faWrench,
    faXmark,
} from "@fortawesome/free-solid-svg-icons"

const shops = [
    {
        name: "Greenline Auto Care",
        type: "Service Center",
        region: "Colombo",
        address: "No. 18, Galle Road, Colombo 03",
        mapQuery: "Greenline Auto Care, Galle Road, Colombo, Sri Lanka",
        rating: "4.8",
        hours: "Open until 8.00 PM",
        contacts: ["011 245 7788", "077 884 2190"],
        services: ["Full service", "Engine diagnostics", "AC repair", "Oil change", "Wheel alignment", "Hybrid vehicle inspection"],
    },
    {
        name: "Metro Garage Works",
        type: "Garage",
        region: "Gampaha",
        address: "212 Minuwangoda Road, Gampaha",
        mapQuery: "Metro Garage Works, Gampaha, Sri Lanka",
        rating: "4.6",
        hours: "Open now",
        contacts: ["033 224 6112", "071 552 9081"],
        services: ["Engine repair", "Brake service", "Body work", "Suspension repair", "Battery testing", "Transmission service"],
    },
    {
        name: "RoadMate Spares",
        type: "Spare Parts",
        region: "Kalutara",
        address: "48 Main Street, Kalutara South",
        mapQuery: "RoadMate Spares, Kalutara, Sri Lanka",
        rating: "4.7",
        hours: "Closes at 7.30 PM",
        contacts: ["034 226 4098", "076 310 7744"],
        services: ["Genuine parts", "Batteries", "Tyres", "Filters", "Brake pads", "Engine oil and fluids"],
    },
]

const vehicleFilters = [
    { id: "three-wheelers", label: "3-Wheelers and Bikes", icon: faBicycle },
    { id: "four-wheelers", label: "4-Wheelers", icon: faCar },
    { id: "commercial", label: "Commercial Vehicles", icon: faTruck },
]

const serviceFilters = [
    { id: "garage", label: "Garages" },
    { id: "service", label: "Service Centers" },
    { id: "spare", label: "Spare Parts" },
]

function Shops() {
    const [selectedShop, setSelectedShop] = useState(null)

    return (
        <>
            <NavBar />

            <main className="min-h-screen bg-[#f7fbf8]">
                <section className="border-b border-[#d1e7d7] bg-white px-4 py-10 md:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="relative mb-8 overflow-hidden rounded-2xl border border-[#d1e7d7] bg-[#102818] shadow-xl">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${serviceHero})` }}
                            />
                            <div className="absolute inset-0 bg-linear-to-r from-[#07140d]/95 via-[#14532d]/75 to-[#07140d]/25" />
                            <div className="relative grid min-h-105 items-end gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-12">
                                <div className="max-w-3xl">
                                    <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 font-mono text-sm font-semibold text-white backdrop-blur">
                                        <FontAwesomeIcon icon={faShieldHalved} />
                                        Verified automotive partners
                                    </span>
                                    <h1 className="font-mono text-3xl font-bold leading-tight text-white md:text-5xl">
                                        Find the right shop for your vehicle
                                    </h1>
                                    <p className="mt-5 max-w-2xl font-mono text-base leading-7 text-white/85 md:text-lg">
                                        Browse garages, service centers, and spare-part suppliers across Western Province with practical filters for vehicle type, service category, and location.
                                    </p>
                                </div>

                                <div className="grid gap-3 rounded-2xl border border-white/20 bg-white/15 p-4 font-mono text-white shadow-2xl backdrop-blur-md sm:grid-cols-3 lg:grid-cols-1">
                                    <div className="rounded-xl bg-white/15 p-4">
                                        <p className="text-2xl font-bold">24/7</p>
                                        <p className="mt-1 text-sm text-white/75">Customer support visibility</p>
                                    </div>
                                    <div className="rounded-xl bg-white/15 p-4">
                                        <p className="text-2xl font-bold">4.7+</p>
                                        <p className="mt-1 text-sm text-white/75">Average partner rating</p>
                                    </div>
                                    <div className="rounded-xl bg-white/15 p-4">
                                        <p className="text-2xl font-bold">3</p>
                                        <p className="mt-1 text-sm text-white/75">Western Province regions</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-8 lg:grid-cols-[280px_1fr]">
                    <aside className="h-fit rounded-2xl border border-[#d1e7d7] bg-white p-5 shadow-sm lg:sticky lg:top-24">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="font-mono text-xl font-bold text-[#14532d]">Filters</h2>
                            <FontAwesomeIcon icon={faSliders} className="text-[#16a34a]" />
                        </div>

                        <div className="border-t border-[#d1e7d7] py-5">
                            <button className="rounded-xl w-full bg-[#16a34a] px-8 py-4 font-mono text-sm font-bold text-white shadow-md transition hover:brightness-110 active:scale-95">
                                SEARCH
                            </button>
                        </div>

                        <div className="border-t border-[#d1e7d7] py-5">
                            <h3 className="mb-3 font-mono text-sm font-bold uppercase tracking-widest text-black/70">
                                Vehicle Category
                            </h3>
                            <div className="space-y-3">
                                {vehicleFilters.map((filter) => (
                                    <label key={filter.id} htmlFor={filter.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-3 font-mono text-sm text-black transition hover:border-[#d1e7d7] hover:bg-[#16a34a]/5">
                                        <input id={filter.id} name="vehicleType" type="checkbox" className="h-4 w-4 accent-[#16a34a]" />
                                        <FontAwesomeIcon icon={filter.icon} className="w-5 text-[#16a34a]" />
                                        <span>{filter.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-[#d1e7d7] py-5">
                            <h3 className="mb-3 font-mono text-sm font-bold uppercase tracking-widest text-black/70">
                                Service Type
                            </h3>
                            <div className="space-y-3">
                                {serviceFilters.map((filter) => (
                                    <label key={filter.id} htmlFor={filter.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-3 font-mono text-sm text-black transition hover:border-[#d1e7d7] hover:bg-[#16a34a]/5">
                                        <input id={filter.id} name="serviceType" type="checkbox" className="h-4 w-4 accent-[#16a34a]" />
                                        <span>{filter.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <div>
                        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="font-mono text-sm uppercase tracking-widest text-black/70 ">Shop directory</p>
                                <h2 className="font-mono text-2xl font-bold text-black ">Top matches near you</h2>
                            </div>
                            <select className="w-full rounded-xl border border-[#d1e7d7] bg-white px-4 py-3 font-mono text-sm text-black outline-none md:w-auto">
                                <option>Sort by rating</option>
                                <option>Nearest first</option>
                                <option>Open now</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {shops.map((shop) => (
                                <article key={shop.name} className="overflow-hidden rounded-2xl border border-[#d1e7d7] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                                    <div className="relative flex h-36 items-center justify-center overflow-hidden bg-[#14532d] text-white">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center opacity-30"
                                            style={{ backgroundImage: `url(${serviceHero})` }}
                                        />
                                        <div className="absolute inset-0 bg-[#14532d]/70" />
                                        <span className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur">
                                            <FontAwesomeIcon icon={shop.type === "Garage" ? faWrench : shop.type === "Spare Parts" ? faWarehouse : faCar} className="text-4xl text-white" />
                                        </span>
                                    </div>
                                    <div className="p-5">
                                        <div className="mb-3 flex items-start justify-between gap-4">
                                            <div>
                                                <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#16a34a]">{shop.type}</p>
                                                <h3 className="mt-1 font-mono text-xl font-bold text-black">{shop.name}</h3>
                                            </div>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-[#16a34a]/10 px-3 py-1 font-mono text-sm font-bold text-black">
                                                <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                                                {shop.rating}
                                            </span>
                                        </div>

                                        <div className="space-y-2 font-mono text-sm text-black/70">
                                            <p className="flex items-center gap-2">
                                                <FontAwesomeIcon icon={faLocationDot} className="w-4 text-[#16a34a]" />
                                                {shop.region}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <FontAwesomeIcon icon={faClock} className="w-4 text-[#16a34a]" />
                                                {shop.hours}
                                            </p>
                                        </div>

                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {shop.services.map((service) => (
                                                <span key={service} className="rounded-full bg-[#f7fbf8] px-3 py-1 font-mono text-xs text-[#274c3a]">
                                                    {service}
                                                </span>
                                            ))}
                                        </div>

                                        <button
                                            className="mt-6 w-full rounded-xl border border-[#16a34a] px-4 py-3 font-mono text-sm font-bold text-[#16a34a] transition hover:bg-[#16a34a] hover:text-white active:scale-95"
                                            onClick={() => setSelectedShop(shop)}
                                            type="button"
                                        >
                                            VIEW SHOP
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {selectedShop && (
                <div
                    className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
                    onClick={() => setSelectedShop(null)}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="relative overflow-hidden rounded-t-2xl bg-[#14532d] p-6 text-white md:p-8">
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-20"
                                style={{ backgroundImage: `url(${serviceHero})` }}
                            />
                            <div className="absolute inset-0 bg-[#14532d]/80" />
                            <button
                                aria-label="Close shop details"
                                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 active:scale-95"
                                onClick={() => setSelectedShop(null)}
                                type="button"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                            <div className="relative pr-12">
                                <p className="font-mono text-sm font-bold uppercase tracking-widest text-[#86efac]">{selectedShop.type}</p>
                                <h2 className="mt-2 font-mono text-3xl font-bold md:text-4xl">{selectedShop.name}</h2>
                                <div className="mt-4 flex flex-wrap gap-3 font-mono text-sm text-white/85">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2">
                                        <FontAwesomeIcon icon={faStar} className="text-yellow-300" />
                                        {selectedShop.rating} rating
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2">
                                        <FontAwesomeIcon icon={faClock} />
                                        {selectedShop.hours}
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2">
                                        <FontAwesomeIcon icon={faLocationDot} />
                                        {selectedShop.region}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
                            <div className="overflow-hidden rounded-2xl border border-[#d1e7d7] bg-[#f7fbf8]">
                                <iframe
                                    className="h-80 w-full border-0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps?q=${encodeURIComponent(selectedShop.mapQuery)}&output=embed`}
                                    title={`${selectedShop.name} map location`}
                                />
                                <div className="border-t border-[#d1e7d7] p-4 font-mono">
                                    <p className="text-sm font-bold uppercase tracking-widest text-[#16a34a]">Location</p>
                                    <p className="mt-2 text-sm text-black/75">{selectedShop.address}</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="rounded-2xl border border-[#d1e7d7] bg-white p-5">
                                    <h3 className="font-mono text-lg font-bold text-black">Contact numbers</h3>
                                    <div className="mt-4 space-y-3">
                                        {selectedShop.contacts.map((contact) => (
                                            <a
                                                className="flex items-center gap-3 rounded-xl bg-[#f7fbf8] px-4 py-3 font-mono text-sm font-bold text-[#14532d] transition hover:bg-[#16a34a]/10"
                                                href={`tel:${contact.replaceAll(" ", "")}`}
                                                key={contact}
                                            >
                                                <FontAwesomeIcon icon={faPhone} className="text-[#16a34a]" />
                                                {contact}
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-[#d1e7d7] bg-white p-5">
                                    <h3 className="font-mono text-lg font-bold text-black">Available services</h3>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {selectedShop.services.map((service) => (
                                            <span key={service} className="rounded-full bg-[#16a34a]/10 px-3 py-2 font-mono text-xs font-semibold text-[#14532d]">
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button className="w-full rounded-xl bg-[#16a34a] px-5 py-4 font-mono text-sm font-bold text-white shadow-md transition hover:brightness-110 active:scale-95">
                                    BOOK THIS SHOP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    )
}

export default Shops
