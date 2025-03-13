import { useEffect, useState } from "react";
import { FaUpload, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import api from "../../../api/axios";
import { useTranslation } from 'react-i18next';

const getTenantIdFromSubdomain = () => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    return subdomain; // This will return "tenantname"
};

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { t, ready } = useTranslation(["admin", "common", "modal"]);

    const token = localStorage.getItem("accessToken");
    const tenantId = getTenantIdFromSubdomain();

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        setLoading(true);

        try {
            // Simulate delay correctly
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await api.get("/api/role/", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "x-tenant": tenantId
                }
            });
            console.log(response.data)
            setRoles(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            console.log(roles)
        }
    };

    if (!ready) return null;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">{t("admin:users.role.title")}</h1>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            {loading ? (
                <div className="flex flex-col items-center h-52">
                    {/* Animated Spinner */}
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full shadow-md overflow-hidden">
                            <thead className="bg-gray-200 dark:bg-gray-600">
                                <tr>
                                    <th className="py-2 px-4 border">{t("common:table.name")}</th>
                                    <th className="py-2 px-4 border">{t("common:table.code")}</th>
                                    <th className="py-2 px-4 border">{t("common:table.permission")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.length > 0 ? (
                                    roles.map((role) => (
                                        <tr key={role._id} className="border-t">
                                            <td className="py-2 px-4 border text-sm">{role.name}</td>
                                            <td className="py-2 px-4 border text-sm">{role.code}</td>
                                            <td className="py-2 px-4 border text-sm">
                                                {role.permissions.map((perm) => (
                                                    <span
                                                        key={perm.id}
                                                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded-md text-xs mr-1"
                                                    >
                                                        {perm.name}
                                                    </span>
                                                ))}
                                            </td>
                                        </tr>
                                    ))) : (
                                    <tr>
                                        <td colSpan="5" className="border border-gray-200 px-4 py-2 text-center">
                                            {t("admin:users.group.not_found")}
                                        </td>
                                    </tr>
                                )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleManagement;
