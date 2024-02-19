import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
} from "react-icons/fa";
import { useSelector } from "react-redux";
// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import Contact from "../components/Contact";

export default function Listing() {
  const params = useParams();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [listing, setListing] = React.useState({});
  const [contact, setContact] = React.useState(false); // whether contact landlord button is clicked or not
  const { currentUser } = useSelector((state) => state.user);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchListing();
    setLoading(false);
    setError(false);
  }, []);
  console.log(listing);
  return (
    <main className="pb-6">
      {loading && <p>Loading...</p>}
      {!loading && !error && (
        <>
          <Swiper navigation>
            {listing.imageUrls &&
              listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[600px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
          </Swiper>
        </>
      )}
      <h1 className="my-7 text-center text-3xl font-semibold">
        {listing.name} - Rs {listing.regularPrice} / month *{" "}
        <span className="font-extralight text-sm italic">
          (price does NOT include the discount)
        </span>
      </h1>
      <div className="flex items-center px-6">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-green-600" />
          <span className="italic">{listing.address}</span>
        </div>
      </div>
      <div className="mt-6 ml-6 ">
        <span className="bg-sky-600 p-3 text-white rounded-lg">
          {listing.type === "sale" ? "For Sale" : "For Rent"}
        </span>
        {listing.offer && (
          <span className="bg-green-600 p-3 text-white rounded-lg ml-6">
            Rs {Number(listing.discountedPrice)} per month with discount
          </span>
        )}
      </div>
      <p className="ml-6 mt-6 text-slate-700 ">
        <span className="font-semibold text-black">Description</span> -{" "}
        {listing.description}
      </p>
      <ul className="ml-6 mt-6 text-green-700 flex gap-4">
        <li className="flex items-center gap-1">
          <FaBed />
          <span>
            {listing.bedrooms} {listing.bedrooms > 1 ? `Bedrooms` : "Bedroom"}
          </span>
        </li>
        <li className="flex items-center gap-1">
          <FaBath />
          <span>
            {listing.bathrooms}{" "}
            {listing.bathrooms > 1 ? `Bathrooms` : "Bathroom"}
          </span>
        </li>
        <li className="flex items-center gap-1">
          <FaParking />
          <span>{listing.parking ? `Parking` : "No Parking"}</span>
        </li>
        <li className="flex items-center gap-1">
          <FaChair />
          <span>{listing.furnished ? `Furnished` : "Not Furnished"}</span>
        </li>
      </ul>
      {currentUser._id !== listing.userRef && !contact && (
        <div>
          <button
            className="bg-slate-700 text-white p-3 hover:opacity-90 ml-6 mt-6 rounded-lg w-96"
            onClick={() => setContact(true)}
          >
            CONTACT LANDLORD
          </button>
        </div>
      )}
      {contact && <Contact listing={listing} />}
    </main>
  );
}
