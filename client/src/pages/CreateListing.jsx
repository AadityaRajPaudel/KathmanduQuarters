import React from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function CreateListing() {
  const [files, setFiles] = React.useState([]);
  const [imageUploadError, setImageUploadError] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    imageUrls: [],
  });

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

  return (
    <main className="p-3">
      <h1 className="font-semibold text-3xl my-3 text-center">
        Create Listing
      </h1>
      <form className="max-w-2xl mx-auto">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="p-3 rounded-lg focus:outline-none"
            id="name"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="p-3 rounded-lg focus:outline-none"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="p-3 rounded-lg focus:outline-none"
            id="address"
            required
          />
        </div>

        <div className="flex gap-4 my-4">
          <input type="checkbox" id="sell" />
          <label htmlFor="sell">Sell</label>
          <input type="checkbox" id="rent" />
          <label htmlFor="rent">Rent</label>
          <input type="checkbox" id="parking" />
          <label htmlFor="parking">Parking Spot</label>
          <input type="checkbox" id="furnished" />
          <label htmlFor="furnished">Furnished</label>
          <input type="checkbox" id="offer" />
          <label htmlFor="offer">Offer</label>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="number"
            max={10}
            min={1}
            className="p-3 mr-1 rounded-lg"
            id="bedrooms"
            placeholder="Beds"
            required
          />
          <input
            type="number"
            max={10}
            min={1}
            className="p-3 mr-1 rounded-lg"
            id="bathrooms"
            placeholder="Baths"
            required
          />
          <input
            type="number"
            className="p-3 mr-1 rounded-lg"
            id="regularPrice"
            placeholder="Regular Price"
            required
          />
          <input
            type="number"
            className="p-3 mr-1 rounded-lg"
            id="discountedPrice"
            placeholder="Discounted Price"
          />
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
        <div className="bg-slate-600 p-3 rounded-lg text-white text-center font-semibold hover:opacity-90 hover:cursor-pointer">
          CREATE LISTING
        </div>
      </form>
    </main>
  );
}
