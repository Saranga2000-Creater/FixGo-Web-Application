import { NavBar } from '../components/NavBar'
import image from '../src/assets/image4.jpg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBicycle, faSearch, faCar, faTruck, faWarehouse, faTriangleExclamation, faLocationDot, faUserTie, faArrowRight, faWrench,faRocket } from "@fortawesome/free-solid-svg-icons";
import Sign from "../components/SignIn"
import { useState } from 'react';
import car from "../src/assets/car.avif"
import serviceCenter from "../src/assets/service.jpg"

function Home() {

    const [showSignIn, setShowSignIn] = useState(false)

    return (

        <div>
            <NavBar setShowSignIn={setShowSignIn} />
            {
                showSignIn && <Sign setShowSignIn={setShowSignIn} />
            }
            <main>
                <section className="relative min-h-[70vh] flex items-center justify-center py-20 px-4 md:px-8 overflow-hidden ">
                    <div className="absolute inset-0 z-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}
                    ></div>
                    <div className="relative z-10 max-w-max-width mx-auto text-center">
                        <div className="inline-block px-4 py-1 mb-6 rounded-full bg-[#16a34a]/20 border border-[#16a34a] text-white font-bold text-sm tracking-wider uppercase">
                            Trusted across Western Province
                        </div>
                        <h1 className="font-display text-display text-white mb-6 leading-tight md:max-w-4xl mx-auto">
                            Expert Vehicle Care. <br /> <span className="text-[#16a34a]">Verified &amp; Fast.</span>
                        </h1>
                        <p className="font-body-lg text-white mb-10 max-w-2xl mx-auto">
                            The ultimate automotive management platform for Western Province. Find certified garages, book services, and get emergency roadside assistance in clicks.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button className="w-full sm:w-auto bg-[#16a34a] text-white font-label-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:brightness-110 transition-all transform active:scale-95">
                                FIND A REPAIR SHOP
                            </button>
                            <button className="w-full sm:w-auto border-2 border-[#16a34a] text-[#16a34a] font-label-bold text-lg px-10 py-4 rounded-xl hover:bg-[#16a34a]/10 transition-all active:scale-95">
                                LEARN MORE
                            </button>
                        </div>
                    </div>
                </section>

                <section className="relative -mt-24 z-20 px-4 md:px-8 max-w-max-width mx-auto mb-20">
                    <div className="bg-[#ffffff] border border-[#d1e7d7] rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8 md:p-12">
                            <h2 className="font-mono text-2xl mb-8 flex items-center gap-3">
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="text-2xl mb-3 text-[#14532d] group-hover:text-[#16a34a]"
                                />

                                Quick Search Hub
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                                <div>
                                    <p className="font-mono text-[#274c3a] uppercase tracking-widest mb-6">Select Vehicle Category</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <button className="group flex flex-col items-center justify-center p-6 border-2 border-[#d1e7d7] rounded-xl hover:border-[#16a34a] hover:bg-[#16a34a]/5 transition-all">
                                            <FontAwesomeIcon
                                                icon={faBicycle}
                                                className="text-2xl mb-3 text-[#274c3a] group-hover:text-[#16a34a]"
                                            />
                                            <span className="font-mono text-center">3-Wheelers &amp; Bikes</span>
                                        </button>
                                        <button className="group flex flex-col items-center justify-center p-6 border-2 border-[#d1e7d7] bg-[#16a34a]/5 rounded-xl transition-all">
                                            <FontAwesomeIcon
                                                icon={faCar}
                                                className="text-2xl mb-3 text-[#274c3a] group-hover:text-[#16a34a]"
                                            />
                                            <span className="font-mono text-center">4-Wheelers</span>
                                        </button>
                                        <button className="group flex flex-col items-center justify-center p-6 border-2 border-[#d1e7d7] rounded-xl hover:border-[#16a34a] hover:bg-[#16a34a]/5 transition-all">
                                            <FontAwesomeIcon
                                                icon={faTruck}
                                                className="text-2xl mb-3 text-[#274c3a] group-hover:text-[#16a34a]"
                                            />
                                            <span className="font-mono text-center">Commercial</span>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <p className="font-mono text-[#274c3a] uppercase tracking-widest mb-6">Select Service Type</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <select className="w-full h-full pl-12 pr-10 py-4 rounded-xl border-2 border-[#d1e7d7] bg-[#f8f4f0] font-mono appearance-none focus:ring-[#16a34a] focus:border-[#16a34a]">
                                                <option>Garages</option>
                                                <option>Service Centers</option>
                                                <option>Spare Parts</option>
                                            </select>

                                            <FontAwesomeIcon
                                                icon={faWarehouse}
                                                className="text-2xl mb-3 text-[#274c3a] group-hover:text-[#16a34a] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                            />

                                        </div>
                                        <button className="relative flex items-center justify-center gap-3 bg-[#ba1a1a] text-[#ffffff] font-mono px-4 py-4 rounded-xl shadow-md hover:brightness-110 transition-all">
                                            <FontAwesomeIcon
                                                icon={faTriangleExclamation}
                                                className="text-2xl mb-3 text-black absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                            />
                                            EMERGENCY HELP
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12 flex flex-col md:flex-row gap-6 items-center">
                                <div className="relative grow w-full">
                                    <FontAwesomeIcon
                                        icon={faLocationDot}
                                        className="text-2xl mb-3 text-black absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                    />
                                    <input className="w-full pl-12 pr-4 py-4 rounded-xl border border-[#d1e7d7] bg-[#f8f4f0] focus:ring-2 focus:ring-[#16a34a] outline-none font-body-md" placeholder="Search by City in Western Province (Colombo, Gampaha, Kalutara...)" type="text" />
                                </div>
                                <button className="w-full md:w-auto bg-[#16a34a] text-[#ffffff] font-mono px-12 py-4 rounded-xl hover:bg-[#16a34a]/80 transition-all">
                                    SEARCH NOW
                                </button>
                            </div>
                        </div>
                    </div>

                </section>

                <section className="py-20  px-4 md:px-8 bg-green-100 " id='register' >
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div className="relative group overflow-hidden rounded-3xl bg-white border border-gray-800 p-10 flex flex-col justify-between min-h-100 shadow-sm hover:shadow-xl transition-all">
                            <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:scale-110 transition-transform duration-700">

                                <img src={car} />
                            </div>
                            <div>
                                <span className="inline-block p-3 rounded-2xl bg-gray-300 text-black mb-6">
                                    <FontAwesomeIcon
                                        icon={faUserTie}
                                        className="text-2xl mb-3 text-black group-hover:text-black/90"
                                    />
                                </span>
                                <h3 className="font-mono text-2xl mb-4">Are you a vehicle owner?</h3>
                                <p className="font-mono text-black max-w-sm">Manage your vehicle health, track repair history, and get roadside help anywhere in Western Province.</p>
                            </div>
                            <button className="w-fit mt-8 bg-black text-white font-bold px-8 py-4 rounded-xl flex items-center gap-3 group-hover:bg-black/90 transition-all">
                                Register as a Customer
                                <span className="flex justify-center items-center">
                                    <FontAwesomeIcon
                                        icon={faArrowRight}
                                        className="text-2xl mb-3 text-white group-hover:text-white/50"
                                    />
                                </span>
                            </button>
                        </div>

                        <div className="relative group overflow-hidden rounded-3xl bg-black/90 text-white p-10 flex flex-col justify-between min-h-100 shadow-sm hover:shadow-2xl transition-all">
                            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700 ">
                                <img src={serviceCenter} />
                            </div>
                            <div>
                                <span className="inline-block p-3 rounded-2xl bg-green-500 text-on-primary-container mb-6">
                                    <span className="text-4xl">
                                        <FontAwesomeIcon
                                            icon={faWrench}
                                            className="text-2xl mb-3 text-black group-hover:text-black/90"
                                        />
                                    </span>
                                </span>
                                <h3 className="font-mono text-2xl mb-4 text-white">Own a workshop?</h3>
                                <p className="font-mono text-white/70 max-w-sm">Reach more customers, manage appointments, and digitize your automotive business today.</p>
                            </div>
                            <button className="w-fit mt-8 bg-green-500 text-black font-bold px-8 py-4 rounded-xl flex items-center gap-3 hover:brightness-110 transition-all">
                                Register Your Shop
                                <span className="text-4xl">
                                    <FontAwesomeIcon
                                        icon={faRocket}
                                        className="text-2xl mb-3 text-black group-hover:text-black/90"
                                    />
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    )
}

export default Home