import { Link, NavLink } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import logo from '../src/assets/FixGo.png'

export const NavBar = () => {

    return (

        <header className="flex justify-between items-center w-full sticky top-0 z-50 bg-[#f9f9f9] border-b border-[#e2bfb0] shadow-sm py-4 max-w-max-width p-3 "  >

            <div className ="flex items-center gap-4">
                <img alt="FixGo Logo" className="h-10 w-auto" src={logo} />
                <span className="text-lg font-bold text-[#a04100]">FixGo</span>
            </div>

            <nav className="hidden md:flex items-center gap-8" >
                <NavLink to="/" className="text-[#a04100] font-mono active:scale-110 py-1 transition-colors " >Home</NavLink>
                <NavLink to="/shops" className="text-[#a04100] font-mono active:scale-110 py-1 transition-colors "  >Services</NavLink>
                <NavLink to="/services" className="text-[#a04100] font-mono active:scale-110 py-1 transition-colors" >Contact</NavLink>
                <NavLink to="/support" className="text-[#a04100] font-mono active:scale-110 py-1 transition-colors" >Support</NavLink>
            </nav>

            <div className="flex items-center gap-4" >

                <FontAwesomeIcon icon={faBell} className=" hover:bg-[#e8e8e8] p-2 rounded-full transition-colors active:scale-95" />
                <FontAwesomeIcon icon={faCircleQuestion} className="hover:bg-[#e8e8e8] p-2 rounded-full transition-colors active:scale-95" />
                <button className="bg-[#ff6b00] text-[#572000] font-extralight px-6 py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all">SIGN IN</button>

            </div>

        </header>
    )
}