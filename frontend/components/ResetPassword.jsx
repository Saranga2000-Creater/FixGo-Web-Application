import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const ResetPassword = () => {

    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            const res = await fetch('http://localhost:8000/api/resetPassword.php', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp, password })
            });

            const data = await res.json();

            if (res.ok) {
                alert("Password updated successfully! You can now log in.");
                navigate('/login');
            } else {
                setMessage(data.message);
            }

        } catch (error) {
            setMessage("An error occured. Please Try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                {message && <p className="text-red-500 mb-4">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">OTP Received in Email</label>
                        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">New Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Reset Password</button>
                </form>
            </div>
        </div>
    );

}

export default ResetPassword;