import React, { useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  console.log("Header: " + currentUser);
  const handleSubmit = (e) => {
    e.preventDefault();
    // getting existing params information except the searchTerm
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get("searchTerm");
    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL);
    }
  }, [location.search]);
  return (
    <header className="bg-slate-300 flex justify-between items-center p-3 px-8 sticky">
      <Link to={"/"}>
        <h1 className="text-sm sm:text-xl">
          <span className="text-slate-500 font-semibold">Kathmandu</span>
          <span className="text-slate-700 font-bold">Quarters</span>
        </h1>
      </Link>
      <form className="p-3 bg-slate-200 flex items-center justify-between rounded-lg ">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="focus:outline-none bg-transparent w-24 sm:w-72"
        />
        <button onClick={handleSubmit}>
          <FaSearch className="text-slate-500" />
        </button>
      </form>
      <ul className="flex gap-5 items-center">
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
