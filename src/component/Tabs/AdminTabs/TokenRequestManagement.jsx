import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/JWTContext.jsx'
import axios from 'axios';
import { format } from 'date-fns';
import { Tooltip } from 'react-tooltip';

// Pending
import { Clock, Hourglass, Loader2, MoreHorizontal, Bell } from "lucide-react";
// Approved
import { CheckCircle, ThumbsUp, BadgeCheck, CircleCheck, Check } from "lucide-react";
// Rejected
import { XCircle, ThumbsDown, Ban, X } from "lucide-react";

const TokenRequestScreen = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("Pending");
    const [requests, setRequest] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null)

    const subdomain = window.location.hostname.split(".")[0];
    const requestPerPage = 10;

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const tabs = [
        { name: "Pending", icon: <Clock /> },
        { name: "Approved", icon: <ThumbsUp /> },
        { name: "Rejected", icon: <ThumbsDown /> },
    ];

    const formattedDate = (timestamp) => {
        return format(new Date(timestamp), 'MM/dd/yyyy hh:mm a')
    };

    useEffect(() => {
        fetchRequest();
    }, [activeTab]);

    useEffect(() => {
        console.log(requests);
    }, [requests]);

    const fetchRequest = async (page = 1, limit = requestPerPage) => {
        setIsLoading(true)
        try {
            const status =
                activeTab === "Pending" ? 0 :
                    activeTab === "Approved" ? 1 :
                        activeTab === "Rejected" ? 2 :
                            null;
            setTimeout(async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/request/token/status`, {
                        params: { page, limit, status },
                        headers: { "x-tenant": subdomain },
                    });
                    console.log(response.data.data);
                    setTotalPages(response.data.pages || 1);
                    setCurrentPage(page);
                    setRequest(response.data.data);
                } catch (error) {
                    console.error("Error fetching requests:", error);
                    setRequest([]);
                }
                setIsLoading(false)
            }, 1000);
        } catch (error) {
            console.error(`Error fetching ${activeTab} request:`, error);
        }
    };

    const handlePageChange = (pageNumber) => {
        fetchRequest(pageNumber);
        setCurrentPage(pageNumber);
    };

    const handleSubmitApprove = async (request) => {
        console.log(request)
        try {
            await axios.put(`http://localhost:5000/api/request/token/approve`, request, {
                headers: { "x-tenant": subdomain },
            });
            setSelectedRequest(null);
            fetchRequest(currentPage);
        } catch (error) {
            console.error("Error approving request:", error);
        }
    };


    const handleSubmitReject = async (request) => {
        console.log(request)
        try {
            await axios.put(`http://localhost:5000/api/request/token/reject`, request, {
                headers: { "x-tenant": subdomain },
            });
            setSelectedRequest(null);
            fetchRequest(currentPage);
        } catch (error) {
            console.error("Error rejecting request:", error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Request</h1>
            </div>
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                {tabs.map((tab, index) => {
                    return (
                        <button
                            key={index}
                            onClick={() => setActiveTab(tab.name)}
                            className={`flex items-center px-4 py-2 text-sm font-medium transition-colors duration-300 ${tab.name === activeTab
                                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                }`}
                        >
                            {tab.icon}
                            <span className="ml-2">{tab.name}</span>
                        </button>
                    );
                })}
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center mt-5">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div>
                    {/* <h1 className="text-xl font-bold mb-4 pt-2">{activeTab} Request</h1> */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden ">
                        {requests.map((request) => (
                            <div
                                key={request._id}
                                className="flex items-start px-4 py-3 border-b last:border-none hover:bg-gray-50 transition"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                                        {request.status === 0 && (
                                            <>
                                                <Hourglass className="text-blue-500" />
                                            </>
                                        )}
                                        {request.status === 1 && (
                                            <>
                                                <CheckCircle className="text-green-500" />;
                                            </>
                                        )}
                                        {request.status === 2 && (
                                            <>
                                                <Ban className="text-red-500" />
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-md text-gray-800">
                                        {request.requester?.name} has requested {request?.amount} tokens.
                                        <a
                                            id={`anchor-reason-${request._id}`}
                                            className='ml-4 text-gray-400 hover:text-blue-500 hover:shadow-md transition'
                                        >
                                            Reason
                                        </a>
                                        <Tooltip
                                            anchorSelect={`#anchor-reason-${request._id}`}
                                            content={request?.reason ? request.reason : "No reason Provided"}
                                        />
                                    </p>
                                    <span className="text-sm text-gray-400 mr-4">Created : {formattedDate(request.createdAt)} | Updated : {formattedDate(request.updatedAt)}</span>
                                </div>
                                {request.status === 0 && (
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            className="text-gray-400 hover:text-green-500 hover:shadow-md transition ml-2"
                                            onClick={() => {
                                                setSelectedRequest(request);
                                                handleSubmitApprove(request);
                                            }}
                                            aria-label="Approve Request"
                                        >
                                            <Check className="text-green-500" />
                                        </button>
                                        <button
                                            className="text-gray-400 hover:text-red-500 hover:shadow-md transition ml-2"
                                            onClick={() => {
                                                setSelectedRequest(request);
                                                handleSubmitReject(request);
                                            }}
                                            aria-label="Reject Request"
                                        >
                                            <X className="text-red-500" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {requests.length === 0 && (
                            <div className="text-center py-4 text-gray-600">No {activeTab} Request.</div>
                        )}
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
                </div >
            )}

        </div >
    );
};

export default TokenRequestScreen;


{/* {!isLoading && activeTab === "Pending" && (
                <div>
                    <h1 className="text-xl font-bold mb-4">Pending Request</h1>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        {requests.map((request) => (
                            <div
                                key={request._id}
                                className="flex items-start px-4 py-3 border-b last:border-none hover:bg-gray-50 transition"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                                        ICON
                                    </div>
                                </div>
                                <div className="ml-4 flex-1">

                                    <p className="text-sm text-gray-600">{request.requester.name} has requested {request.amount} </p>
                                </div>
                                <button
                                    className="text-gray-400 hover:text-green-500 transition ml-2"
                                    // onClick={() => deleteNotification(request.id)}
                                    aria-label="Delete notification"
                                >
                                    Approve
                                </button>
                                <button
                                    className="text-gray-400 hover:text-red-500 transition ml-2"
                                    // onClick={() => deleteNotification(request.id)}
                                    aria-label="Delete notification"
                                >
                                    Reject
                                </button>
                            </div>
                        ))}
                        {requests.length === 0 && (
                            <div className="text-center py-4 text-gray-600">No Pending Request.</div>
                        )}
                    </div>
                </div>
            )}
            {!isLoading && activeTab === "Approved" && (
                <div>
                    <h1 className="text-xl font-bold mb-4">Approved Request</h1>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        {requests.map((request) => (
                            <div
                                key={request._id}
                                className="flex items-start px-4 py-3 border-b last:border-none hover:bg-gray-50 transition"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                                        ICON
                                    </div>
                                </div>
                                <div className="ml-4 flex-1">

                                    <p className="text-sm text-gray-600">{request.requester.name} has requested {request.amount} </p>
                                </div>
                                <button
                                    className="text-gray-400 hover:text-green-500 transition ml-2"
                                    // onClick={() => deleteNotification(request.id)}
                                    aria-label="Delete notification"
                                >
                                    Approve
                                </button>
                                <button
                                    className="text-gray-400 hover:text-red-500 transition ml-2"
                                    // onClick={() => deleteNotification(request.id)}
                                    aria-label="Delete notification"
                                >
                                    Reject
                                </button>
                            </div>
                        ))}
                        {requests.length === 0 && (
                            <div className="text-center py-4 text-gray-600">No Approved Request.</div>
                        )}
                    </div>
                </div>
            )}
            {!isLoading && activeTab === "Rejected" && (
                <div>
                    <h1 className="text-xl font-bold mb-4">Rejected Request</h1>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        {requests.map((request) => (
                            <div
                                key={request._id}
                                className="flex items-start px-4 py-3 border-b last:border-none hover:bg-gray-50 transition"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                                        ICON
                                    </div>
                                </div>
                                <div className="ml-4 flex-1">

                                    <p className="text-sm text-gray-600">{request.requester.name} has requested {request.amount} tokens.</p>
                                </div>
                                <button
                                    className="text-gray-400 hover:text-green-500 transition ml-2"
                                    // onClick={() => deleteNotification(request.id)}
                                    aria-label="Delete notification"
                                >
                                    Approve
                                </button>
                                <button
                                    className="text-gray-400 hover:text-red-500 transition ml-2"
                                    // onClick={() => deleteNotification(request.id)}
                                    aria-label="Delete notification"
                                >
                                    Reject
                                </button>

                            </div>
                        ))}
                        {requests.length === 0 && (
                            <div className="text-center py-4 text-gray-600">No Rejected Request.</div>
                        )}
                    </div>
                </div>
            )} */}