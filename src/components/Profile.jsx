import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import Header from "./Header"
import { ClipLoader } from "react-spinners"

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const jwtToken = Cookies.get("jwt_token")

  const getPostDetails = async () => {
    const url = "/apis/insta-share/my-profile"
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      setProfile(data.profile)
      setLoading(false)
    }
  }

  useEffect(() => {
    getPostDetails()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#3b82f6" size={35} />
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Top Section */}
        
        <div className="flex items-center gap-8 border-b pb-6">
          <img
            src={profile.profile_pic}
            alt="profile"
            className="w-32 h-32 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold">{profile.user_name}</h1>
            <div className="flex gap-6 mt-2 text-gray-600 text-sm">
              <p><strong>{profile.posts_count}</strong> posts</p>
              <p><strong>{profile.followers_count}</strong> followers</p>
              <p><strong>{profile.following_count}</strong> following</p>
            </div>
            <p className="font-medium mt-5">{profile.user_id}</p>
            <p className="text-gray-700 text-sm max-w-md">{profile.user_bio}</p>
          </div>

          
        </div>
        

        {/* Stories */}
        <div className="flex gap-4 mt-6 border-b pb-4">
          {profile.stories.map((story) => (
            <img
              key={story.id}
              src={story.image}
              alt="story"
              className="w-18 h-18 rounded-full p-1"
            />
          ))}
        </div>

        {/* Posts */}
        <div className="mt-8">
                <h2 className="text-xl font-semibold ml- mb-4">Posts</h2>
          <div className="grid grid-cols-3 gap-3">
            {profile.posts.map((post) => (
              <img
                key={post.id}
                src={post.image}
                alt="post"
                className="w-auto h-auto object-cover rounded-sm"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
