import { PropsWithChildren } from "react"; // , createContext, useContext, useEffect, useState, useDebugValue
import { useGetLocale } from "@refinedev/core";
import { ConfigProvider, App as AntdApp } from "antd"; // , theme
// import { StyleProvider } from '@ant-design/cssinjs';
import dayjs from 'dayjs';
import enUS from 'antd/locale/en_US';
import idID from 'antd/locale/id_ID';
import 'dayjs/locale/en';

const currentLang = localStorage.getItem("i18nextLng") || 'en';

// Initial value for locale date
dayjs.locale(currentLang);

/** @OPTION : For toggle color scheme */
// const toggleTheme = (isDark: boolean) => {
//   let html = document.documentElement;
//   html.classList.toggle("dark", isDark);
//   let metaTheme = html.querySelector('meta[name=theme-color]') as any;
//   if(metaTheme){
//     metaTheme.content = getComputedStyle(html).getPropertyValue('--q-bg-nav'); // --q-bg-main
//   }
// }

const AntLanguages: { [key: string]: any } = {
  id: idID,
  en: enUS,
};

// type AppContextType = {
//   mode: string;
//   setMode: (mode: string) => void;
// };

// export const AppContext = createContext<AppContextType>({} as AppContextType);

// export const useApp = () => {
//   // const { auth } = useContext(AppContext);
//   // useDebugValue(auth, auth => auth?.user ? "Logged In" : "Logged Out")
//   return useContext(AppContext);
// }

const THEME = {
  token: {
    // fontFamily: "'Lato',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'",
    // fontSize: 14,
    // lineHeight: 1.6, // default: 1.5714285714285714,
    // colorText: "",
    // colorLink: "#ff7a00",
    // colorPrimary: "#fbdd0b",
    // colorTextLightSolid: "#555",
    // colorTextBase: "#fff",
    // colorBgElevated: "#16085f",
    // colorBgLayout: "#f4f4f4", // #f5f5f5
    
    /** @DEV : ??? */
    // @ts-ignore
    zIndexPopupBase: 1055, // For Modal
    // borderRadius: 8, // 6
    // borderRadiusLG: 10, // 8
    // borderRadiusSM: 6, // 4
  },
  components: {
    // Button: {
    //   fontWeight: 600, // 500
    //   primaryColor: "#333",
    // },
    // Input: {
    //   activeShadow: "none",
    //   errorActiveShadow: "none",
    // },
    Menu: {
      algorithm: true, // Enable algorithm
      itemPaddingInline: 9, // Default: 16
      // itemSelectedColor: "#fb7800",
    },
    // Dropdown: {
    //   // zIndexPopup: 999,
    //   itemSelectedColor: "#fb7800", // NOT WORK
    // },
    // Select: {
    //   zIndexPopup: 999,
    // },
    Notification: {
      zIndexPopup: 2056, // 1060
    },
    // DatePicker: {
    //   zIndexPopup: 999,
    // },
    Table: {
      cellPaddingBlockSM: 5,
      // cellFontSizeSM: 13,
    },
  },
};

export const AppContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const locale = useGetLocale();
  const currentLocale = locale();

  // const isSystemPreferenceDark = window?.matchMedia("(prefers-color-scheme: dark)").matches;
  // const colorModeFromLocalStorage = localStorage.getItem("colorMode");
  // const systemPreference = isSystemPreferenceDark ? "dark" : "light";
  // const [mode, setMode] = useState(colorModeFromLocalStorage || systemPreference);

  // const isDark = mode === "dark";

  // useEffect(() => {
  //   localStorage.setItem("colorMode", mode);
  //   toggleTheme(mode === "dark");
  // }, [mode]);

  // const setColorMode = () => {
  //   setMode(isDark ? "light" : "dark");
  // }

  return (
    // <AppContext.Provider
    //   value={{
    //     mode,
    //     setMode: setColorMode,
    //   }}
    // >
      <ConfigProvider 
        // wave={{
        //   disabled: true,
        // }}
        prefixCls="a" // Default = "ant" (NOTE: Change in scss / css files too)
        iconPrefixCls="ai" // Default = "anticon" (NOTE: Change in scss / css files too)
        // componentDisabled={true} // For disabled components: Button, Input, Checkbox, Dropdown Button, 
        locale={AntLanguages[currentLocale || currentLang]}
        theme={THEME}

        /** @OPTION : Using color scheme light / dark */
        // theme={{
        //   // ...RefineThemes.Blue,
        //   // algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        //   ...THEME,
        // }}
      >
        <AntdApp
          notification={{ bottom: 0 }}
        >
          {children}
        </AntdApp>
      </ConfigProvider>
    // </AppContext.Provider>
  );
}
