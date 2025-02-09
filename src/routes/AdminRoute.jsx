import Dashboard from '../page/Student/Dashboard'
import StudentLayout from '../layout/StudentLayout'
import Chat from '../page/Student/Chat'
import Workspace from '../page/Student/Workspace'
import AdminPanel from '../page/Student/AdminPanel'
import UserManagement from '../component/Tabs/AdminTabs/UserManagement'
import RoleManagement from '../component/Tabs/AdminTabs/RoleManagement'
import GroupManagement from '../component/Tabs/AdminTabs/GroupManagement'
import DashboardTab from '../component/Tabs/dashboardTab'
import DocumentTab from '../component/Tabs/documentTab'
import NotificationTab from '../component/Tabs/notificationTab'
import TokenTab from '../component/Tabs/tokenTab'
import UserScreen from '../component/Tabs/AdminTabs/userTab'
import AdminProtectedRoute from '../layout/AdminLayout/ProtectedAdminLayout'

const StudentRoute = {
  path: '/',
  element: <StudentLayout />,
  children: [
    {
      path: 'admin-panel',
      element: <AdminProtectedRoute />, // Wrap with the protected route
      children: [
        {
          path: '',
          element: <AdminPanel />, // Load Admin Panel only if user is an admin
          children: [
            {
              path: 'dashboard',
              element: <DashboardTab />
            },
            {
              path: 'document',
              element: <DocumentTab />
            },
            {
              path: 'notification',
              element: <NotificationTab />
            },
            {
              path: 'token',
              element: <TokenTab />
            },
            {
              path: 'user-management',
              element: <UserScreen />,
              children: [
                {
                  path: 'user',
                  element: <UserManagement />
                },
                {
                  path: 'role',
                  element: <RoleManagement />
                },
                {
                  path: 'group',
                  element: <GroupManagement />
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export default StudentRoute