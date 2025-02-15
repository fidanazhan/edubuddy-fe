import React, { useState, useEffect } from "react";
import axios from "axios";

const customStyles = {
    control: (provided) => ({
        ...provided,
        width: "400px",
        borderRadius: "8px",
        boxShadow: "none",
        textAlign: "left",
    }),
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? "black" : "grey",
        backgroundColor: state.isSelected ? "lightgrey" : "white",
    }),
};


const TransactionManagement = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchSenderName, setSenderName] = useState("");
    const [searchReceiverName, setReceiverName] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // const [users, setUsers] = useState([]);


    const transactionsPerPage = 10;
    const token = localStorage.getItem("accessToken");
    const subdomain = window.location.hostname.split(".")[0];

    useEffect(() => {
        fetchTransactions();
        // fetchUsers();
        setCurrentPage(1);
    }, []);


    // const fetchUsers = async () => {
    //     try {
    //         const response = await axios.get(`http://localhost:5000/api/transaction/getUsers`, {
    //             headers: {
    //                 "Authorization": `Bearer ${token}`,
    //                 "x-tenant": subdomain
    //             },
    //         });
    //         console.log("DONE FETCHING")
    //         console.log(response)
    //         setUsers(response.data);
    //     } catch (error) {
    //         console.error("Error fetching users:", error);
    //     }
    // };

    const fetchTransactions = async (page = 1, limit = transactionsPerPage) => {
        setLoading(true);  // Show loading immediately when search is triggered
        // console.log(searchSenderName, searchReceiverName)
        try {

            setTimeout(async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/transaction`, {
                        params: { page, limit, searchSender: searchSenderName || undefined, searchReceiver: searchReceiverName || undefined },
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "x-tenant": subdomain
                        },
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

    const handlePageChange = (pageNumber) => {
        fetchTransactions(pageNumber);
        setCurrentPage(pageNumber);
    };

    const handleSearch = () => {
        console.log(searchSenderName)
        console.log(searchReceiverName)
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
                    type="submit"
                    onClick={handleSearch}
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
                        <table className="table-auto w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-200 px-4 py-2">No</th>
                                    <th className="border border-gray-200 px-4 py-2">Sender</th>
                                    <th className="border border-gray-200 px-4 py-2">Receiver</th>
                                    <th className="border border-gray-200 px-4 py-2">Sender's Tokens Before</th>
                                    <th className="border border-gray-200 px-4 py-2">Sender's Tokens After</th>
                                    <th className="border border-gray-200 px-4 py-2">Receiver's Tokens Before</th>
                                    <th className="border border-gray-200 px-4 py-2">Receiver's Tokens After</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length > 0 ? (
                                    transactions.map((transaction, index) => (
                                        <tr key={transaction._id} className="text-center">
                                            <td className="border border-gray-200 px-4 py-2 text-sm">
                                                {(currentPage - 1) * transactionsPerPage + index + 1}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-2 text-sm">{transaction.sender.senderName}</td>
                                            <td className="border border-gray-200 px-3 py-2 text-sm">{transaction.receiver.receiverName}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-sm">{transaction.senderToken.before}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-sm">{transaction.senderToken.after}</td>
                                            <td className="border border-gray-200 px-1 py-2 text-sm">{transaction.receiverToken.before}</td>
                                            <td className="border border-gray-200 px-1 py-2 text-sm">{transaction.receiverToken.after}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="border border-gray-200 px-4 py-2 text-center">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
