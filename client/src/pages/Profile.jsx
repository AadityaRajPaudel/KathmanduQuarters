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
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
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
        src={formData.avatar || currentUser.avatar}
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
        <Link to="/createlisting" className="mx-auto">
          <button
            type="button"
            className="bg-green-600 text-white uppercase p-3 rounded-lg hover:opacity-90"
          >
            Create Listing
          </button>
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
    </div>
  );
}
