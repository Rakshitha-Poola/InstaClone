import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import Home from './components/Home'
import PageNotFound from './components/PageNotFound'
import Profile from './components/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import UserProfile from './components/UserProfile'

function App() {
 

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage/>}></Route>
          <Route path='/' element={
            <ProtectedRoute>
                <Home/>
            </ProtectedRoute>
            }></Route>
          <Route path='/profile' element={
            <ProtectedRoute>
                <Profile/>
            </ProtectedRoute>
            }></Route>
          <Route path='*' element={
            <ProtectedRoute>
              <PageNotFound/>
            </ProtectedRoute>
            }></Route>

            <Route path="/users/:userId" element={<UserProfile />}></Route>
        </Routes>
        
      </BrowserRouter>
    </>
  )
}

export default App
