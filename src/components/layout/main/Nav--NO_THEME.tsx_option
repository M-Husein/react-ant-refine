import type { MenuProps } from 'antd';
import type { IUser } from '@/types/Types';
import { useEffect, useRef } from "react";
import { Menu, Avatar, Modal } from 'antd'; // Dropdown, Button, 
import { UserOutlined } from '@ant-design/icons'; // SettingOutlined, 
import { useLocation, NavLink } from 'react-router-dom';
import { useGetIdentity, useLogout, useWarnAboutChange, useTranslate } from "@refinedev/core";
import { LanguageMenu } from '@/components/LanguageMenu';

const MENUS: MenuProps['items'] = [
  {
    key: '/',
    label: (
      <NavLink to="/" className="block">
        <img 
          height={29}
          alt={import.meta.env.VITE_APP_NAME} 
          src="/logo-32x32.png"
        />
      </NavLink>
    ),
    className: "after-no leading-normal",
    style: { marginRight: 'auto' },
  },
  {
    key: '/contact-us',
    label: (
      <NavLink to="/contact-us" className="p-2">
        Contact Us
      </NavLink>
    ),
  },
  {
    key: 'lang',
    label: (
      <LanguageMenu />
    ),
    className: "after-no",
  }
];

export const Nav = ({ user }:  any) => {
  const { data } = useGetIdentity<IUser>();
  const userData = data || user;
  const location = useLocation();
  const { mutate: mutateLogout } = useLogout();
  const translate = useTranslate();
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
      if (window.confirm(translate("warnWhenUnsavedChanges"))) {
        setWarnWhen(false);
        mutateLogout();
      }
    } else {
      mutateLogout();
    }
  }

  /** @NOTE : Add loading menu */
  const menuItems = userData && user?.authenticated ? [
    ...MENUS,
    {
      key: "user",
      label: (
        <Avatar
          shape="square"
          icon={<UserOutlined />}
          src={userData.avatar}
          alt="PP"
        />
      ),
      className: "after-no leading-normal",
      popupOffset: [-130, 0],
      children: [
        {
          key: "/admin",
          label: <NavLink to="/admin">Dashboard</NavLink>,
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
  ] 
  : 
  [
    ...MENUS,
    {
      key: '/login',
      label: (
        <NavLink
          to="/login"
          className="text-gray-800 font-bold p-2 rounded-lg"
        >
          Login
        </NavLink>
      ),
    },
    {
      key: '/register',
      label: (
        <NavLink
          to="/register"
          className="text-gray-800 font-bold p-2 rounded-lg"
        >
          Register
        </NavLink>
      ),
    }
  ];

  return (
    <header className="bg-main h-14 w-full border-b border-zinc-300 !sticky top-0 z-1051">
      <nav 
        ref={navRef}
        className="h-full px-2 xl_max-w-screen-xl mx-auto relative"
      >
        <Menu 
          id="navMain"
          mode="horizontal"
          triggerSubMenuAction="click"
          style={{ borderBottom: 0 }}
          className="h-full items-center bg-main"
          items={menuItems}
          selectedKeys={[location.pathname !== '/' ? location.pathname : '']}
          getPopupContainer={() => navRef.current}
        />
      </nav>

      {modalContextHolder}
    </header>
  );
}
