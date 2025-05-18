import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Pencil, Save, X } from "lucide-react";

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [newDisplayName, setNewDisplayName] = useState(
    user?.user_metadata.user_name || user?.email || ""
  );
  const [isEditing, setIsEditing] = useState(false);
  const displayName = user?.user_metadata.user_name || user?.email;
  const avatar = user?.user_metadata.avatar_url;

  const updateUsername = async () => {
    if (!user) return;

    try {
      await updateUser(newDisplayName);
      setIsEditing(false);
      alert("Username updated successfully!");
    } catch (error) {
      console.error("Error updating username:", error);
      alert("Failed to update username.");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setNewDisplayName(user?.user_metadata.user_name || user?.email || "");
  };

  return (
    <div className="min-h-screen pt-20 text-gray-100">
      <div className="relative max-w-4xl p-8 mx-auto transition-all transform bg-gray-800 rounded-lg shadow-2xl hover:scale-105">
        <div className="flex items-center space-x-6">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="transition-shadow border-4 border-purple-500 rounded-full shadow-lg w-28 h-28 hover:shadow-purple-500/50"
            />
          ) : (
            <div className="flex items-center justify-center transition-shadow bg-gray-700 border-4 border-purple-500 rounded-full shadow-lg w-28 h-28 hover:shadow-purple-500/50">
              <span className="text-3xl font-bold text-gray-300">
                {displayName ? displayName.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-3xl font-bold text-purple-400 transition-colors hover:text-purple-300">
              {displayName}
            </h2>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="p-6 mt-8 transition-shadow bg-gray-700 rounded-lg shadow-inner hover:shadow-lg">
          <h3 className="pb-2 text-xl font-semibold text-purple-300 border-b border-purple-500">
            Informations du profil
          </h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-300">Username :</span>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    className="px-3 py-1 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={updateUsername}
                    className="flex items-center px-3 py-1 text-white transition-shadow bg-green-600 rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="flex items-center px-3 py-1 text-white transition-shadow bg-red-600 rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-end space-x-2">
                  <span>{displayName}</span>
                  <button
                    onClick={handleEditClick}
                    className="text-gray-400 transition-colors hover:text-purple-400"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            <div>
              <span className="font-medium text-gray-300">Email :</span>{" "}
              {user?.email}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Link
            to="/settings"
            className="px-6 py-2 text-white transition-shadow bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 hover:shadow-lg"
          >
            Paramètres
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
