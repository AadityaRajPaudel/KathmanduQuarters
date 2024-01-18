import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = React.useState({});
  // const [error, setError] = React.useState(false);
  // const [loading, setLoading] = React.useState(false);
  const { error, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [e.target.id]: e.target.value,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      // make post request to the server which triggers user.auth.js route and get response in 'res' variable
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // check if json response from post request is success or failure
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data)); // data goes to action.payload
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-center my-6">Sign In</h1>
      <form className="flex flex-col gap-3 p-4 sm:w-96 text-center mx-auto">
        <input
          type="email"
          placeholder="email"
          className="p-3 rounded-lg border"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="p-3 rounded-lg border"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-600 text-slate-50 p-3 rounded-lg hover:opacity-90 active:opacity-80"
          onClick={handleSubmit}
        >
          {loading ? "Loading.." : "Sign In"}
        </button>
        <OAuth />
        <div>
          <p>
            Dont have an account?{" "}
            <Link to={"/sign-up"}>
              <span className="text-blue-500 hover:underline cursor-pointer">
                Sign Up
              </span>
            </Link>
          </p>
          {error && <p className="text-red-400 mt-3">Sign In failed</p>}
        </div>
      </form>
    </div>
  );
}
