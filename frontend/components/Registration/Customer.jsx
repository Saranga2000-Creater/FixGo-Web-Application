import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import car from "../../src/assets/car.png";


export default function Customer() {
    const navigate = useNavigate();

    return (

        <div className="flex flex-col md:flex-row justify-between items-stretch relative group overflow-hidden rounded-3xl bg-green-100 text-black min-h-[380px] shadow-sm hover:shadow-2xl transition-all">
            <div className="p-8 sm:p-10 flex flex-col justify-between w-full md:w-3/5 z-10">
                <div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-green-500 text-white mb-6">
                        <FontAwesomeIcon
                            icon={faUserTie}
                            className="text-xl text-white group-hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                    <h3 className="font-mono text-2xl mb-4 font-bold">Are you a vehicle owner?</h3>
                    <p className="font-mono text-black/80 max-w-sm text-sm sm:text-base leading-relaxed">Manage your vehicle health, track repair history, and get roadside help anywhere in Western Province.</p>
                </div>
                
                <button
                    onClick={() => navigate("/form/customer")}
                    className="w-full md:w-fit mt-8 bg-green-500 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-3 group-hover:bg-green-600 hover:bg-green-600 transition-all active:scale-95 cursor-pointer shadow-md"
                >
                    <span>Find Shops Near You</span>
                    <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-lg transition-transform duration-300 group-hover:translate-x-1"
                    />
                </button>
            </div>
            <div className="w-full md:w-2/5 flex justify-center md:justify-end items-center p-6 md:p-8">
                <img src={car} alt="car" className="w-full max-w-[240px] md:max-w-[280px] h-auto object-contain transition-transform duration-500 group-hover:scale-105" />
            </div>
        </div>
    );
}