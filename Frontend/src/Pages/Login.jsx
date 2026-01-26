import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const loginUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", formData, {
                withCredentials: true
            });
            if (response.status == 200) {
                navigate('/chat');
            }
        }
        catch (err) {
            setError(err.response?.data?.message || "Invalid email or password");
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0b0e14] px-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-[#161b22] border border-gray-800 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-center text-white">Welcome Back</h2>

                {error && <p className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded">{error}</p>}

                <form className="space-y-4" onSubmit={loginUser}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full px-4 py-3 bg-[#0d1117] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 bg-[#0d1117] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    <button type="submit" disabled={loading}
                        className={`w-full py-3 mt-4 font-semibold text-white  rounded-lg flex items-center justify-center cursor-pointer transition-all 
             ${loading ? 'bg-blue-400 cursor-not-allowed ' : 'bg-blue-600 hover:bg-blue-700 '} duration-300`}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Login"}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-400">
                    Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;