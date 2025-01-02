import { useRef, useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import Image from "../assets/images/loginLogo.svg";
import Logo from "../assets/images/logo.svg";
import Loading from "./Loading";

import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApiSlice";

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    userRef?.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ user, password: pwd }).unwrap();
      dispatch(setCredentials({ ...userData, user }));
      setUser("");
      setPwd("");
      navigate("/welcome");
    } catch (err) {
      if (!err?.originalStatus) {
        setErrMsg("No server response");
      } else if (err?.response?.status === 400) {
        setErrMsg("Missing username or password");
      } else if (err?.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUser(e.target.value);
  const handlePwdInput = (e) => setPwd(e.target.value);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
          <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
            <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
              <div>
                <img src={Logo} className="w-32 mx-auto" />
              </div>
              <p
                ref={errRef}
                className={
                  errMsg
                    ? "bg-red-300 text-red-700 p-2 mt-5 rounded-md"
                    : "hidden"
                }
              >
                {errMsg}
              </p>
              <div className="mt-12 flex flex-col items-center">
                <h1 className="text-2xl xl:text-3xl font-extrabold">Log In</h1>
                <div className="w-full flex-1 mt-8">
                  <form className="mx-auto max-w-xs" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                      <input
                        ref={userRef}
                        value={user}
                        onChange={handleUserInput}
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                        type="text"
                        placeholder="Username"
                        required
                      />
                    </div>

                    <div className="flex flex-col">
                      <input
                        value={pwd}
                        onChange={handlePwdInput}
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                        type="password"
                        placeholder="Password"
                        required
                      />
                    </div>

                    <button className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                      <svg
                        className="w-6 h-6 -ml-2"
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        width="256"
                        height="256"
                        viewBox="0 0 256 256"
                        xmlSpace="preserve"
                      >
                        <defs></defs>
                        <g
                          style={{
                            stroke: "none",
                            strokeWidth: "1",
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: "10",
                            fill: "#ffffff",
                            fillOpacity: "nonzero",
                            opacity: "1",
                          }}
                          transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                        >
                          <path
                            d="M 36.137 34.78 c -9.589 0 -17.39 -7.801 -17.39 -17.39 C 18.747 7.801 26.548 0 36.137 0 s 17.39 7.801 17.39 17.39 C 53.527 26.979 45.726 34.78 36.137 34.78 z M 36.137 7 c -5.729 0 -10.39 4.661 -10.39 10.39 s 4.661 10.39 10.39 10.39 s 10.39 -4.661 10.39 -10.39 S 41.866 7 36.137 7 z"
                            style={{
                              stroke: "none",
                              strokeWidth: "1",
                              strokeDasharray: "none",
                              strokeLinecap: "butt",
                              strokeLinejoin: "miter",
                              strokeMiterlimit: "10",
                              fill: "#ffffff",
                              fillOpacity: "nonzero",
                              opacity: "1",
                            }}
                            transform="matrix(1 0 0 1 0 0) "
                            strokeLinecap="round"
                          />
                          <path
                            d="M 11.721 90 c -1.933 0 -3.5 -1.567 -3.5 -3.5 V 61.756 c 0 -11.14 9.063 -20.203 20.203 -20.203 h 15.427 c 6.92 0 13.29 3.505 17.039 9.375 c 1.084 1.698 1.904 3.539 2.438 5.471 c 0.516 1.862 -0.577 3.791 -2.44 4.306 c -1.86 0.519 -3.791 -0.576 -4.306 -2.44 c -0.349 -1.258 -0.884 -2.459 -1.593 -3.568 c -2.456 -3.847 -6.62 -6.143 -11.138 -6.143 H 28.424 c -7.28 0 -13.203 5.923 -13.203 13.203 V 86.5 C 15.221 88.433 13.654 90 11.721 90 z"
                            style={{
                              stroke: "none",
                              strokeWidth: "1",
                              strokeDasharray: "none",
                              strokeLinecap: "butt",
                              strokeLinejoin: "miter",
                              strokeMiterlimit: "10",
                              fill: "#ffffff",
                              fillOpacity: "nonzero",
                              opacity: "1",
                            }}
                            transform=" matrix(1 0 0 1 0 0) "
                            strokeLinecap="round"
                          />
                          <path
                            d="M 60.554 90 c -1.933 0 -3.5 -1.567 -3.5 -3.5 v -2.236 c 0 -1.933 1.567 -3.5 3.5 -3.5 s 3.5 1.567 3.5 3.5 V 86.5 C 64.054 88.433 62.486 90 60.554 90 z"
                            style={{
                              stroke: "none",
                              strokeWidth: "1",
                              strokeDasharray: "none",
                              strokeLinecap: "butt",
                              strokeLinejoin: "miter",
                              strokeMiterlimit: "10",
                              fill: "#ffffff",
                              fillOpacity: "nonzero",
                              opacity: "1",
                            }}
                            transform=" matrix(1 0 0 1 0 0) "
                            strokeLinecap="round"
                          />
                          <path
                            d="M 33.663 68.741 l 8.515 -8.515 c 1.367 -1.367 3.582 -1.367 4.949 0 c 1.367 1.366 1.367 3.583 0 4.949 l -2.54 2.54 h 33.693 c 1.933 0 3.5 1.567 3.5 3.5 s -1.567 3.5 -3.5 3.5 H 44.586 l 2.541 2.541 c 1.367 1.367 1.367 3.583 0 4.949 c -0.684 0.684 -1.579 1.025 -2.475 1.025 s -1.792 -0.342 -2.475 -1.025 l -8.515 -8.516 C 32.295 72.323 32.295 70.107 33.663 68.741 z"
                            style={{
                              stroke: "none",
                              strokeWidth: "1",
                              strokeDasharray: "none",
                              strokeLinecap: "butt",
                              strokeLinejoin: "miter",
                              strokeMiterlimit: "10",
                              fill: "#ffffff",
                              fillOpacity: "nonzero",
                              opacity: "1",
                            }}
                            transform=" matrix(1 0 0 1 0 0) "
                            strokeLinecap="round"
                          />
                        </g>
                      </svg>

                      <span className="ml-3">Log In</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
              <div
                className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${Image})`,
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Login;
