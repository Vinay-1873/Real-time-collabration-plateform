import React from "react";
import { useForm } from "react-hook-form";

function Signup({ onClose, onSwitchToLogin }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const password = watch("password");

    const onSubmit = async (data) => {
        try {
            const res = await fetch('http://localhost:5174/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                })
            });
            const json = await res.json();
            if (json.token) {
                localStorage.setItem('token', json.token);
                localStorage.setItem('user', JSON.stringify(json.user));
                console.log('Account created successfully');
                onClose();
            } else {
                console.log('Signup failed');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Account</h2>
            <p className="text-center text-gray-600 mb-8">Join us and start collaborating</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        {...register("name", { required: true })}
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    {errors.name && (
                        <span className="text-red-500 text-sm mt-1 block">
                            ✕ Name is required
                        </span>
                    )}
                </div>

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
                        {...register("password", { required: true, minLength: 6 })}
                        placeholder="Enter your password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    {errors.password && (
                        <span className="text-red-500 text-sm mt-1 block">
                            ✕ Password must be at least 6 characters
                        </span>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        {...register("confirmPassword", {
                            required: true,
                            validate: (value) => value === password || "Passwords don't match"
                        })}
                        placeholder="Confirm your password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    {errors.confirmPassword && (
                        <span className="text-red-500 text-sm mt-1 block">
                            ✕ {errors.confirmPassword.message}
                        </span>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95"
                >
                    Create Account
                </button>

                {/* Divider */}
                <div className="relative flex items-center my-6">
                    <div className="grow border-t border-gray-300"></div>
                    <span className="shrink mx-4 text-gray-500 text-sm">or</span>
                    <div className="grow border-t border-gray-300"></div>
                </div>

                {/* Sign In Link */}
                <p className="text-center text-gray-600">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-blue-500 hover:text-blue-700 font-semibold cursor-pointer"
                    >
                        Sign in
                    </button>
                </p>
            </form>
        </div>
    );
}

export default Signup;
