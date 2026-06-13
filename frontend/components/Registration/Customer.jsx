import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import car from "../../src/assets/car.avif";


export default function Customer() {
    const navigate = useNavigate();

    return (

        <div className="relative group overflow-hidden rounded-3xl bg-white border border-gray-800 p-10 flex flex-col justify-between min-h-100 shadow-sm hover:shadow-xl transition-all">
            <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none">

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
            <button 
                onClick={() => navigate("/form/customer")}
                className="w-fit mt-8 bg-black text-white font-bold px-8 py-4 rounded-xl flex items-center gap-3 group-hover:bg-black/90 transition-all"
            >
                Register as a Customer
                <span className="flex justify-center items-center">
                    <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-2xl mb-3 text-white group-hover:text-white/50"
                    />
                </span>
            </button>
        </div>

    );
}