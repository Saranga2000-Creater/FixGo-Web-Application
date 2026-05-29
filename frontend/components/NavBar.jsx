import { Link, NavLink } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import logo from '../src/assets/FixGo.png'

export const NavBar = ({setShowSignIn}) => {

    return (

        <header className="flex justify-between items-center w-full sticky top-0 z-50 bg-[#f9f9f9] border-b border-[#d1e7d7] shadow-sm py-4 max-w-max-width p-3 "  >

            <div className ="flex items-center gap-4">
                <img alt="FixGo Logo" className="h-10 w-auto" src={logo} />
                <span className="text-lg font-bold text-[#14532d]">FixGo</span>
            </div>

            <nav className="hidden md:flex items-center gap-8" >
                <NavLink to="/" className="text-[#14532d] font-mono active:scale-110 py-1 transition-colors " >Home</NavLink>
                <NavLink to="/shops" className="text-[#14532d] font-mono active:scale-110 py-1 transition-colors "  >Shops</NavLink>
                <NavLink to="/services" className="text-[#14532d] font-mono active:scale-110 py-1 transition-colors" >Services</NavLink>
                <NavLink to="/support" className="text-[#14532d] font-mono active:scale-110 py-1 transition-colors" >Support</NavLink>
            </nav>

            <div className="flex items-center gap-4" >

                <FontAwesomeIcon icon={faBell} className=" hover:bg-[#e8e8e8] p-2 rounded-full transition-colors active:scale-95" />
                <FontAwesomeIcon icon={faCircleQuestion} className="hover:bg-[#e8e8e8] p-2 rounded-full transition-colors active:scale-95" />
                <button onClick={()=>setShowSignIn(true)} className="bg-[#16a34a] text-white font-extralight px-6 py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all">SIGN IN</button>

            </div>

        </header>
    )
}