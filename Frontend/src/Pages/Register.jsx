import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { Loader2 } from 'lucide-react';
const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  })
  const [loading,setLoading]= useState(false);
  const [error,setError]  =  useState('')
  const navigate = useNavigate();

  const registerUser = async(e) =>{
    e.preventDefault();
    setError('');

    if(formData.password.length < 6){
      setError('Password should be minimum length of 6 characters');
      return;
    }

    setLoading(true);

    try{
      const payload = {
        email : formData.email,
        fullName: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        password: formData.password
      };

      const response = await axios.post('http://localhost:3000/api/auth/register',payload);
      if(response.status === 201){
        navigate('/login');
      }
    }
    catch(err){
      // console.error("Registration failed",err);
      // alert("Something went Wrong")
      setError(err.response?.data?.message || "Registration failed. Try again")
    }
    finally{
      setLoading(false);
    }

  }


return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b0e14] px-2 md:px-4">
      <div className="w-full max-w-md px-3 py-6 md:p-8 space-y-6 bg-[#161b22] border border-gray-800 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-white">Create Account</h2>
        <p className="text-sm text-center text-gray-400">Join the AI revolution</p>
        
        <form className="space-y-4" onSubmit={registerUser}>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full px-4 py-3 bg-[#0d1117] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full px-4 py-3 bg-[#0d1117] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>
          
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 bg-[#0d1117] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-[#0d1117] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          
          <button type="submit" disabled={loading} 
            className={`w-full py-3 mt-4 font-semibold text-white  rounded-lg flex items-center justify-center cursor-pointer transition-all 
             ${loading? 'bg-blue-400 cursor-not-allowed ' : 'bg-blue-600 hover:bg-blue-700 '} duration-300`}
          >
            {loading ? <Loader2 className="animate-spin" /> : "SignUp"}
          </button>
        </form>
        
        <p className="text-sm text-center text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register