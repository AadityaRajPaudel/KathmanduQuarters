import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-slate-300 flex justify-between items-center p-3">
      <h1 className="text-sm sm:text-xl">
        <span className="text-slate-500 font-semibold">Kathmandu</span>
        <span className="text-slate-700 font-bold">Quarters</span>
      </h1>
      <form className="p-3 bg-slate-200 flex items-center justify-between rounded-lg ">
        <input
          type="text"
          placeholder="Search..."
          className="focus:outline-none bg-transparent w-24 sm:w-72"
        />
        <FaSearch className="text-slate-500" />
      </form>
      <ul className="flex gap-3">
        <Link to="/">
          <li className="hidden sm:inline hover:cursor-pointer hover:underline">
            Home
          </li>
        </Link>
        <Link to="/about">
          <li className="hidden sm:inline hover:cursor-pointer hover:underline">
            About
          </li>
        </Link>
        <Link to="/sign-in">
          <li className="hover:cursor-pointer hover:underline">Sign In</li>
        </Link>
      </ul>
    </header>
  );
}
