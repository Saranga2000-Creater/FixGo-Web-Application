import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Sign({ setShowSignIn }) {

    const navigate = useNavigate();

    const handleUserLogin = () => {

        navigate("/services", {
            state: {
                role: "owner" //owner , customer , admin
            }
        })

    }

    const handleRegister = () => {
        setShowSignIn(false)
        document.getElementById("register")?.scrollIntoView({
            behavior: "smooth"
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowSignIn(false)}
                aria-hidden="true"
            />

            <div
                role="dialog"
                aria-modal="true"
                className="relative bg-white w-full max-w-md mx-4 rounded-lg shadow-xl p-6 z-10"
            >
                <FontAwesomeIcon
                    icon={faXmark}
                    className="absolute top-4 right-4 cursor-pointer text-xl text-gray-600"
                    onClick={() => setShowSignIn(false)}
                />

                <h2 className="text-2xl font-semibold mb-2">Sign in to FixGo</h2>
                <p className="text-sm text-gray-500 mb-6">Welcome back — please sign in to continue.</p>

                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        setShowSignIn(false);
                    }}
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                        onClick={handleUserLogin}
                    >

                        Sign in

                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    <button className="text-green-600 hover:underline" onClick={handleRegister} >Create an account</button>
                    <span className="mx-2">·</span>
                    <button className="text-green-600 hover:underline">Forgot password?</button>
                </div>
            </div>
        </div>
    )
}

export default Sign