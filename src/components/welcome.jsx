import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Welcome to our restaurant!
      </h1>
      <p className="text-lg mb-4 text-center">
        Register or login to place an order.
      </p>
      <div className="space-x-4">
        <button
          onClick={() => navigate("/register")}
          className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700">
          Register
        </button>
        <button
          onClick={() => navigate("/login")}
          className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700">
          Login
        </button>
      </div>
    </div>
  );
};

export default Welcome;
