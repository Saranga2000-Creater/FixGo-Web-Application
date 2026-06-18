const image = "../../src/assets/image4.jpg";
const  LandingImage = () => {
    return (
        <>
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
        </>
    )
}

export default LandingImage