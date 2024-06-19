// import React, { useState } from 'react';
// import axios from 'axios';

// const Login = ({ history }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/login', { username, password });
//       localStorage.setItem('token', response.data.token);
//       history.push('/chat');
//     } catch (err) {
//       setError('Invalid credentials');
//     }
//   };

//   return (
//     <div>
//       <h1>Login</h1>
//       <form onSubmit={handleSubmit}>
//         <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
//         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         <button type="submit">Login</button>
//       </form>
//       {error && <p>{error}</p>}
//     </div>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate=useNavigate()

  axios.defaults.withCredentials =true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/chat');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className='flex justify-center items-center h-screen w-screen bg-slate-700 font-serif'>
      <div className='h-[60%] lg:w-[40%] w-[75%] bg-neutral-400 flex flex-col p-3 shadow-2xl' ><h1 className='flex justify-center items-center text-3xl h-[20%]'>Login</h1>
      
      <form onSubmit={handleSubmit} className='flex flex-col justify-around h-[60%]'>
        <input className='rounded-[15px] h-[30px] p-1 bg-neutral-300'  type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input className='rounded-[15px] h-[30px] p-1 bg-neutral-300'  type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className='bg-green-800 rounded-[15px] h-[30px] p-1 text-white'  type="submit">Login</button>
      </form>
      <div>{error && <p>{error}</p>}</div>
      <p className='h-[10%]' >Don't have an account? <Link to="/register"><span className='text-xl text-blue-700'>Register</span></Link></p>
      </div>
    </div>
  );
};

export default Login;
