import React, { useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login_image.jpg";

const LoginPage = () => {
  const [state, setState] = useState("login"); // login | signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);


  const { setUser, api } = useAppContext();
  const navigate = useNavigate();

  const isLogin = state === "login";

  const handleState = () => {
    setState((prev) => (prev === "login" ? "signup" : "login"));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);   // START LOADING

  try {
    const { data } = await api.post(`/api/user/${state}`, {
      name,
      email,
      password,
    });

    if (data.success) {
      setUser(data.user);
      navigate("/");
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log("LoginPage err:", error);
    toast.error(error?.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false); // STOP LOADING
  }
};



  return (
    <div className="flex h-screen w-full">
      <div className="w-full hidden md:inline-block">
        <img
          className="h-full"
          // src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
          src={loginImage}
          alt="leftSideImage"
        />
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="md:w-96 w-80 flex flex-col items-center justify-center"
        >
          <h2 className="text-4xl text-gray-900 font-medium">
            {isLogin ? "Login" : "SignUp"}
          </h2>

          <p className="text-sm text-gray-500/90 mt-3">
            {isLogin
              ? "Welcome back! Please sign in to continue"
              : "Create your new account"}
          </p>

          {/* Name – only for signup */}
          {!isLogin && (
            <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full pl-6 mt-4 gap-2">
              <input
                type="text"
                placeholder="Name"
                className="bg-transparent outline-none text-sm w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          {/* Email */}
          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full pl-6 mt-4 gap-2">
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent outline-none text-sm w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full pl-6 mt-6 gap-2">
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none text-sm w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
  type="submit"
  disabled={loading}
  className={`mt-8 w-full h-11 rounded-full text-white flex items-center justify-center gap-2
    ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-500 hover:opacity-90"}`}
>
  {loading ? (
    <>
      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
    </>
  ) : (
    isLogin ? "Login" : "SignUp"
  )}
</button>


          <p
            onClick={handleState}
            className="text-gray-500/90 text-sm mt-4 cursor-pointer"
          >
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <span className="text-indigo-400 underline">Sign Up</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span className="text-indigo-400 underline">Login</span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
