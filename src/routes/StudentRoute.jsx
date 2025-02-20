import { lazy, Suspense } from 'react'
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
// import TokenTab from '../component/Tabs/tokenTab'
import UserScreen from '../component/Tabs/AdminTabs/userTab'
import ProtectedStudentLayout from '../layout/StudentLayout/ProtectedStudentLayout'
import AdminProtectedRoute from '../layout/AdminLayout/ProtectedAdminLayout'
import ConfigScreen from '../component/Tabs/configTab'
import AuthenticationManagement from '../component/Tabs/AdminTabs/AuthenticationManagement'
import ModelManagement from '../component/Tabs/AdminTabs/ModelManagement'
import ThemeManagement from '../component/Tabs/AdminTabs/ThemeManagement'
const TokenTab = lazy(() => import('../component/Tabs/tokenTab'));
const TokenUsersManagement = lazy(() => import('../component/Tabs/AdminTabs/TokenUsersManagement'));
const TransactionManagement = lazy(() => import('../component/Tabs/AdminTabs/TransactionManagement'));
const TokenRequestManagement = lazy(() => import('../component/Tabs/AdminTabs/TokenRequestManagement'));
const StorageTab = lazy(() => import('../component/Tabs/storageTab'));
const StorageUsersManagement = lazy(() => import('../component/Tabs/AdminTabs/StorageUsersManagement'));
const StorageTransactionManagement = lazy(() => import('../component/Tabs/AdminTabs/StorageTransactionManagement'));
const StorageRequestManagement = lazy(() => import('../component/Tabs/AdminTabs/StorageRequestManagement'));

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
              element: (
                <Suspense fallback={<div>Loading Token Tab...</div>}>
                  <TokenTab />
                </Suspense>
              ),
              children: [
                {
                  path: 'users',
                  element: (
                    <Suspense fallback={<div>Loading Users...</div>}>
                      <TokenUsersManagement />
                    </Suspense>
                  ),
                },
                {
                  path: 'transaction',
                  element: (
                    <Suspense fallback={<div>Loading Transactions...</div>}>
                      <TransactionManagement />
                    </Suspense>
                  ),
                },
                {
                  path: 'request',
                  element: (
                    <Suspense fallback={<div>Loading Request...</div>}>
                      <TokenRequestManagement />
                    </Suspense>
                  ),
                }
              ]
            },
            {
              path: 'storage',
              element: (
                <Suspense fallback={<div>Loading Storage Tab...</div>}>
                  <StorageTab />
                </Suspense>
              ),
              children: [
                {
                  path: 'users',
                  element: (
                    <Suspense fallback={<div>Loading StorageUsers...</div>}>
                      <StorageUsersManagement />
                    </Suspense>
                  ),
                },
                {
                  path: 'transaction',
                  element: (
                    <Suspense fallback={<div>Loading Storage Transactions...</div>}>
                      <StorageTransactionManagement />
                    </Suspense>
                  ),
                },
                {
                  path: 'request',
                  element: (
                    <Suspense fallback={<div>Loading Storage Request...</div>}>
                      <StorageRequestManagement />
                    </Suspense>
                  ),
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