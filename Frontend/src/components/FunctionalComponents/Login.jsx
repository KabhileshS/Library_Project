import React from 'react'
import {Link} from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const Login = () => {
    const navigate=useNavigate()
    const [email,setEmail]=useState("")
    const [password,setPass]=useState("")
    const [loading,setLoading]=useState(false)
    
    const handleLogin=async(event)=>{
        event.preventDefault()
        setLoading(true)
        // const req=await axios.post("http://localhost:3001/login",{
        //   email:email,
        //   password:password
        // })
        // const message=req.data.message
        // const isLogin=req.data.isLogin
        // if(isLogin){
        //   alert(message)
          navigate('/search')
        // }else{
        //   alert(message)
        // }
        setLoading(false)
      }
  return (
    <div>
      <form onSubmit={handleLogin}>
        <h1>Login Page</h1>
        <label htmlFor="email">   Email :  </label>
        <input type="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)}  disabled={loading}/>
        <br />
        <br />
        <label htmlFor="password">   Password:  </label>
        <input type="password" id="password" value={password} onChange={(e)=>setPass(e.target.value)} disabled={loading}/>
        <br />
        <br />
        <button type="submit" disabled={loading}>{loading?"Logging in":"Login"}</button>
       </form>
      <p>Create an Account ? <Link to='/signup' >Signup</Link> </p>
    </div>
  )
}

export default Login
