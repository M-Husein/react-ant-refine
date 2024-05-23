import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import type { IUser } from '@/types/Types';
import { useEffect } from "react";
import { useGetIdentity, useLogout, useWarnAboutChange, useTranslate } from "@refinedev/core"; // , useGetLocale, useSetLocale
import {
  Avatar,
  Layout as AntdLayout,
  Dropdown,
  Button,
  Modal,
  // Badge,
  // Switch,
} from "antd";
// import { DownOutlined } from "@ant-design/icons"; // , MoonFilled, SunFilled, SettingOutlined
import { FaRegUser } from "react-icons/fa";
import { useLocation, NavLink } from "react-router-dom";
// import { useApp } from "@/contexts/app";
import { LanguageMenu } from '@/components/LanguageMenu';

const overlayStyle = {
  left: 'auto',
  right: 0
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = () => {
  const { data: user } = useGetIdentity<IUser>();
  const { name, username, email, avatar } = user || {};

  // const { mode, setMode } = useApp();
  const translate = useTranslate();
  const location = useLocation();
  const { mutate: mutateLogout } = useLogout();
  const { warnWhen, setWarnWhen } = useWarnAboutChange();
  const [modalApi, modalContextHolder] = Modal.useModal();

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
      <div className="relative h-12 ml-auto flex items-center">
        <div className="relative mr-2">
          <LanguageMenu
            overlayStyle={{
              left: 'auto',
              right: 0
            }}
          />
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
                      size={55}
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

                      {/* <Badge
                        // color="#ff7a00"
                        count="View Profile"
                        className="mt-1"
                      /> */}
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
          <Button className="!p-0">
            <Avatar
              size={30}
              shape="square"
              icon={<FaRegUser />}
              src={avatar}
              alt={name || username}
              style={{ display: 'flex' }}
            />
          </Button>
        </Dropdown>
      </div>

      {modalContextHolder}
    </AntdLayout.Header>
  );
};
