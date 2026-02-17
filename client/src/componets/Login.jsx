import React from "react";
import { useForm } from "react-hook-form";

function Login({ onClose, onSwitchToSignup }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        const userData = JSON.parse(localStorage.getItem(data.email));
        if (userData) {
            if (userData.password === data.password) {
                console.log(userData.name + " You Are Successfully Logged In");
            } else {
                console.log("Email or Password is not matching with our record");
            }
        } else {
            console.log("Email or Password is not matching with our record");
        }
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-center text-gray-600 mb-8">Sign in to your account</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            placeholder="you@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm mt-1 block">
                                ✕ Email is required
                            </span>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            {...register("password", { required: true })}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                        {errors.password && (
                            <span className="text-red-500 text-sm mt-1 block">
                                ✕ Password is required
                            </span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95"
                    >
                        Sign In
                    </button>

                    {/* Divider */}
                    <div className="relative flex items-center my-6">
                        <div className="grow border-t border-gray-300"></div>
                        <span className="shrink mx-4 text-gray-500 text-sm">or</span>
                        <div className="grow border-t border-gray-300"></div>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-gray-600">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={onSwitchToSignup}
                            className="text-blue-500 hover:text-blue-700 font-semibold cursor-pointer"
                        >
                            Sign up
                        </button>
                    </p>

                    {/* Forgot Password Link */}
                
                </form>
        </div>
    );
}

export default Login;