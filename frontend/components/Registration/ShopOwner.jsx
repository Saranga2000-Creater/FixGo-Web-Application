import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import serviceCenter from "../../src/assets/service.jpg";
import { faWrench, faRocket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function ShopOwner() {
    const navigate = useNavigate();

    return (
        <div className="relative group overflow-hidden rounded-3xl bg-black/90 text-white p-10 flex flex-col justify-between min-h-100 shadow-sm hover:shadow-2xl transition-all">
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
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
            <button 
                onClick={() => navigate("/form/shop-owner")}
                className="w-fit mt-8 bg-green-500 text-black font-bold px-8 py-4 rounded-xl flex items-center gap-3 hover:brightness-110 transition-all"
            >
                Register Your Shop
                <span className="text-4xl">
                    <FontAwesomeIcon
                        icon={faRocket}
                        className="text-2xl mb-3 text-black group-hover:text-black/90"
                    />
                </span>
            </button>
        </div>
    );
}

export default ShopOwner;