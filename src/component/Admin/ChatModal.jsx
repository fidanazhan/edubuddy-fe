import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Toast from "../Toast/Toast";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import api from '../../api/axios'
import { IoMdClose } from "react-icons/io";

const ChatModal = ({ title, onClose, initialValues, onSubmit, token, subdomain, refetch }) => {
    const [formData, setFormData] = useState({
        title: "",
        id: "",
    });

    const [errors, setErrors] = useState({}); // Store validation errors
    const [toast, setToast] = useState(null);
    const { t } = useTranslation(["modal", "common"])
    const queryClient = useQueryClient();
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (initialValues) {
            setFormData({
                title: initialValues.title || "",
                id: initialValues._id || "",
            });
        }

    }, [initialValues]);

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.title.trim()) newErrors.title = "Title is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            console.log("Form is invalid: do not submit");
            return
        };
        if (validateForm()) {
            const payload = {
                ...formData,
            };
            try {
                const headers = {
                    "Content-Type": "application/json",
                    "x-tenant": subdomain,
                    "Authorization": `Bearer ${token}`,
                };
                const response = await api.put(`/api/chats/${formData.id}/title`, payload, { headers });
                if (response.status === 201 || response.status === 200) {
                    // showToast("Title updated successfully!", "bg-green-500", "success");
                    // refetch();
                    // setTimeout(() => {
                    //     onSubmit();
                    //     onClose();
                    // }, 2000);
                    onClose()
                }
            } catch (error) {
                console.error('Error:', error);
                showToast("Updating chat title failed!", "bg-red-500", "error");
            }
        }
    };

    const showToast = (message, color, status) => {
        setToast({ message, color, status });
        setTimeout(() => setToast(null), 3000);
    };

    const deleteChat = async (chatId) => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + `/api/chats/${chatId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "x-tenant": subdomain,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete chat");
            }

            queryClient.invalidateQueries(["userChats"]); // Force refetch after deleting
            showToast("Chat deleted successfully!", "bg-green-500", "success");
            // if (id === chatId) {
            //     navigate("/dashboard");
            // }
            // setTimeout(() => {
            //     onSubmit();
            //     onClose();
            // }, 2000);
            onClose();

        } catch (error) {
            console.error("Error deleting chat:", error);
            showToast("Failed to delete chat!", "bg-red-500", "error");
        }
    };

    const closeModal = () => {
        onClose();
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[30rem] p-6">
                <div className="text-xl font-bold mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">{title}</h2>
                    <button
                        className="text-white hover:text-gray-900 bg-red-500 p-1 rounded-md"
                        onClick={closeModal}
                    >
                        <IoMdClose />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* title Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-900">Title</label>
                        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            className="text-gray-900 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-center gap-2 mb-2 w-full">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full"
                        >
                            {t("common:button.rename")}
                        </button>
                    </div>
                </form>
                <hr className="border-gray-300 dark:border-gray-700 mt-2 mb-2" />
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Or Delete Chat?</h2>
                <div className="flex justify-center gap-2 h-9">
                    <button
                        className="rounded-lg shadow px-2 w-full text-white bg-red-600 border-red-500 h-full hover:bg-red-700"
                        onClick={() => formData.id && deleteChat(formData.id)} // Ensure formData.id is not empty
                    >
                        Delete
                    </button>
                </div>
            </div>
            {toast && (
                <Toast
                    message={toast.message}
                    color={toast.color}
                    status={toast.status}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default ChatModal;
