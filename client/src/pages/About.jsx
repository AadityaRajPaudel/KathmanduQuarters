import React from "react";

export default function About() {
  return (
    <div className="p-8">
      <h1 className="w-full text-center font-semibold text-4xl text-slate-600 mb-8">
        About{" "}
        <span className="font-bold text-slate-700">Kathmandu Quarters</span>
      </h1>
      <div className="border p-5">
        <p className="mb-3">
          “Kathmandu Quarters” is a project that is designed to transform the
          experience of finding rental accommodations within Kathmandu valley.
          This project focuses on user-oriented approach, removing the
          traditional way of finding rooms/flats within the uncountable number
          of houses.
        </p>
        <p className="mb-3">
          This web-application project creates a secure, simple, efficient, and
          authentic user experience through the use of features like: Secure
          User Authentication and Verification, User Friendly UI/UX, and many
          more. One of the standout features of this project is its Advanced
          Search Functionality, enabling users to define their desired
          accommodations based on offers, budget, and further filters.
        </p>
        <p>
          It is a MERN stack project (MongoDB, Express.js, React, Node.js) built
          upon the basic HTML, CSS and JavaScript foundation. Its frontend
          involves React (a JS framework) for interactive UI/UX. Node.js and
          Express.js are used for server-side development. MongoDB is used for
          performing CRUD (Create, Read, Update, Delete) operations in the
          backend database.
        </p>
      </div>
      <div className="p-6">
        <h1 className=" font-semibold">Contributors:</h1>
        <div className="italic">
          <ul>
            <li>Aaditya Raj Paudel</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
