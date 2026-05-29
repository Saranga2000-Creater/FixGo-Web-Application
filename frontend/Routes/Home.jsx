import { NavBar } from '../components/NavBar'
import image from '../src/assets/image4.jpg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBicycle, faSearch, faCar, faTruck, faWarehouse, faTriangleExclamation, faLocationDot } from "@fortawesome/free-solid-svg-icons";


function Home() {

    return (

        <div>
            <NavBar />

            <main>
                <section className="relative min-h-[70vh] flex items-center justify-center py-20 px-4 md:px-8 overflow-hidden ">
                    <div className="absolute inset-0 z-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}
                    ></div>
                    <div className="relative z-10 max-w-max-width mx-auto text-center">
                        <div className="inline-block px-4 py-1 mb-6 rounded-full bg-[#ff6b00]/20 border border-[#ff6b00] text-white font-bold text-sm tracking-wider uppercase">
                            Trusted across Western Province
                        </div>
                        <h1 className="font-display text-display text-white mb-6 leading-tight md:max-w-4xl mx-auto">
                            Expert Vehicle Care. <br /> <span className="text-[#ff6b00]">Verified &amp; Fast.</span>
                        </h1>
                        <p className="font-body-lg text-white mb-10 max-w-2xl mx-auto">
                            The ultimate automotive management platform for Western Province. Find certified garages, book services, and get emergency roadside assistance in clicks.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button className="w-full sm:w-auto bg-[#ff6b00] text-white font-label-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:brightness-110 transition-all transform active:scale-95">
                                FIND A REPAIR SHOP
                            </button>
                            <button className="w-full sm:w-auto border-2 border-[#ff6b00] text-[#ff6b00] font-label-bold text-lg px-10 py-4 rounded-xl hover:bg-[#ff6b00]/10 transition-all active:scale-95">
                                LEARN MORE
                            </button>
                        </div>
                    </div>
                </section>

                <section className="relative -mt-24 z-20 px-4 md:px-8 max-w-max-width mx-auto mb-20">
                    <div className="bg-[#ffffff] border border-[#e2bfb0] rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8 md:p-12">
                            <h2 className="font-mono text-2xl mb-8 flex items-center gap-3">
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="text-2xl mb-3 text-[#a04100] group-hover:text-[#ff6b00]"
                                />

                                Quick Search Hub
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                                <div>
                                    <p className="font-mono text-[#5a4136] uppercase tracking-widest mb-6">Select Vehicle Category</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <button className="group flex flex-col items-center justify-center p-6 border-2 border-[#e2bfb0] rounded-xl hover:border-[#ff6b00] hover:bg-[#ff6b00]/5 transition-all">
                                            <FontAwesomeIcon
                                                icon={faBicycle}
                                                className="text-2xl mb-3 text-[#5a4136] group-hover:text-[#ff6b00]"
                                            />
                                            <span className="font-mono text-center">3-Wheelers &amp; Bikes</span>
                                        </button>
                                        <button className="group flex flex-col items-center justify-center p-6 border-2 border-[#e2bfb0] bg-[#ff6b00]/5 rounded-xl transition-all">
                                            <FontAwesomeIcon
                                                icon={faCar}
                                                className="text-2xl mb-3 text-[#5a4136] group-hover:text-[#ff6b00]"
                                            />
                                            <span className="font-mono text-center">4-Wheelers</span>
                                        </button>
                                        <button className="group flex flex-col items-center justify-center p-6 border-2 border-[#e2bfb0] rounded-xl hover:border-[#ff6b00] hover:bg-[#ff6b00]/5 transition-all">
                                            <FontAwesomeIcon
                                                icon={faTruck}
                                                className="text-2xl mb-3 text-[#5a4136] group-hover:text-[#ff6b00]"
                                            />
                                            <span className="font-mono text-center">Commercial</span>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <p className="font-mono text-[#5a4136] uppercase tracking-widest mb-6">Select Service Type</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <select className="w-full h-full pl-12 pr-10 py-4 rounded-xl border-2 border-[#e2bfb0] bg-[#f8f4f0] font-mono appearance-none focus:ring-[#ff6b00] focus:border-[#ff6b00]">
                                                <option>Garages</option>
                                                <option>Service Centers</option>
                                                <option>Spare Parts</option>
                                            </select>

                                            <FontAwesomeIcon
                                                icon={faWarehouse}
                                                className="text-2xl mb-3 text-[#5a4136] group-hover:text-[#ff6b00] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
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
                                    <input className="w-full pl-12 pr-4 py-4 rounded-xl border border-[#e2bfb0] bg-[#f8f4f0] focus:ring-2 focus:ring-[#ff6b00] outline-none font-body-md" placeholder="Search by City in Western Province (Colombo, Gampaha, Kalutara...)" type="text" />
                                </div>
                                <button className="w-full md:w-auto bg-[#1a1c1c] text-[#ffffff] font-mono px-12 py-4 rounded-xl hover:bg-[#ff6b00]/80 transition-all">
                                    SEARCH NOW
                                </button>
                            </div>
                        </div>
                    </div>

                </section>

                

            </main>
        </div>
    )
}

export default Home