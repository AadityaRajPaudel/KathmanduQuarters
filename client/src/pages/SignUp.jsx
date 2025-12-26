import React from "react";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = React.useState({});
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

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
      setLoading(true);
      setError(false);
      // make post request to the server which triggers user.auth.js route and get response in 'res' variable
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      // check if json response from post request is success or failure
      if (data.success === false) {
        setError(data.error);
        setLoading(false);
        return;
      }
      console.log(data);
      navigate("/signin");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-center my-6">Sign Up</h1>
      <form className="flex flex-col gap-3 p-4 sm:w-96 text-center mx-auto">
        <input
          type="text"
          placeholder="username"
          className="p-3 rounded-lg border"
          id="username"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="email"
          className="p-3 rounded-lg border"
          id="email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          placeholder="password"
          className="p-3 rounded-lg border"
          id="password"
          onChange={handleChange}
          required
        />
        <button
          disabled={loading}
          className="bg-slate-600 text-slate-50 p-3 rounded-lg hover:opacity-90 active:opacity-80"
          onClick={handleSubmit}
        >
          {loading ? "Loading.." : "Sign Up"}
        </button>
        <OAuth />
        <div>
          <p>
            Already have an account?{" "}
            <Link to={"/signin"}>
              <span className="text-blue-500 hover:underline cursor-pointer">
                Sign In
              </span>
            </Link>
          </p>
        </div>
        <p className="text-xs text-gray-500 text-wrap ">
          *Password must contain at least 8 characters, including one uppercase
          letter, one lowercase letter, and one number.
        </p>
      </form>
      {error && <div className="w-full text-center text-red-600">{error}</div>}
    </div>
  );
}
