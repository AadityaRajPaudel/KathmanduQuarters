import React, { useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const [files, setFiles] = React.useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [imageUploadError, setImageUploadError] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  useEffect(() => {
    const fetchListingId = async () => {
      // getcs the listing id of the listing to be updated
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data);
        return;
      }
      setFormData(data);
    };
    fetchListingId();
  }, []);
  const handleImageSubmit = (e) => {
    setIsUploading(true);
    // + formData.imageUrls.length or someting
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setImageUploadError(false);
      const promises = []; // contains promises having downloadURL for each image

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      // after all promises are resolved
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setIsUploading(false);
        })
        .catch(() => {
          setImageUploadError(true);
          setIsUploading(false);
        });
      return;
    }
    setImageUploadError(true);
    return;
  };

  console.log(formData);
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log("progress");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDelete = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  // all form data like name description, etc all formData state
  const handleChange = (e) => {
    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "furnished" ||
      e.target.id === "offer" ||
      e.target.id === "parking"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountedPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`); // redirect to the route unique to each listing based on its id
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3">
      <h1 className="font-semibold text-3xl my-3 text-center">
        Update a Listing
      </h1>
      <form className="max-w-2xl mx-auto">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="p-3 rounded-lg focus:outline-none"
            id="name"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="p-3 rounded-lg focus:outline-none"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="p-3 rounded-lg focus:outline-none"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
        </div>

        <div className="flex gap-4 my-4">
          <input
            type="checkbox"
            id="sell"
            onChange={handleChange}
            checked={formData.type === "sell"}
          />
          <label htmlFor="sell">Sell</label>
          <input
            type="checkbox"
            id="rent"
            onChange={handleChange}
            checked={formData.type === "rent"}
          />
          <label htmlFor="rent">Rent</label>
          <input
            type="checkbox"
            id="parking"
            onChange={handleChange}
            checked={formData.parking}
          />
          <label htmlFor="parking">Parking Spot</label>
          <input
            type="checkbox"
            id="furnished"
            onChange={handleChange}
            checked={formData.furnished}
          />
          <label htmlFor="furnished">Furnished</label>
          <input
            type="checkbox"
            id="offer"
            onChange={handleChange}
            checked={formData.offer}
          />
          <label htmlFor="offer">Offer</label>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <input
              type="number"
              max={10}
              min={1}
              className="p-3 mr-1 rounded-lg"
              id="bedrooms"
              placeholder="Beds"
              required
              onChange={handleChange}
              value={formData.bedrooms}
            />
            <span className="mt-3">Bedrooms</span>
          </div>

          <div>
            <input
              type="number"
              max={10}
              min={1}
              className="p-3 mr-1 rounded-lg"
              id="bathrooms"
              placeholder="Baths"
              required
              onChange={handleChange}
              value={formData.bathrooms}
            />
            <span className="mt-3">Bathrooms</span>
          </div>
          <div>
            <input
              type="number"
              className="p-3 mr-1 rounded-lg"
              id="regularPrice"
              placeholder="Regular Price"
              onChange={handleChange}
              value={formData.regularPrice}
              required
            />
            <span className="mt-3">Regular Price</span>
          </div>
          {formData.offer && (
            <div>
              <input
                type="number"
                className="p-3 mr-1 rounded-lg"
                id="discountedPrice"
                placeholder="Discounted Price"
                onChange={handleChange}
                value={formData.discountedPrice}
              />
              <span className="mt-3">Discounted Price</span>
            </div>
          )}
        </div>
        <div className="my-5">
          <p>
            <span className="font-semibold">Images: </span>
            <span className="italic">
              The first image will be cover (max 6)
            </span>
          </p>
          <input
            type="file"
            onChange={(e) => setFiles(e.target.files)}
            id="images"
            className="p-3 border border-gray-300 my-3 rounded-lg"
            accept="image/*"
            multiple
          />
          <button
            type="button"
            className="ml-6 p-3 border border-green-600 rounded-lg text-green-600  hover:shadow-lg"
            onClick={handleImageSubmit}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        <div className="mb-5 font-light">
          {imageUploadError
            ? "Image Upload Error"
            : formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between border border-gray-400 rounded-lg p-3"
                >
                  <img
                    className="w-24 h-24 object-contain"
                    src={url}
                    alt="image"
                  ></img>
                  <button
                    type="button"
                    className="text-red-600 uppercase"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
        </div>
        <div
          onClick={handleSubmit}
          className="bg-slate-600 p-3 rounded-lg text-white text-center font-semibold hover:opacity-90 hover:cursor-pointer"
        >
          {loading ? "UPDATING..." : "UPDATE LISTING"}
        </div>
        <p className="text-red-600 font-light">{error && error.message}</p>
      </form>
    </main>
  );
}
