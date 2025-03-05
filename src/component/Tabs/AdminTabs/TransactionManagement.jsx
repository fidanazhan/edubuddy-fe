import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const TokenTransactionManagement = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchSenderName, setSenderName] = useState("");
    const [searchReceiverName, setReceiverName] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    const transactionsPerPage = 10;
    const token = localStorage.getItem("accessToken");
    const subdomain = window.location.hostname.split(".")[0];

    const formattedDate = (timestamp) => {
        return format(new Date(timestamp), 'MM/dd/yyyy hh:mm a')
    };

    useEffect(() => {
        fetchTransactions();
        setCurrentPage(1);
    }, []);


    const fetchTransactions = async (page = 1, limit = transactionsPerPage) => {
        setLoading(true);
        try {

            setTimeout(async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/transaction/token`, {
                        params: {
                            page, limit, searchSender: searchSenderName || undefined, searchReceiver: searchReceiverName || undefined,
                            startDate: startDate || undefined, endDate: endDate || startDate || undefined
                        },
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
        console.log(startDate)
        console.log(endDate)
        fetchTransactions(1, transactionsPerPage); // Trigger search query to the backend
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        // Ensure end date is not earlier than start date
        if (!date) {
            setEndDate(null);
        }
        if (endDate && date > endDate) {
            setEndDate(null);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Tokens Transaction History</h1>
            </div>

            <div className="flex items-center mb-4 space-x-2">
                <input
                    type="text"
                    placeholder="Search Sender..."
                    className="border rounded-lg px-4 py-2 w-auto dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300/80"
                    value={searchSenderName}
                    onChange={(e) => setSenderName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search Receiver..."
                    className="border rounded-lg px-4 py-2 w-auto dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300/80"
                    value={searchReceiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                />
                <DatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="border rounded-lg px-4 py-2 w-auto dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300/80"
                    placeholderText="Choose start date"
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    disabled={!startDate}
                    className="border rounded-lg px-4 py-2 w-auto dark:bg-gray-700 dark:text-gray-300/80"
                    placeholderText="Choose end date"
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
                        <table className="table-auto w-full border-collapse border border-gray-200 dark:text-gray-300/80 dark:border-gray-900 dark:bg-gray-900">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-600 dark:text-gray-100/80">
                                    <th className="border border-gray-200 px-4 py-2">No</th>
                                    <th className="border border-gray-200 px-4 py-2">Sender</th>
                                    <th className="border border-gray-200 px-4 py-2">Receiver</th>
                                    <th className="border border-gray-200 px-4 py-2">Amount</th>
                                    <th className="border border-gray-200 px-4 py-2">Transaction Date</th>
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
                                            <td className="border border-gray-200 px-4 py-2 text-sm">{transaction.amount}</td>
                                            <td className="border border-gray-200 px-4 py-2 text-sm">{formattedDate(transaction.createdAt)}</td>
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
                                className={`px-3 py-1 rounded-lg border ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-900 dark:text-gray-300 dark:border-gray-900"
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

export default TokenTransactionManagement;
