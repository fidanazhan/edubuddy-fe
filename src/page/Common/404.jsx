import { Link } from "react-router-dom";
import { CircleSlash2 } from "lucide-react";
import { motion } from "framer-motion";

const NotFoundPage = () => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
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
                    <CircleSlash2 className="w-16 h-16 text-red-500 mx-auto" />
                </motion.div>
                <h1 className="text-3xl font-semibold text-red-600 mt-4">
                    Tenant Not Found
                </h1>
                <p className="text-gray-600 mt-2">
                    The tenant <b>{subdomain}</b> you searching for does not exist in our system.
                </p>
                <p className="mt-2">
                    Please check the link carefully for spelling error.
                </p>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;
