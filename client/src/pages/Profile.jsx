import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { createNextState } from "@reduxjs/toolkit";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    // setup firebase storage
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      // update form data to new image link to be imported from firebase
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate("/signin");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = () => {
    try {
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setShowListingsError(false);
      console.log(data);
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-6 w-96 mx-auto">
      <h1 className="text-4xl font-semibold text-center my-3">Profile</h1>
      <input
        type="file"
        ref={fileRef}
        hidden
        onChange={(e) => setFile(e.target.files[0])}
        accept="image/*"
      />
      <img
        src={currentUser.avatar}
        alt="profile"
        onClick={() => fileRef.current.click()} // another way doesnt work
        className="rounded-full w-18 h-18 object-cover mx-auto my-3 hover:cursor-pointer"
      />
      <p>
        {fileUploadError ? (
          <span>Error uploading image</span>
        ) : filePercentage > 0 && filePercentage < 100 ? (
          <span>Uploading image, {filePercentage}% complete</span>
        ) : (
          <span></span>
        )}
      </p>
      <form className="flex flex-col gap-4 w-56 sm:w-80 mx-auto">
        <input
          type="text"
          className="rounded-lg focus:outline-none p-3 my-1 focus:shadow-md"
          defaultValue={currentUser.username}
          placeholder="username"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          className="rounded-lg focus:outline-none p-3 my-1 focus:shadow-md"
          defaultValue={currentUser.email}
          placeholder="email"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          className="rounded-lg focus:outline-none p-3 my-1 focus:shadow-md"
          placeholder="password"
          id="password"
          onChange={handleChange}
        />
        <button
          className="text-white bg-slate-700 p-3 uppercase rounded-lg hover:opacity-90"
          onClick={handleSubmit}
        >
          Update
        </button>
        <Link to="/createlisting" className="block">
          <div className="bg-green-600 text-white uppercase p-3 rounded-lg hover:opacity-90 text-center">
            Create Listing
          </div>
        </Link>
      </form>
      <div className="my-3 flex justify-between">
        <span
          className="text-red-600 hover:cursor-pointer hover:underline"
          onClick={handleDeleteUser}
        >
          Delete account
        </span>
        <span
          className="hover:cursor-pointer hover:underline"
          onClick={handleSignout}
        >
          Sign out
        </span>
      </div>
      <p className="text-green-600">{updateSuccess ? "Update success" : ""}</p>
      <button
        className="text-green-600 hover:underline w-full"
        onClick={handleShowListings}
      >
        Show Listings
      </button>
      {userListings &&
        userListings.map((listing) => (
          <div
            key={listing._id}
            className="flex justify-between items-center border border-gray-400 rounded-lg my-3 p-3"
          >
            <img
              src={listing.imageUrls[0]}
              alt="listing"
              className="w-20 h-20 object-contain"
            />
            <Link to={`/listing/${listing._id}`}>
              <p className="hover:underline truncate text-wrap p-2">
                {listing.name}
              </p>
            </Link>
            <div className="flex gap-1 flex-col">
              <Link to={`/updatelisting/${listing._id}`}>
                <button className="text-green-600 hover:underline">Edit</button>
              </Link>
              <button
                className="text-red-600 hover:underline"
                onClick={() => handleListingDelete(listing._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
