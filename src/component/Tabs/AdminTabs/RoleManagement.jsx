import React from 'react'
import { useTranslation } from 'react-i18next';

const RoleManagement = () => {
    const { t, ready } = useTranslation(["admin", "common"]);

    if (!ready) return null;

    return (
        <div>
            {t("admin:users.role.title")}
        </div>
    )
}

export default RoleManagement;