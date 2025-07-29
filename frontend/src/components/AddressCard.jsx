import React from "react";
import { LuMapPin, LuPencil, LuPencilLine, LuTrash2 } from "react-icons/lu";

const AddressCard = ({ address, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_2px_12px_-3px_rgba(61,63,68,0.1)] dark:shadow-[0_2px_12px_-3px_rgba(0,0,0,0.4)] p-4 relative border dark:border-gray-700">
      {/* Icon */}
      <LuMapPin className="absolute top-4 left-4 text-green-600 w-5 h-5" />

      {/* Content */}
      <div className="pl-8 space-y-2">
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          {address.name}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{address.street}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {address.city}, {address.state} - {address.zip}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Phone: {address.phone}
        </p>
      </div>

      {/* Actions */}
      <div className="absolute top-4 right-4 flex gap-4">
        <button
          onClick={onEdit}
          className="text-blue-500 hover:text-blue-700"
          title="Edit"
        >
          <LuPencil />
        </button>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
          title="Delete"
        >
          <LuTrash2 />
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
