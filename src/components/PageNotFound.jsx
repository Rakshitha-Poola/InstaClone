import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-30 p-4">
      <img
        src="https://res.cloudinary.com/dqxbyu1dj/image/upload/v1752569182/erroring_1_dqthwf.png"
        alt="Page not found illustration"
        className="h-60 w-50 mb-4"
      />
      <h1 className="text-xl font-semibold text-black mb-2">Page Not Found</h1>
      <p className="text-gray-500 text-center mb-1">
        We're sorry, the page you requested could not be found.
      </p>
      <p className="text-gray-500 text-center mb-4">
        Please go back to the homepage.
      </p>
      <Link to="/">
        <button className="bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-600 transition">
          Home Page
        </button>
      </Link>
    </div>
  );
};

export default PageNotFound;
