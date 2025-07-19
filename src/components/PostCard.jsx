import { useEffect, useRef, useState, useContext } from "react"
import Cookies from "js-cookie"
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaShare,
} from "react-icons/fa"
import { ClipLoader } from "react-spinners"
import { SearchContext } from "../Context/SearchContext"
import "./PostCard.css"

const PostCard = () => {
  const [posts, setPosts] = useState([])
  const [likedPosts, setLikedPosts] = useState({})
  const [animating, setAnimating] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const tapTimers = useRef({})
  const doubleTapDelay = 300

  const { searchTerm } = useContext(SearchContext)

  // 🔁 Fetch posts depending on search
  const fetchPosts = async () => {
    setIsLoading(true)
    const jwtToken = Cookies.get("jwt_token")
    const url = "https://apis.ccbp.in/insta-share/posts"
      searchTerm.trim() === ""
        ? "/apis/insta-share/posts"
        : `/apis/insta-share/posts?search=${searchTerm}`

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
        setPosts(data.posts)
      } else {
        setPosts([])
      }
    } catch (error) {
      console.error("Fetch error:", error)
      setPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [searchTerm])

  const handleLikeToggle = (post_id) => {
    const isCurrentlyLiked = likedPosts[post_id] || false
    const newLikeStatus = !isCurrentlyLiked

    setLikedPosts((prev) => ({ ...prev, [post_id]: newLikeStatus }))
    setPosts((prev) =>
      prev.map((post) =>
        post.post_id === post_id
          ? {
              ...post,
              likes_count: post.likes_count + (newLikeStatus ? 1 : -1),
            }
          : post
      )
    )

    const updateLikeStatusOnServer = async () => {
      const jwtToken = Cookies.get("jwt_token")
      const url = `https://apis.ccbp.in/insta-share/posts/${post_id}/like`
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ like_status: newLikeStatus }),
      }

      try {
        const response = await fetch(url, options)
        if (!response.ok) {
          setLikedPosts((prev) => ({
            ...prev,
            [post_id]: isCurrentlyLiked,
          }))
        }
      } catch (err) {
        console.error("Error updating like:", err)
      }
    }

    updateLikeStatusOnServer()
  }

  const handleDoubleClick = (post_id) => {
    if (!likedPosts[post_id]) {
      handleLikeToggle(post_id)
    }
    setAnimating((prev) => ({ ...prev, [post_id]: true }))
    setTimeout(() => {
      setAnimating((prev) => ({ ...prev, [post_id]: false }))
    }, 1000)
  }

  const handleTap = (post_id) => {
    const now = Date.now()
    if (
      tapTimers.current[post_id] &&
      now - tapTimers.current[post_id] < doubleTapDelay
    ) {
      handleDoubleClick(post_id)
      tapTimers.current[post_id] = 0
    } else {
      tapTimers.current[post_id] = now
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <ClipLoader color="#3b82f6" size={35} />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 px-4">
        <img
          src="https://res.cloudinary.com/dqxbyu1dj/image/upload/v1752568832/Group_1_w9cghq.png"
          alt="Search Not Found"
          className="w-80 max-w-full"
        />
        <h2 className="text-xl font-semibold mt-4">Search Not Found</h2>
        <p className="text-sm text-gray-500 mt-1">
          Try different keyword or search again
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto">
      {posts.map((each) => {
        const {
          post_id,
          user_name,
          profile_pic,
          post_details,
          likes_count,
          comments,
          created_at,
        } = each

        const isLiked = likedPosts[post_id] || false
        const showHeart = animating[post_id]

        return (
          <div
            key={post_id}
            className="bg-white w-full rounded-md mb-6 shadow-sm relative"
          >
            {/* User Info */}
            <div className="flex items-center p-4">
              <img
                src={profile_pic}
                alt={user_name}
                className="h-10 w-10 rounded-full object-cover mr-3"
              />
              <h1 className="font-semibold text-sm">{user_name}</h1>
            </div>

            {/* Post Image */}
            <div
              className="relative"
              onClick={() => handleTap(post_id)}
              onDoubleClick={() => handleDoubleClick(post_id)}
            >
              <img
                src={post_details.image_url}
                alt="post"
                className="w-full max-h-[600px] object-cover"
              />
              {showHeart && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <FaHeart className="text-white text-7xl animate-heart" />
                </div>
              )}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4 px-4 py-2 text-gray-700 text-xl">
              <button onClick={() => handleLikeToggle(post_id)}>
                {isLiked ? (
                  <FaHeart className="text-red-600 transition-all scale-110" />
                ) : (
                  <FaRegHeart />
                )}
              </button>
              <FaRegComment />
              <FaShare />
            </div>

            {/* Like Count */}
            <p className="px-4 font-semibold text-sm">{likes_count} likes</p>

            {/* Caption */}
            <p className="px-4 mt-1 text-sm">
              <span className="font-semibold mr-1">{user_name}</span>
              {post_details.caption}
            </p>

            {/* Comments */}
            {comments.length > 0 && (
              <div className="px-4 mt-1">
                {comments.map((comment) => (
                  <p key={comment.user_id} className="text-sm text-gray-700">
                    <span className="font-semibold">{comment.user_name}</span>{" "}
                    {comment.comment}
                  </p>
                ))}
              </div>
            )}

            {/* Time */}
            <p className="px-4 py-2 text-xs text-gray-400">{created_at}</p>
          </div>
        )
      })}
    </div>
  )
}

export default PostCard
