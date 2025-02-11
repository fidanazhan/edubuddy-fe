import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from "react-icons/fa";

const statusIcons = {
  success: <FaCheckCircle className="w-5 h-5" />,
  error: <FaTimesCircle className="w-5 h-5" />,
  warning: <FaExclamationTriangle className="w-5 h-5" />,
  info: <FaInfoCircle className="w-5 h-5" />,
};

const Toast = ({ message, color = "bg-gray-800", status = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center ${color} text-white px-4 py-3 rounded-lg shadow-lg fixed top-5 right-5`}
    >
      {statusIcons[status] || statusIcons.info}
      <span className="ml-2 mr-6">{message}</span>
      <button onClick={onClose} className="ml-auto text-white hover:opacity-75">
        <FaTimes />
      </button>
    </motion.div>
  );
};

export default Toast;
