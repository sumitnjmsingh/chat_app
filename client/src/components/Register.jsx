import React, { useState } from 'react';
import axios from 'axios';
import {Link,useNavigate} from "react-router-dom"

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
        console.log("sumit is here 1")
      const res=await axios.post('http://localhost:5000/register',{ username, password }, {
        headers: {
          'Content-Type': 'application/json',
           
        },
        withCredentials: true // Ensure credentials such as cookies are sent
      });

        console.log("sumit is here 2")
        // const data=await res.json();
        console.log("sumit is here 3")
        // console.log(data.msg)
    //   history.push('/');
    navigate('/');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className='flex justify-center items-center h-screen w-screen bg-slate-700 font-serif'>
       
      <div className='h-[60%] lg:w-[40%] w-[75%] bg-neutral-400 flex flex-col p-3 shadow-2xl' >
      <h1 className='flex justify-center items-center text-3xl h-[20%]'>Register</h1>
      <form onSubmit={handleSubmit} className='flex flex-col justify-around h-[60%] '>
        <input className='rounded-[15px] h-[30px] p-1 bg-neutral-300' type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input className='rounded-[15px] h-[30px] p-1 bg-neutral-300' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input className='rounded-[15px] h-[30px] p-1 bg-neutral-300' type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <button className='bg-green-800 rounded-[15px] h-[30px] p-1 text-white' type="submit">Register</button>
        <Link to="/">Already Registered?<span className='text-xl text-blue-700'>Login Here</span> </Link>
      </form>
     <div className='h-[10%]'> {error && <p>{error}</p>}</div>
      </div>
    </div>
  );
};

export default Register;
