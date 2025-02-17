// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import { useAppSelector, useAppDispatch } from "./config/redux/hooks";
import { RootState } from "./config/redux/store";
import { api, extractError } from "./config/axiosConfig";
import { signIn } from "./config/redux/slices/userSlice";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { AxiosResponse } from "axios";

function App() {
    const isAuthenticated = useAppSelector((state: RootState) => state.user.isAuthenticated);
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const getProfile = async () => {
            setIsLoading((prev) => (prev = true));
            try {
                const res = (await api.get("/profile")) as AxiosResponse<{
                    _id: string;
                    username: string;
                    email: string;
                    profilePicture: string;
                    createdAt: string;
                }>;
                dispatch(signIn(res.data));
            } catch (error) {
                console.error(extractError(error));
            }
            setIsLoading((prev) => (prev = false));
        };

        getProfile();
    }, []);

    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-violet-950 to-slate-950 justify-center items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    // width="16"
                    // height="16"
                    // fill="currentColor"
                    // class="bi bi-disc"
                    className="w-[50%] md:w-[200px] animate-spin fill-slate-100"
                    viewBox="0 0 16 16"
                >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0M8 4a4 4 0 0 0-4 4 .5.5 0 0 1-1 0 5 5 0 0 1 5-5 .5.5 0 0 1 0 1m4.5 3.5a.5.5 0 0 1 .5.5 5 5 0 0 1-5 5 .5.5 0 0 1 0-1 4 4 0 0 0 4-4 .5.5 0 0 1 .5-.5" />
                </svg>
            </div>
        );
    }

    return (
        <>
            {/* <NavBar /> */}
            <Routes>
                <Route path="/" element={isAuthenticated ? <Homepage /> : <Navigate to={"/signup"} />} />
                <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to={"/"} />} />
                <Route path="/signin" element={!isAuthenticated ? <SignIn /> : <Navigate to={"/"} />} />
            </Routes>
        </>
    );

    // const [count, setCount] = useState(0);

    // return (
    //     <>
    //         <div>
    //             <a href="https://vite.dev" target="_blank">
    //                 <img src={viteLogo} className="logo" alt="Vite logo" />
    //             </a>
    //             <a href="https://react.dev" target="_blank">
    //                 <img src={reactLogo} className="logo react" alt="React logo" />
    //             </a>
    //         </div>
    //         <h1>Vite + React</h1>
    //         <div className="card">
    //             <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
    //             <p>
    //                 Edit <code>src/App.tsx</code> and save to test HMR
    //             </p>
    //         </div>
    //         <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    //     </>
    // );
}

export default App;
