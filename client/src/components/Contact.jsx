import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  const changed = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log("Error fetching landlord:", error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const handleSendMessage = () => {
    const subject = `Regarding ${listing.name}`;
    const emailBody = encodeURIComponent(message);
    const mailtoLink = `mailto:${landlord.email}?subject=${subject}&body=${emailBody}`;
    window.open(mailtoLink, "_blank").focus();
  };

  return (
    <>
      {landlord && (
        <div className="ml-6 mt-6">
          <p>
            Contact owner:{" "}
            <span className="font-semibold">{landlord.username}</span> for{" "}
            <span className="font-semibold">{listing.name}</span>
          </p>
          <textarea
            name="message"
            id="message"
            cols={6}
            rows={2}
            placeholder="Enter Your Message"
            className="w-full border p-3 rounded-lg mt-3"
            value={message}
            onChange={changed}
          ></textarea>
          <button
            onClick={handleSendMessage}
            className="bg-slate-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-90 w-full"
          >
            Send Message
          </button>
        </div>
      )}
    </>
  );
}
