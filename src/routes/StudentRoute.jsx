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
import ProtectedStudentLayout from '../layout/StudentLayout/ProtectedStudentLayout'
import AdminProtectedRoute from '../layout/AdminLayout/ProtectedAdminLayout'
import ConfigScreen from '../component/Tabs/configTab'
import AuthenticationManagement from '../component/Tabs/AdminTabs/AuthenticationManagement'
import ModelManagement from '../component/Tabs/AdminTabs/ModelManagement'
import ThemeManagement from '../component/Tabs/AdminTabs/ThemeManagement'
import TokenUsersManagement from '../component/Tabs/AdminTabs/TokenUsersManagement'
import TransactionManagement from '../component/Tabs/AdminTabs/TransactionManagement'


const StudentRoute = {
  path: '/',
  element: <ProtectedStudentLayout />,
  // element: <StudentLayout />,
  children: [
    {
      index: true, // Default route
      element: <Dashboard />,
    },
    {
      path: 'dashboard',
      element: <Dashboard />
    },
    {
      path: 'workspace',
      element: <Workspace />
    },
    {
      path: 'chats/:id',
      element: <Chat />
    },
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
              element: <TokenTab />,
              children: [
                {
                  path: 'users',
                  element: <TokenUsersManagement />
                },
                {
                  path: 'transaction',
                  element: <TransactionManagement />
                },
                {
                  path: 'theme',
                  element: <ThemeManagement />
                }
              ]
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
            },
            {
              path: 'system-config',
              element: <ConfigScreen />,
              children: [
                {
                  path: 'authentication',
                  element: <AuthenticationManagement />
                },
                {
                  path: 'model',
                  element: <ModelManagement />
                },
                {
                  path: 'theme',
                  element: <ThemeManagement />
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