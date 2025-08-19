// InstaStoriesWithModal.jsx
import { useEffect, useState, useRef } from "react";
import Cookies from 'js-cookie';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { ClipLoader } from "react-spinners";

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
};

const getVisibleSlides = () => {
  if (window.innerWidth <= 768) return 4;
  return 7;
};

const InstaStories = () => {
  const [stories, setStories] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(getVisibleSlides());
  const [selectedStory, setSelectedStory] = useState(null);
  const sliderRef = useRef(null);

  const getStories = async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get('jwt_token');
    const url = 'https://apis.ccbp.in/insta-share/stories';
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        setStories(data.users_stories);
        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    getStories();
    const handleResize = () => setVisibleSlides(getVisibleSlides());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const PrevArrow = ({ onClick, disabled }) => (
    <button
      className={`absolute left-[-10px] md:left-[-45px] top-[45px] transform -translate-y-1/2 z-10 ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <svg className="md:size-6 size-4.5 ml-3 bg-[#989898] text-white p-1 rounded-xl" viewBox="0 0 24 24">
        <path d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" />
      </svg>
    </button>
  );

  const NextArrow = ({ onClick, disabled }) => (
    <button
      className={`absolute right-[5px] md:right-[-25px] top-[35px] md:top-[45px] transform -translate-y-1/2 z-10 ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <svg className="md:size-6 size-4.5 bg-[#989898] text-white p-1 rounded-xl" viewBox="0 0 24 24">
        <path d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" />
      </svg>
    </button>
  );

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: visibleSlides,
    slidesToScroll: 1,
    arrows: window.innerWidth > 768,
    nextArrow: window.innerWidth > 768 ? <NextArrow disabled={currentSlide >= stories.length - visibleSlides} /> : null,
    prevArrow: window.innerWidth > 768 ? <PrevArrow disabled={currentSlide === 0} /> : null,
    beforeChange: (_, next) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 4, arrows: false },
      },
    ],
  };

  const renderLoader = () => (
    <div className="flex justify-center items-center h-40">
      <ClipLoader color="#3b82f6" size={35} />
    </div>
  );

  const renderFailureView = () => (
    <div className="text-center py-6">
      <img src='https://res.cloudinary.com/dqxbyu1dj/image/upload/v1752386878/Group_7522_zj1zpb.png' alt="error" className="w-32 mx-auto" />
      <h1 className="text-lg font-semibold mt-4">Something went wrong. Please try again</h1>
      <button onClick={getStories} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Try Again</button>
    </div>
  );

  const renderStories = () => (
    <div className="w-full max-w-[1000px] mx-auto py-6">
      <div className="relative">
        <Slider ref={sliderRef} {...sliderSettings}>
          {stories.map((story) => (
            <div
              key={story.user_id}
              onClick={() => setSelectedStory(story)}
              className="text-center px-[1px] sm:px-[2px] flex flex-col justify-center items-center cursor-pointer"
            >
              <img
                src={story.story_url}
                alt={story.user_name}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-[3px] border-pink-600"
              />
              <p className="text-xs sm:text-sm mt-1 w-20 truncate">{story.user_name}</p>
            </div>
          ))}
        </Slider>
      </div>

      {selectedStory && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 z-50 flex flex-col justify-center items-center">
          <button
            onClick={() => setSelectedStory(null)}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            &times;
          </button>
          <h2 className="text-white mb-4 text-xl font-semibold">{selectedStory.user_name}'s Story</h2>
          <img
            src={selectedStory.story_url}
            alt="story"
            className="w-[90%] max-w-[600px] h-auto rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );

  const render = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoader();
      case apiStatusConstants.success:
        return renderStories();
      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return renderFailureView();
    }
  };

  return <div className="w-full">{render()}</div>;
};

export default InstaStories;
