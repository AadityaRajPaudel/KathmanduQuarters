import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  const params = useParams();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [listing, setListing] = React.useState({});

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
  return (
    <main>
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
    </main>
  );
}
