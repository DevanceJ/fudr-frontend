import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch(
          "https://fudr.onrender.com/api/users/current",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        setIsAdmin(userData.role === "admin");
        setLoading(false);
      } catch (error) {
        console.error("Fetch user role error:", error);
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://fudr.onrender.com/api/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Fetch orders error:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId) => {
    try {
      const response = await fetch(
        `https://fudr.onrender.com/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            status: "completed",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();
      setOrders(
        orders.map((order) => (order._id === orderId ? updatedOrder : order))
      );
      toast.success("Order status updated to completed!");
    } catch (error) {
      console.error("Update order status error:", error);
      toast.error("Failed to update order status");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isAdmin) {
    return <div>You are not authorized to manage orders.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Orders</h1>
        <div className="space-x-4">
          <Link
            to="/add"
            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700">
            Add Item
          </Link>
          <Link
            to="/admin"
            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700">
            Manage Menu
          </Link>
        </div>
      </div>
      {orders.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {orders.map((order) => (
            <li
              key={order._id}
              className="py-4 flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">
                  Table: {order.tableNumber}
                </p>
                <p className="text-gray-600">
                  Total Amount: &#8377;{order.totalAmount.toFixed(2)}
                </p>
                <p className="text-gray-700">Status: {order.status}</p>
                <ul className="mt-2">
                  {order.orderItems.map((item, index) => (
                    <li key={index}>
                      {item.name} - {item.quantity} x &#8377;
                      {item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              {order.status !== "completed" && (
                <button
                  onClick={() => handleUpdateStatus(order._id)}
                  className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                  Mark as Completed
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default OrderList;
