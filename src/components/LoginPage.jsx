import { useState } from "react"
import Cookies from 'js-cookie'
import { Navigate, useNavigate } from "react-router-dom"

const LoginPage = () => {
  

    
    const [inputValue, setInputValue] = useState('')
    const [password, setPassword] = useState('')
    const [showSubmitError, setShowSubmitError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const navigate = useNavigate()
    const onChangeInput = (event) => {
        setInputValue(event.target.value)
    }
    const onChangePassword = (event) => {
        setPassword(event.target.value)
    }

    const onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    navigate('/', { replace: true })
  }
  const onSubmitFailure = errorMsg => {
    setShowSubmitError(true)
    setErrorMsg(errorMsg)
  }

    const submitForm = async (event) => {
        event.preventDefault()
 const response = await fetch("https://apis.ccbp.in/login", {
  method: 'POST',
  body: JSON.stringify({
  "username": inputValue,
  "password": password
}),
})       
        if(response.ok == true){
                  const data = await response.json()

            onSubmitSuccess(data.jwt_token)

        }
        else{
            onSubmitFailure("error_msg")
        }

    }

    const jwtToken = Cookies.get('jwt_token')
    if(jwtToken !== undefined){
        return <Navigate to="/"/>
    }
    return (
  <div className="bg-white min-h-screen flex flex-col justify-center items-center md:flex-row p-4">
    {/* Desktop-Only Illustration */}
    <img
      src="https://res.cloudinary.com/dqxbyu1dj/image/upload/v1752210766/Illustration_fsqzdl.png"
      className="hidden md:block w-[400px] mr-16"
      alt="illustration"
    />

    {/* Login Form */}
    <form
      className="bg-white shadow-md p-6 rounded-md w-full max-w-sm flex flex-col sm:justify-center"
      onSubmit={submitForm}
    >
      <div className="flex flex-col justify-center items-center mb-6">
        <img
          src="https://res.cloudinary.com/dqxbyu1dj/image/upload/v1752211019/Group_ylohfc.png"
          className="h-10 w-10 mb-2"
          alt="insta logo"
        />
        <h1 className="text-xl font-semibold text-black">Insta Share</h1>
      </div>

      {/* Username Field */}
      <div className="flex flex-col mb-4">
        <label htmlFor="inputValue" className="text-sm font-bold mb-1 text-black text-left">USERNAME</label>
        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-2 text-black"
          value={inputValue}
          onChange={onChangeInput}
          id="inputValue"
          placeholder="Enter Username"
        />
      </div>

      {/* Password Field */}
      <div className="flex flex-col mb-4">
        <label htmlFor="password" className="text-sm font-bold mb-1 text-black text-left">PASSWORD</label>
        <input
          type="password"
          className="border border-gray-300 rounded px-3 py-2 text-black"
          value={password}
          onChange={onChangePassword}
          placeholder="Enter Password"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-[#4094EF] cursor-pointer text-white font-semibold py-2 rounded mt-2"
      >
        Login
      </button>

      {/* Error Message */}
      {showSubmitError && (
        <p className="text-red-600 mt-2 text-sm font-medium">*{errorMsg}</p>
      )}
    </form>
  </div>
)}



export default LoginPage