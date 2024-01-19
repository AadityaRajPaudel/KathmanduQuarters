import React from "react";

export default function CreateListing() {
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
            id="images"
            className="p-3 border border-gray-300 my-3 rounded-lg"
            multiple
          />
          <button className="ml-6 p-3 border border-green-600 rounded-lg text-green-600  hover:shadow-lg">
            Upload
          </button>
        </div>
        <div className="bg-slate-600 p-3 rounded-lg text-white text-center font-semibold hover:opacity-90 hover:cursor-pointer">
          CREATE LISTING
        </div>
      </form>
    </main>
  );
}
