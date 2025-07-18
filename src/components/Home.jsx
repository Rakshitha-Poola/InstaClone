import Header from "./Header"
import InstaStories from "./InstaStories"
import PostCard from "./PostCard"
import { useContext } from "react"
import { SearchContext } from "../Context/SearchContext"

const Home = () => {
  const { searchTerm } = useContext(SearchContext)

  const isSearching = searchTerm.trim().length > 0

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <Header />
      {!isSearching && <InstaStories />}
      <div className="max-w-[1000px] mx-auto px-4">
        {isSearching && (
          <h1 className="text-xl font-semibold py-4">Search Results</h1>
        )}
        <PostCard />
      </div>
    </div>
  )
}

export default Home
