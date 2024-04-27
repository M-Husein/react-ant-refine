import type { MenuProps } from 'antd';
import type { IUser } from '@/types/Types';
import { useEffect, useRef } from "react";
import { Menu, Avatar, Modal } from 'antd'; // Dropdown, Button, 
import { UserOutlined } from '@ant-design/icons'; // SettingOutlined, 
import { useLocation, NavLink } from 'react-router-dom';
import { useGetIdentity, useLogout, useWarnAboutChange } from "@refinedev/core";

const MENUS: MenuProps['items'] = [
  {
    key: '/',
    label: (
      <NavLink to="/" className="block">
        <img 
          height={41}
          alt={import.meta.env.VITE_APP_NAME} 
          src="/logo-32x32.png"
        />
      </NavLink>
    ),
    // className: "mr-auto"
  },
  {
    key: '/contact-us',
    label: (
      <NavLink to="/contact-us" className="block">
        Contact Us
      </NavLink>
    ),
  },
];

export const Nav = () => {
  const { data: user } = useGetIdentity<IUser>();
  const location = useLocation();
  const { mutate: mutateLogout } = useLogout();
  const { warnWhen, setWarnWhen } = useWarnAboutChange();
  const [modalApi, modalContextHolder] = Modal.useModal();
  const navRef = useRef<any>();

  useEffect(() => {
    const onMessage = (e: any) => {
      if(e.data.type === "LOGOUT"){
        sessionStorage.removeItem(import.meta.env.VITE_TOKEN_KEY);
        
        modalApi.warning({
          centered: true,
          keyboard: false,
          title: "Ups",
          content: "You are logged out from another tab/window",
          okText: "Login",
          okButtonProps: { onClick: () => window.location.replace('/login') },
        });
      }
    }

    const bc = new BroadcastChannel(import.meta.env.VITE_BC_NAME);

    bc.addEventListener('message', onMessage);

    return () => {
      bc.removeEventListener('message', onMessage);
    }
  }, []);

  const doLogout = () => {
    if (warnWhen) {
      if (window.confirm("Apakah Anda yakin ingin pergi? Anda memiliki perubahan yang belum disimpan")) {
        setWarnWhen(false);
        mutateLogout();
      }
    } else {
      mutateLogout();
    }
  }

  // console.log('user: ', user)

  const menuItems = user ? [
    ...MENUS,
    {
      key: "user",
      label: (
        <div className="flex items-center">
          <Avatar
            shape="square"
            icon={<UserOutlined />}
            src={user.avatar}
            alt="PP"
            className="mr-3"
          />
          <b>{user.name || user.username}</b>
        </div>
      ),
      children: [
        {
          key: "/dashboard",
          label: <NavLink to="/dashboard">Dashboard</NavLink>,
        },
        {
          key: "/setting",
          label: <NavLink to="/setting">Setting</NavLink>,
        },
        {
          label: "Log Out",
          onClick: doLogout,
        },
      ],
    },
  ] : [
    ...MENUS,
    {
      key: '/register',
      label: (
        <NavLink
          to="/register"
          className="text-gray-800 font-bold py-2 px-4 rounded-lg"
        >
          Register
        </NavLink>
      ),
    }
  ];

  return (
    <header className="w-full border-b border-gray-400 !sticky top-0 z-1051 bg-white">
      <nav 
        ref={navRef}
        className="xl_px-4 xl_max-w-screen-xl mx-auto relative"
      >
        <Menu 
          id="navMain"
          mode="horizontal"
          triggerSubMenuAction="click"
          style={{ borderBottom: 0 }}
          className="h-14 items-center"
          items={menuItems}
          selectedKeys={[location.pathname !== '/' ? location.pathname : '']}
          getPopupContainer={() => navRef.current}
          // expandIcon={<i>X</i>}
        />
      </nav>

      {modalContextHolder}
    </header>
  );
}
