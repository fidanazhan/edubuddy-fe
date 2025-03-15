import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import api from '../../api/axios'

const Modal = ({ title, onClose, onSubmit, initialValues, isEdit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    code: ""
  });

  const [errors, setErrors] = useState({}); // Store validation errors
  const token = localStorage.getItem("accessToken");
  const { t, ready } = useTranslation(["common", "modal"]);

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || "",
        description: initialValues.description || "",
        code: initialValues.code || "",
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
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (!formData.code.trim() || /\s/.test(formData.code)) {
      newErrors.code = "Code is required and cannot contain spaces.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("FormData:" + JSON.stringify(formData))
    if (!validateForm()) return;
    if (validateForm()) {

      const payload = {
        ...formData
      };

      try {

        const tenantHost = window.location.hostname.split(".")[0];
        const headers = {
          'Content-Type': 'application/json',
          'x-tenant': tenantHost,
          "Authorization": `Bearer ${token}`,
        };

        let response;
        if (isEdit) {
          response = await api.put(`/api/group/${initialValues._id}`, payload, { headers });
        } else {
          response = await api.post("/api/group", payload, { headers });
        }

        if (response.status === 201 || response.status === 200) {
          onSubmit();
          onClose();
        }

      } catch (error) {
        console.error('Error:', error);
      }
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-[30rem] p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{t("common:table.name")}</label>
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:border-2 overflow-hidden"
              required
            />
          </div>

          {/* Description Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{t("common:table.description")}</label>
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            <textarea
              type="text"
              name="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:border-2 overflow-hidden"
              required
            />
          </div>

          {/* Code Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{t("common:table.code")}</label>
            {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:border-2 overflow-hidden"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              onClick={onClose}
            >
              {t("common:button.cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {t("common:button.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
