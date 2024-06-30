import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link } from "react-router-dom";

const ManageMenuItems = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

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

    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          "https://fudr.onrender.com/api/menus",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setMenuItems(response.data);
      } catch (error) {
        console.error("Fetch menu items error:", error);
      }
    };

    fetchUserRole();
    fetchMenuItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://fudr.onrender.com/api/menus/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setMenuItems(menuItems.filter((item) => item._id !== id));
      toast.success("Menu item deleted successfully!");
    } catch (error) {
      console.error("Delete menu item error:", error);
      toast.error("Failed to delete menu item.");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://fudr.onrender.com/api/menus/${editingItem._id}`,
        editingItem,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMenuItems(
        menuItems.map((item) =>
          item._id === editingItem._id ? response.data : item
        )
      );
      setEditingItem(null);
      toast.success("Menu item updated successfully!");
    } catch (error) {
      console.error("Update menu item error:", error);
      toast.error("Failed to update menu item.");
    }
  };

  const handleChange = (e) => {
    setEditingItem({ ...editingItem, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <div>You are not authorized to manage menu items.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Manage Menu Items</h1>
        <div className="space-x-4">
          <Link
            to="/add"
            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700">
            Add Item
          </Link>
          <Link
            to="/orders"
            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700">
            Orders
          </Link>
        </div>
      </div>
      {menuItems.length === 0 ? (
        <div>No menu items found.</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menuItems.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingItem && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Edit Menu Item</h2>
          <form className="space-y-4" onSubmit={handleUpdate}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={editingItem.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={editingItem.price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={editingItem.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="text"
                id="image"
                name="image"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={editingItem.image}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={editingItem.category}
                onChange={handleChange}
                required>
                <option value="">Select a category</option>
                <option value="Appetizers">Appetizers</option>
                <option value="Main Course">Main Course</option>
                <option value="Desserts">Desserts</option>
                <option value="Drinks">Drinks</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Update Item
            </button>
          </form>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ManageMenuItems;
