import image from '../../src/assets/image2.jpg'

const LandingImage = () => {

    return (
        <>
            <div className="relative min-h-[75vh] flex items-center justify-start py-20 px-6 md:px-16 lg:px-24 overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 z-0 w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                ></div>

                {/* Dark Gradient Overlay for premium feel and text readability */}
                <div className="absolute inset-0 z-10 w-full h-full bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

                {/* Text Content Container */}
                <div className="relative z-20 flex flex-col justify-center items-start w-full max-w-2xl h-auto">

                    {/* Main Title Heading */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-mono font-extrabold tracking-tight leading-tight text-left">
                        Find Trusted <br />
                        Vehicle <span className="text-[#10b981] md:text-[#16a34a]">Repair Shops</span> <br />
                        Near You
                    </h1>

                    {/* Subtitle / Description */}
                    <p className="text-sm md:text-base lg:text-lg text-gray-200 font-mono mt-6 text-left max-w-lg leading-relaxed">
                        Search verified garages, compare ratings, and book services instantly.
                    </p>

                </div>

            </div>
        </>
    )
}

export default LandingImage