import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link } from "react-router-dom";
import { api, extractError } from "../config/axiosConfig";
import { useAppDispatch } from "../config/redux/hooks";
import { signIn } from "../config/redux/slices/userSlice";
import { io } from "socket.io-client";

const signUpFormSchema = z
    .object({
        username: z
            .string()
            .nonempty("Username can't be empty")
            .min(2, "Username must contain at least 2 character(s)"),
        email: z.string().nonempty("Email can't be empty").email("Please enter a valid email"),
        password: z
            .string()
            .nonempty("Password can't be empty")
            .min(3, "Password must contain at least 3 character(s)"),
        confirmPass: z.string(),
    })
    .refine((data) => data.password === data.confirmPass, {
        message: "Passwords don't match",
        path: ["confirmPass"],
    });

type SignUpFormType = z.infer<typeof signUpFormSchema>;

const SignUp: React.FC = () => {
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormType>({
        resolver: zodResolver(signUpFormSchema),
    });

    const handleFormSubmit: SubmitHandler<SignUpFormType> = async (data: SignUpFormType) => {
        try {
            const res = await api.post("/auth/signup", data);
            const socket = io("http://localhost:8080", {
                query: {
                    _id: res.data._id,
                },
            });
            socket.connect();

            dispatch(
                signIn({
                    _id: res.data._id,
                    username: res.data.username,
                    email: res.data.email,
                    profilePicture: res.data.profilePicture,
                    createdAt: res.data.createdAt,
                    socket: socket,
                })
            );
        } catch (error) {
            console.log(extractError(error));
        }
    };

    const [isShowing, setIsShowing] = useState<{ showPass: boolean; showConfirmPass: boolean }>({
        showPass: false,
        showConfirmPass: false,
    });

    const handleShowPass = () => {
        setIsShowing((prev) => ({
            ...prev,
            showPass: !prev.showPass,
        }));
    };

    const handleShowConfirmPass = () => {
        setIsShowing((prev) => ({
            ...prev,
            showConfirmPass: !prev.showConfirmPass,
        }));
    };

    const falseEye = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            // width="16"
            // height="16"
            // fill="currentColor"
            // class="bi bi-eye"
            viewBox="0 0 16 16"
        >
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
        </svg>
    );

    const trueEye = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            // width="16"
            // height="16"
            // fill="currentColor"
            // class="bi bi-eye-slash"
            viewBox="0 0 16 16"
        >
            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
            <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
        </svg>
    );

    return (
        <>
            <div className="flex h-screen bg-gradient-to-br from-violet-950 to-slate-950 justify-center items-center">
                <div className="flex flex-col gap-4 bg-slate-100 p-10 rounded-md w-[400px] items-center">
                    <div className="bg-slate-300 p-4 rounded-md">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            // width="16"
                            // height="16"
                            // fill="currentColor"
                            // class="bi bi-chat-left"
                            className="size-10"
                            viewBox="0 0 16 16"
                        >
                            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                        </svg>
                    </div>
                    <h1 className="font-semibold text-3xl">Sign up</h1>
                    <span className="text-sm">Get started with your free account!</span>
                    <form
                        onSubmit={handleSubmit(handleFormSubmit)}
                        className="flex flex-col gap-4 w-full"
                        action=""
                        method="post"
                        noValidate
                    >
                        <div className="flex flex-col gap-1">
                            <input
                                {...register("username")}
                                className="focus:outline-none p-2 rounded-md"
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Username"
                            />
                            {errors.username?.message && (
                                <span className="text-red-500 text-xs">{errors.username.message}</span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <input
                                {...register("email")}
                                className="focus:outline-none p-2 rounded-md"
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                            />
                            {errors.email?.message && (
                                <span className="text-red-500 text-xs">{errors.email.message}</span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1 relative">
                            <input
                                {...register("password")}
                                className="focus:outline-none py-2 pl-2 pr-10 rounded-md"
                                type={isShowing.showPass ? "text" : "password"}
                                name="password"
                                id="password"
                                placeholder="Password"
                            />
                            <button
                                onClick={handleShowPass}
                                type="button"
                                className="absolute top-1 right-1 bg-slate-100 size-8 rounded-md p-1"
                            >
                                {isShowing.showPass ? trueEye : falseEye}
                            </button>
                            {errors.password?.message && (
                                <span className="text-red-500 text-xs">{errors.password.message}</span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1 relative">
                            <input
                                {...register("confirmPass")}
                                className="focus:outline-none py-2 pl-2 pr-10 rounded-md"
                                type={isShowing.showConfirmPass ? "text" : "password"}
                                name="confirmPass"
                                id="confirmPass"
                                placeholder="Confirm password"
                            />
                            <button
                                onClick={handleShowConfirmPass}
                                type="button"
                                className="absolute top-1 right-1 bg-slate-100 size-8 rounded-md p-1"
                            >
                                {isShowing.showConfirmPass ? trueEye : falseEye}
                            </button>
                            {errors.confirmPass?.message && (
                                <span className="text-red-500 text-xs">{errors.confirmPass.message}</span>
                            )}
                        </div>
                        <span className="text-xs">
                            By signing up, you agree to our Terms and Conditions, Privacy Policy and Cookies Policy.
                        </span>
                        <button
                            className="bg-violet-950 py-2 rounded-md text-white font-semibold"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Loading..." : "Sign up"}
                        </button>
                    </form>
                    <span className="">
                        Already have an account?{" "}
                        <Link className="text-violet-950 hover:underline" to={"/signin"}>
                            Sign in
                        </Link>
                    </span>
                </div>
            </div>
        </>
    );
};

export default SignUp;
