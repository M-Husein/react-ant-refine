import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import type { MenuProps } from "antd";
import type { IUser } from '@/types/Types';
import { useEffect } from "react";
import { useGetIdentity, useLogout, useWarnAboutChange, useTranslate, useGetLocale, useSetLocale } from "@refinedev/core";
import {
  Avatar,
  Layout as AntdLayout,
  Dropdown,
  Button,
  Modal,
  Badge,
  // Switch,
} from "antd";
// import { DownOutlined } from "@ant-design/icons"; // , MoonFilled, SunFilled, SettingOutlined
import { FaRegUser } from "react-icons/fa";
import { useLocation, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from 'dayjs';
// import { useApp } from "@/contexts/app";

const LANGUAGE: { [key: string]: string } = {
  id: "Indonesia",
  en: "English",
};

const overlayStyle = {
  left: 'auto',
  right: 0
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = () => {
  const { data: user } = useGetIdentity<IUser>();
  const { name, username, email, avatar } = user || {};

  // const { mode, setMode } = useApp();
  const { i18n } = useTranslation();
  const locale = useGetLocale();
  const currentLocale = locale();
  const changeLanguage = useSetLocale();
  const translate = useTranslate();
  const location = useLocation();
  const { mutate: mutateLogout } = useLogout();
  const { warnWhen, setWarnWhen } = useWarnAboutChange();
  const [modalApi, modalContextHolder] = Modal.useModal();

  const languageMenus: MenuProps["items"] = [...(i18n.languages || [])]
    .sort()
    .map((lang: string) => ({
      key: lang,
      onClick: () => {
        dayjs.locale(lang);
        changeLanguage(lang);
      },
      icon: (
        <Avatar
          size={16}
          shape="square"
          alt={lang}
          src={`/media/img/flags/${lang}.svg`}
        />
      ),
      label: LANGUAGE[lang],
    }));

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

  useEffect(() => {
    const onMessage = (e: any) => {
      if(e.data.type === "LOGOUT"){
        sessionStorage.removeItem(import.meta.env.VITE_TOKEN_KEY);
        
        modalApi.warning({
          centered: true,
          keyboard: false,
          title: "Ups",
          content: "Anda logged out dari tab/jendela lain",
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

  return (
    <AntdLayout.Header
      style={{ padding: '0 14px' }} // bg-main
      className="bg-blue-100 !sticky h-12 flex items-center top-0 z-1051 shadow"
      id="navMain"
    >
      <div className="relative ml-auto flex items-center">
        <div className="relative mr-2">
          <Dropdown
            trigger={['click']}
            placement="bottomRight"
            menu={{
              items: languageMenus,
              selectedKeys: currentLocale ? [currentLocale] : [],
            }}
            getPopupContainer={(triggerNode: any) => triggerNode.parentElement}
            overlayStyle={overlayStyle}
          >
            <Button
              className="flex items-center h-full px-1" // !p-0
              title={translate("language")}
              icon={
                <Avatar
                  size={22} // 16
                  shape="square"
                  alt={currentLocale}
                  src={`/media/img/flags/${currentLocale}.svg`}
                />
              }
            />
          </Dropdown>
        </div>

        {/* <Switch
          checkedChildren={<MoonFilled />} // "🌛"
          unCheckedChildren={<SunFilled />} // "🔆"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        /> */}

        <Dropdown
          getPopupContainer={(triggerNode: any) => triggerNode.parentElement}
          overlayStyle={overlayStyle}
          trigger={['click']}
          placement="bottomRight"
          menu={{
            selectable: true,
            selectedKeys: [location.pathname],
            items: [
              {
                key: "/profile",
                label: (
                  <NavLink 
                    to="/profile"
                    className="flex items-center justify-center"
                  >
                    <Avatar
                      className="flex-none"
                      size={65}
                      shape="square"
                      icon={<FaRegUser />}
                      src={avatar}
                      alt="PP" // {name || username}
                    />
                    <section className="w-48 ml-3">
                      {!!(name || username) && (
                        <h1 className="text-lg mb-0 leading-6">
                          {name || username}
                        </h1>
                      )}
                      
                      {email && (
                        <h4 className="text-sm mb-0 text-slate-500 font-normal truncate">
                          {email}
                        </h4>
                      )}

                      <Badge
                        // color="#ff7a00"
                        count="View Profile"
                        className="mt-1"
                      />
                    </section>
                  </NavLink>
                )
              },
              {
                type: "divider"
              },
              {
                key: 2,
                label: "Logout",
                onClick: doLogout
              }
            ],
          }}
        >
          <Button className="flex items-center h-full !p-0">
            <Avatar
              size={30}
              shape="square"
              icon={<FaRegUser />}
              src={avatar}
              alt={name || username}
            />
          </Button>
        </Dropdown>
      </div>

      {modalContextHolder}
    </AntdLayout.Header>
  );
};
