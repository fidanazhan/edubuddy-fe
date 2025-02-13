import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import UserModal from "../../Admin/UserModal";
import ConfirmationPopup from "../../Admin/ConfirmationPopup";
import { FaLayerGroup } from "react-icons/fa";

// const initialTransactions = [
//     {
//         id: 1,
//         sender: { name: "Ali" },
//         receiver: { name: "Abu" },
//         amount: 100,
//         senderBefore: 200,
//         receiverBefore: 50,
//         senderAfter: 100,
//         receiverAfter: 150,
//         timestamp: "2 mins ago",
//     },
//     {
//         id: 2,
//         sender: "Ali",
//         receiver: "Abu",
//         amount: 50,
//         senderBefore: 250,
//         receiverBefore: 0,
//         senderAfter: 200,
//         receiverAfter: 50,
//         timestamp: "10 mins ago",
//     },
//     {
//         id: 3,
//         sender: "Alia",
//         receiver: "Abi",
//         amount: 1,
//         senderBefore: 200,
//         receiverBefore: 0,
//         senderAfter: 199,
//         receiverAfter: 1,
//         timestamp: "1 hour ago",
//     },
// ];


const TransactionManagement = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchSenderName, setSenderName] = useState("");
    const [searchReceiverName, setReceiverName] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const transactionsPerPage = 5;
    const subdomain = window.location.hostname.split(".")[0];

    useEffect(() => {
        fetchTransactions();
        setCurrentPage(1);
    }, []);

    const fetchTransactions = async (page = 1, limit = transactionsPerPage) => {
        setLoading(true);  // Show loading immediately when search is triggered
        // console.log(searchSenderName, searchReceiverName)
        try {

            setTimeout(async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/transaction`, {
                        params: { page, limit, searchSender: searchSenderName || undefined, searchReceiver: searchReceiverName || undefined  },
                        headers: { "x-tenant": subdomain },
                    });

                    setTransactions(Array.isArray(response.data.data) ? response.data.data : []);
                    setTotalPages(response.data.pages || 1);
                    setCurrentPage(page);
                } catch (error) {
                    console.error("Error fetching transactions:", error);
                    setTransactions([]);
                }
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setLoading(false);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "info":
                return <Bell className="text-blue-500" />;
            case "success":
                return <CheckCircle className="text-green-500" />;
            case "error":
                return <XCircle className="text-red-500" />;
            default:
                return <Bell />;
        }
    };

    const handlePageChange = (pageNumber) => {
        fetchTransactions(pageNumber);
        setCurrentPage(pageNumber);
    };

    const handleSearch = () => {
        fetchTransactions(1, transactionsPerPage); // Trigger search query to the backend
    };


    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Transaction List</h1>
            </div>

            <div className="flex items-center mb-4">
                <input
                    type="text"
                    placeholder="Search Sender..."
                    className="border rounded-lg px-4 py-2 w-full"
                    value={searchSenderName}
                    onChange={(e) => setSenderName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search Receiver..."
                    className="border rounded-lg px-4 py-2 w-full"
                    value={searchReceiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                />
                <button
                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={handleSearch} // Call search function when clicked
                >
                    Search
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center">
                    {/* Animated Spinner */}
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div>
                    <div>
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            {transactions.length > 0 ? (
                                transactions.map((transaction, index) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-start px-4 py-3 border-b last:border-none hover:bg-gray-50 transition"
                                    >
                                        {/* <div className="flex-shrink-0">
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                                                {getIcon(notification.type)}
                                            </div>
                                        </div> */}
                                        <div className="ml-4 flex-1">

                                            <p className="text-sm text-gray-600">{transaction.sender.name} has sent {transaction.amount} tokens to {transaction.receiver.name}</p>
                                            <span className="text-xs text-gray-400">Sender's Token Before : {transaction.senderBefore} Sender's Token After : {transaction.senderAfter}</span>
                                            <br />
                                            <span className="text-xs text-gray-400">Receiver's Token Before : {transaction.receiverBefore} Sender's Token After : {transaction.receiverAfter}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-gray-600">No transactions available.</div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center mt-4 gap-2">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                className={`px-3 py-1 rounded-lg border ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white"
                                    }`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>

            )}
        </div>
    );
};

export default TransactionManagement;
