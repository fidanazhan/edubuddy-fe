import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Toast from "../Toast/Toast";

const RequestModal = ({ title, type, onClose, onSubmit, initialValues, subdomain }) => {
    const [formData, setFormData] = useState({
        name: "",
        requester: "",
        amount: 0,
        reason: "",
        status: 0,
    });

    const [errors, setErrors] = useState({}); // Store validation errors
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (initialValues) {
            setFormData({
                name: initialValues.name || "",
                requester: initialValues._id || "",
            });
        }

    }, [initialValues]);

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required.";

        if (!formData.amount.trim() || Number(formData.amount) <= 0) {
            newErrors.amount = "Amount must be greater than 0.";
        }

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
                    'Content-Type': 'application/json',
                    'x-tenant': subdomain,
                };
                const response = await axios.post(`http://localhost:5000/api/request/${type}`, payload, { headers });
                if (response.status === 201 || response.status === 200) {
                    showToast("Request sent successfully!", "bg-green-500", "success");
                    setTimeout(() => {
                        onSubmit();
                        onClose();
                    }, 2000);
                }
            } catch (error) {
                console.error('Error:', error);
                showToast("Request failed to be sent!", "bg-red-500", "error");
            }
        }
    };

    const showToast = (message, color, status) => {
        setToast({ message, color, status });
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[30rem] p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">{title}</h2>
                <form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-900">Name</label>
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="text-gray-900 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Amount Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-900">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={(e) => handleInputChange("amount", e.target.value)}
                            className="text-gray-900 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
                    </div>

                    {/* Reason Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-900">Reason<span className="ml-2 text-gray-500 text-sm">(Optional)</span></label>
                        <input
                            type="text"
                            name="reason"
                            value={formData.reason}
                            onChange={(e) => handleInputChange("reason", e.target.value)}
                            className="text-gray-900 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>



                    {/* Buttons */}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
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

export default RequestModal;
