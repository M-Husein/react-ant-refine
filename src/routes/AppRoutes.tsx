import { lazy } from 'react'; // , Suspense
// import loadable from '@loadable/component';
import { Routes, Route, Outlet } from "react-router-dom";
import { Authenticated } from "@refinedev/core"; // , CanAccess
import { CatchAllNavigate, NavigateToResource } from "@refinedev/react-router-v6";
import { ErrorComponent } from "@/components/ErrorComponent"; // "@refinedev/antd"
import { LoaderApp } from '@/components/LoaderApp';
import { Layout as LayoutMain } from '@/components/layout/main/Layout';
import { Layout as LayoutAdmin } from '@/components/layout/admin/Layout';
// import { ThemedLayoutV2, ThemedSiderV2, ThemedTitleV2 } from "@refinedev/antd";
import { lazyComponent } from '@/utils/components';

// Pages:
const Home = lazy(() => import('@/pages/home/Page'));

// Auth:
const Login = lazy(() => import('@/pages/login/Page'));
const Register = lazy(() => import('@/pages/register/Page'));
const ForgotPassword = lazy(() => import('@/pages/forgot-password/Page'));
// const ChangePassword = lazy(() => import('@/pages/change-password/Page'));
// End Auth

// Admin
const Dashboard = lazy(() => import('@/pages/dashboard/Page'));
// const Profile = lazy(() => import('@/pages/profile/Page'));

// Settings
// const RolesPermissions = lazy(() => import('@/pages/settings/roles-permissions/Page'));
// const UserManagement = lazy(() => import('@/pages/settings/pengguna/Page'));
// const ShowUser = lazy(() => import('@/pages/settings/pengguna/Show'));
// const CreateUser = lazy(() => import('@/pages/settings/user-management/Create'));
// END Settings
// End Admin

// DEV ONLY
const Devs = lazy(() => import('@/pages/devs/Page'));

const appName = import.meta.env.VITE_APP_NAME;

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        element={
          <LayoutMain>
            <Outlet />
          </LayoutMain>
        }
      >
        <Route index element={lazyComponent(Home, <LoaderApp />)} />
        {/* <Route path="/contact-us" element={lazyComponent(ContactUs, <LoaderApp />)} /> */}
      </Route>

      <Route
        element={
          <Authenticated
            key="authenticated-inner"
            // appendCurrentPathToQuery={false}
            loading={<LoaderApp />}
            fallback={<CatchAllNavigate to="/login" />}
          >
            {/* <ThemedLayoutV2
              Header={() => <Header sticky />}
              Sider={(props) => <ThemedSiderV2 {...props} fixed />}
              Title={({ collapsed }) => (
                <ThemedTitleV2
                  collapsed={collapsed}
                  text="Vica"
                  icon={<AppIcon />}
                />
              )}
            >
              <Outlet />
            </ThemedLayoutV2> */}

            {/* initialSiderCollapsed */}
            <LayoutAdmin
              appName={appName}
              // Footer={() => (
              //   <footer className="py-3 px-4 text-xs text-gray-400">
              //     @ 2024, Made with ❤️ <strong className="text-orange-600">NAIJU</strong>
              //   </footer>
              // )}
            >
              <Outlet />
            </LayoutAdmin>
          </Authenticated>
        }
      >
        {/* <Route index element={<NavigateToResource resource="dashboard" />} /> */}
        <Route path="/dashboard" element={lazyComponent(Dashboard)} />

        {/* Settings */}
        {/* <Route path="/settings/pengguna">
          <Route index element={lazyComponent(UserManagement)} />
          <Route path="create" element={lazyComponent(CreateUser)} />
          <Route path=":role/:id" element={lazyComponent(ShowUser)} />
        </Route> */}
        {/* End Settings */}

        {/* <Route path="/profile" element={lazyComponent(Profile)} /> */}

        {/** @DEV_ONLY */}
        <Route path="/devs" element={lazyComponent(Devs)} />

        {/* <Route path="*" element={<ErrorComponent />} /> */}
      </Route>
      
      <Route
        element={
          <Authenticated
            key="authenticated-outer"
            // appendCurrentPathToQuery={false}
            loading={<LoaderApp />}
            fallback={<Outlet />}
          >
            <NavigateToResource />
          </Authenticated>
        }
      >
        <Route path="/login" element={lazyComponent(Login, <LoaderApp />)} />
        <Route path="/register" element={lazyComponent(Register, <LoaderApp />)} />
        <Route path="/forgot-password" element={lazyComponent(ForgotPassword, <LoaderApp />)} />
        {/* <Route path="/change-password" element={lazyComponent(ChangePassword, <LoaderApp />)} /> */}
      </Route>

      {/** @NOTE : if use here, other layout override */}
      <Route path="*" element={<ErrorComponent />} />
    </Routes>
  );
}
