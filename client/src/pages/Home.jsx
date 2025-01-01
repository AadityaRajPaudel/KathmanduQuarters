import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./animate.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [listings, setListings] = useState([]);
  // const [saleListings, setSaleListings] = useState([]);
  // const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listing/get");
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next
          <span className="text-slate-500 animate-gradient"> perfect</span>{" "}
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Kathmandu Quarters is the best place to find your next perfect place
          to live. <br /> We have a wide range of properties for you to choose
          from.
        </div>
        <Link
          to={"/search"}
          className="text-lg text-blue-800 font-bold hover:underline inline"
        >
          Let's get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {listings &&
          listings.length > 0 &&
          listings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* listing results for offer, sale, and rent */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {listings && listings.length > 0 && (
          <div>
            <div>
              <h1 className="font-bold text-3xl text-slate-600 mb-6">
                Recent Listings:
              </h1>
            </div>
            <div className="flex flex-wrap gap-6">
              {listings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}></ListingItem>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
