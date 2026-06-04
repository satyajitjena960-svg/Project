import React from "react";
import { Link } from "react-router";
import { useOnlineStatus } from "../utils/useOnlineStatus";

const NavBar = () => {
  const status = useOnlineStatus();

  return (
    <ul className="flex flex-wrap items-center justify-center gap-4 text-gray-700 font-medium md:gap-6">
      <li className="hover:text-blue-600 transition-colors duration-200">
        <Link to="/">Home</Link>
      </li>
      <li className="flex items-center gap-1 whitespace-nowrap">
        Online{status ? "✅" : "❌"}
      </li>
      <li className="hover:text-blue-600 transition-colors duration-200">
        <Link to="/offers">Offers</Link>
      </li>
      <li className="hover:text-blue-600 transition-colors duration-200">
        <Link to="/help">Help</Link>
      </li>
      <li className="hover:text-blue-600 transition-colors duration-200">
        <Link to="/grocery">Grocery</Link>
      </li>
      <li className="cursor-pointer hover:text-blue-600 transition-colors duration-200">
        Sign in
      </li>
      <li className="cursor-pointer hover:text-blue-600 transition-colors duration-200">
        Cart
      </li>
    </ul>
  );
};

const Header = () => {
  return (
    <div className="sticky top-0 z-50 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm px-6 py-4 shadow-sm">
      <div className="flex items-center h-12 w-48 justify-center md:justify-start">
        <span className="text-2xl font-black tracking-wider text-orange-600 drop-shadow-sm select-none">
          FOOD<span className="text-gray-900">HUB</span>
        </span>
      </div>
      <NavBar />
    </div>
  );
};

export default Header;