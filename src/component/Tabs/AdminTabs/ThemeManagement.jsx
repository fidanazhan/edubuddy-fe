import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const themeManagement = () => {
    const [loginLogo, setLoginLogo] = useState("null");
    const [banner, setBanner] = useState("null");
    const [dashboardLogo, setDashboardLogo] = useState("null");
    const token = localStorage.getItem("accessToken");
    const subdomain = window.location.hostname.split(".")[0];
    const { t, ready } = useTranslation(["admin", "common"]);

    useEffect(() => {
        fetchImg();
    }, []);

    const fetchImg = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/config/theme`, {
                headers: { "x-tenant": subdomain },
            });
            console.log(response.data);
            console.log(response.data.loginLogoUrl);
            console.log(response.data.bannerUrl);
            console.log(response.data.dashboardLogoUrl);
            if (response.data.loginLogoUrl) {
                setLoginLogo(response.data.loginLogoUrl);
                console.log(loginLogo);
            }
            if (response.data.bannerUrl) {
                setBanner(response.data.bannerUrl);
                console.log(banner);
            }
            if (response.data.dashboardLogoUrl) {
                setDashboardLogo(response.data.dashboardLogoUrl);
                console.log(dashboardLogo);
            }
        } catch (error) {
            console.error("Error fetching img:", error);
        }
    };

    const onLoginLogoDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles[0]) {
            setLoginLogo(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps: getLoginLogoDropzoneProps, getInputProps: getLoginLogoInputProps } = useDropzone({
        onDrop: onLoginLogoDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
    });

    const onBannerDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles[0]) {
            setBanner(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps: getBannerDropzoneProps, getInputProps: getBannerInputProps } = useDropzone({
        onDrop: onBannerDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
    });


    const onDashboardLogoDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles[0]) {
            setDashboardLogo(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps: getDashboardLogoDropzoneProps, getInputProps: getDashboardLogoInputProps } = useDropzone({
        onDrop: onDashboardLogoDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
    });

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append("loginLogo", loginLogo);
        formData.append("banner", banner);
        formData.append("dashboardLogo", dashboardLogo);
        // formData.append([`${subdomain} Banner`, `${subdomain} loginLogo`, `${subdomain} dashboardLogo`])
        formData.append("tag", [`loginLogo`, `banner`, `dashboardLogo`])
        try {
            const response = await axios.put('http://localhost:5000/api/config/upload', formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "x-tenant": subdomain
                },
            });
            console.log('Image URLs saved to database:', response.data);
        } catch (error) {
            console.error('Error saving image URLs:', error);
        }
    };

    if (!ready) return null;

    return (
        <div className="p-6 mb-4">
            <h1 className="text-xl font-semibold">{t("admin:system.theme.title")}</h1>
            <form onSubmit={handleFormSubmit} className="space-y-4">


                <div>
                    <span>{t("admin:system.theme.login_logo")}</span>
                    <div {...getLoginLogoDropzoneProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
                        <input {...getLoginLogoInputProps()} />
                        <p className="text-gray-500">Drag & drop a file here, or click to upload.</p>
                    </div>
                    {loginLogo && (
                        <div>
                            <img
                                // src={URL.createObjectURL(loginLogo)}
                                alt="Login Logo Preview"
                                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                            />
                        </div>
                    )}
                    <img
                        // src={URL.createObjectURL(loginLogo)}
                        alt="Login Logo Preview"
                        style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                    />
                </div>

                <div>
                    <span>Banner</span>
                    <div {...getBannerDropzoneProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
                        <input {...getBannerInputProps()} />
                        <p className="text-gray-500">Drag & drop a file here, or click to upload.</p>
                    </div>
                    {banner && (
                        <div>
                            <img
                                // src={URL.createObjectURL(banner)}
                                alt="Banner Preview"
                                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                            />
                        </div>
                    )}
                </div>


                <div>
                    <span>Dashboard Logo</span>
                    <div {...getDashboardLogoDropzoneProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
                        <input {...getDashboardLogoInputProps()} />
                        <p className="text-gray-500">Drag & drop a file here, or click to upload.</p>
                    </div>
                    {dashboardLogo && (
                        <div>
                            <img
                                // src={URL.createObjectURL(dashboardLogo)}
                                alt="Dashboard Logo Preview"
                                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                            />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default themeManagement;