import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Welcome to our restaurant!
      </h1>
      <p className="text-lg mb-4 text-center">
        Register or login to place an order.
      </p>
      <div className="space-x-4">
        <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          <Link to="/register">Register</Link>
        </button>
        <button className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700">
          <Link to="/login">Login</Link>
        </button>
      </div>
    </div>
  );
};

export default Welcome;
