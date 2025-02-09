import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

const ForbiddenPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        >
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
        </motion.div>
        <h1 className="text-3xl font-semibold text-red-600 mt-4">
          Oops! Access Denied
        </h1>
        <p className="text-gray-600 mt-2">
          You don’t have permission to view this page. Please contact your university administrator.
        </p>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Link
            to="/"
            className="mt-4 inline-block px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForbiddenPage;
