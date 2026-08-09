// src/components/Modal.jsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

// Simple reusable modal using Tailwind classes and a portal
export const Modal = ({ isOpen, onClose, children }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        {children}
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
