import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/constants";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${API_URL}/api/menus`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const data = await response.json();
        setMenuItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Fetch menu error:", error);
        // setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const addToCart = (item) => {
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem._id === item._id
    );

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + 1,
      };
      setCart(updatedCart);
    } else {
      // Item not in cart, add with quantity 1
      const newItem = { ...item, quantity: 1 };
      setCart([...cart, newItem]);
    }
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cart.map((item) =>
      item._id === itemId ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCart(updatedCart.filter((item) => item.quantity > 0));
  };

  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    const tableNumber = parseInt(prompt("Enter table number"));
    const orderItems = cart.map(({ _id, name, quantity, price }) => ({
      _id,
      name,
      quantity,
      price,
    }));
    const totalAmount = calculateTotalAmount();
    const order = { tableNumber, orderItems, totalAmount };

    // console.log("Placing order:", order);
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        toast.error("Failed to place order");
        // throw new Error("Failed to place order");
      }
      toast.success("Order placed successfully!");
      setCart([]);
    } catch (error) {
      console.error("Place order error:", error);
      toast.error("Failed to place order");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-3xl font-semibold mb-6">Menu</h1>
      {Object.entries(groupByCategory(menuItems)).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg overflow-hidden shadow-md">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600 mb-2">
                    &#8377;{item.price.toFixed(2)}
                  </p>
                  <p className="text-gray-700">{item.description}</p>
                  <div className="flex items-center mt-4">
                    <button
                      onClick={() => addToCart(item)}
                      className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Add to Cart
                    </button>
                    {cart.find((cartItem) => cartItem._id === item._id) && (
                      <div className="flex items-center ml-4">
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="py-1 px-3 bg-red-600 text-white rounded-md hover:bg-red-700">
                          -
                        </button>
                        <span className="mx-2">
                          {
                            cart.find((cartItem) => cartItem._id === item._id)
                              .quantity
                          }
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="py-1 px-3 bg-green-600 text-white rounded-md hover:bg-green-700">
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Cart</h2>
          <ul className="divide-y divide-gray-200">
            {cart.map((item, index) => (
              <li key={index} className="py-4 flex">
                <div className="flex-1">
                  <p className="text-lg font-semibold">{item.name}</p>
                  <p className="text-gray-600">
                    &#8377;{item.price.toFixed(2)}
                  </p>
                  <p className="text-gray-700">Quantity: {item.quantity}</p>
                  <p className="text-gray-700">
                    Total: {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={handlePlaceOrder}
            className="mt-4 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700">
            Place Order
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

const groupByCategory = (menuItems) => {
  const grouped = {};
  menuItems.forEach((item) => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });
  return grouped;
};

export default Menu;
