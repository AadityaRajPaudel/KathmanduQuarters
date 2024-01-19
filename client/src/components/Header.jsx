import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-slate-300 flex justify-between items-center p-3 px-8">
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
      <ul className="flex gap-3 items-center">
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
        <Link to="/profile">
          {currentUser ? (
            <img
              src={currentUser.avatar}
              alt="userpicture"
              className="w-9 rounded-full object-cover"
            />
          ) : (
            <li className="hover:cursor-pointer hover:underline">Sign Up</li>
          )}
        </Link>
      </ul>
    </header>
  );
}
