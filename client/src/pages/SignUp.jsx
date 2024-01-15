import React from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-center my-6">Sign Up</h1>
      <form className="flex flex-col gap-3 p-4">
        <input
          type="text"
          placeholder="username"
          className="p-3 rounded-lg border"
        />
        <input
          type="email"
          placeholder="email"
          className="p-3 rounded-lg border"
        />
        <input
          type="password"
          placeholder="password"
          className="p-3 rounded-lg border"
        />
        <button className="bg-slate-600 text-slate-50 p-3 rounded-lg hover:opacity-90 active:opacity-80">
          SIGN UP
        </button>
        <div>
          <p>
            Already have an account?{" "}
            <Link to={"/sign-in"}>
              <span className="text-blue-500 hover:underline cursor-pointer">
                Sign In
              </span>
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
