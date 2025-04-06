import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Pencil } from "lucide-react";

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [newDisplayName, setNewDisplayName] = useState(user?.user_metadata.user_name || user?.email || "");
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const displayName = user?.user_metadata.user_name || user?.email;
  const avatar = user?.user_metadata.avatar_url;

  const updateUsername = async () => {
    if (!user) return;

    try {
      await updateUser(newDisplayName);
      setIsEditing(false); // Exit edit mode after successful update
      alert("Username updated successfully!");
    } catch (error) {
      console.error("Error updating username:", error);
      alert("Failed to update username.");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true); // Enter edit mode
  };

  const handleCancelClick = () => {
    setIsEditing(false); // Cancel edit mode
    setNewDisplayName(user?.user_metadata.user_name || user?.email || ""); // Reset to original value
  };

  return (
    <div className="min-h-screen pt-20 text-gray-100 transition-all duration-700 ease-in-out bg-gradient-to-b from-black via-gray-900 to-purple-900">
      <div className='fixed inset-0 bg-[url("./grid.svg")] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20'></div>
      <div className="relative z-10 max-w-3xl p-6 mx-auto border bg-white/5 backdrop-blur-sm border-white/10 rounded-xl">
        <h1 className="mb-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">Mon Profil</h1>
        <div className="flex items-center space-x-6">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-24 h-24 border border-gray-300 rounded-full"
            />
          ) : (
            <div className="flex items-center justify-center w-24 h-24 bg-gray-200 border border-gray-300 rounded-full">
              <span className="text-2xl text-gray-500">
                {displayName ? displayName.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-100">{displayName}</h2>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-300">Informations du profil</h3>
          <div className="mt-2 space-y-2">
            <p className="text-gray-400">
              <span className="font-medium text-gray-300">Username :</span>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    className="px-2 py-1 ml-2 text-white bg-gray-700 rounded"
                  />
                  <button onClick={updateUsername} className="px-2 py-1 ml-2 text-white bg-blue-600 rounded">
                    Save
                  </button>
                  <button onClick={handleCancelClick} className="px-2 py-1 ml-2 text-white bg-gray-500 rounded">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {displayName}
                  <button onClick={handleEditClick} className="ml-2 text-gray-300 hover:text-white">
                    <Pencil />
                  </button>
                </>
              )}
            </p>
            <p className="text-gray-400">
              <span className="font-medium text-gray-300">Email :</span> {user?.email}
            </p>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Link to="/settings" className="px-4 py-2 transition bg-gray-600 rounded-lg hover:bg-gray-700">
            Paramètres
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;