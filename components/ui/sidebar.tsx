import React from "react";
import { FaUserCircle } from "react-icons/fa";

const Sidebar: React.FC = () => {
  return (
    <div className="h-screen w-20 bg-black flex flex-col items-center pt-4">
      <button className="text-white p-2 hover:bg-gray-800 rounded-full">
        <FaUserCircle size={28} />
      </button>
    </div>
  );
};

export default Sidebar;
