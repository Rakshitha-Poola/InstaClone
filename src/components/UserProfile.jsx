import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Cookies from "js-cookie"
import { ClipLoader } from "react-spinners"
import { BsGrid3X3 } from "react-icons/bs"
import { BiCamera } from "react-icons/bi"
import Header from "./Header"

const UserProfile = () => {
  const { userId } = useParams()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const jwtToken = Cookies.get("jwt_token")

  const getUserProfile = async () => {
    setLoading(true)
    setError(false)
    const url = `https://apis.ccbp.in/insta-share/users/${userId}`
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        setUserData(data.user_details)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    getUserProfile()
  }, [userId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#3b82f6" size={35} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="w-64 mb-4"
        />
        <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-4">We are having trouble loading the page. Please try again.</p>
        <button
          onClick={getUserProfile}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    )
  }

  const {
    profile_pic,
    user_name,
    user_id,
    followers_count,
    following_count,
    user_bio,
    posts_count,
    posts,
    stories,
  } = userData

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-auto">
      <Header />
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Profile Top Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 pb-6 border-b">
            <img
              src={profile_pic}
              alt="profile"
              className="w-36 h-36 rounded-full object-cover"
            />
            <div className="flex flex-col justify-center items-center md:items-start">
              <h1 className="text-2xl font-semibold">{user_name}</h1>
              <p className="text-gray-500 text-sm mt-1">{user_id}</p>

              <div className="flex gap-6 mt-3 text-sm text-black">
                <p><strong>{posts_count}</strong> posts</p>
                <p><strong>{followers_count}</strong> followers</p>
                <p><strong>{following_count}</strong> following</p>
              </div>

              <p className="text-sm text-gray-800 mt-2 max-w-md text-center md:text-left">{user_bio}</p>
            </div>
          </div>

          {/* Stories */}
          <div className="flex gap-4 mt-6 border-b pb-4 overflow-x-auto">
            {stories.map((story) => (
              <img
                key={story.id}
                src={story.image}
                alt="story"
                className="w-16 h-16 rounded-full border border-gray-300 p-1"
              />
            ))}
          </div>

          {/* Posts Section */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4 pt-4">
              <BsGrid3X3 size={20} />
              <h2 className="text-xl font-semibold">Posts</h2>
            </div>

            {posts.length === 0 ? (
              <div className="flex flex-col items-center mt-8 text-gray-600">
                <BiCamera size={60} />
                <h3 className="text-lg mt-2 font-semibold">No Posts Yet</h3>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {posts.map((post) => (
                  <img
                    key={post.id}
                    src={post.image}
                    alt="post"
                    className="w-full aspect-square object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserProfile
