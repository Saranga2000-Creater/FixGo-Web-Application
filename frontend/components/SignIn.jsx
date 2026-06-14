import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function Sign({ setShowSignIn }) {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleUserLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/api/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                setShowSignIn(false);
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("email", email);
                sessionStorage.setItem("role", data.role);

                navigate("/services");
            } else {
                alert(data.message || "Login failed. Please try again.");
            }

        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred. Please try again.");
        }

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
                    onSubmit={handleUserLogin}
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                            placeholder="you@example.com"
                            name="email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                            placeholder="Enter your password"
                            name="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                        name="signin"
                    >
                        Sign in
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    <button className="text-green-600 hover:underline" onClick={handleRegister}>Create an account</button>
                    <span className="mx-2">·</span>
                    <button className="text-green-600 hover:underline">Forgot password?</button>
                </div>
            </div>
        </div>
    )
}

export default Sign