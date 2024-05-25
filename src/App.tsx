import type { I18nProvider } from "@refinedev/core";
import { Refine } from "@refinedev/core";
import routerBindings, { DocumentTitleHandler } from "@refinedev/react-router-v6"; // UnsavedChangesNotifier, 
import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import dataProvider from "@refinedev/simple-rest";
import { dataProvider } from "@/providers/dataProvider";
import { authProvider } from "@/authProvider";
// import { authProvider } from "@/providers/authProvider";
// import { ColorModeContextProvider } from "@/contexts/color-mode";
import { AppContextProvider, AppLocale } from "@/contexts/app/AppContext";
import { useNotificationProvider } from "@/providers/notificationProvider"; // @refinedev/antd
import { RESOURCES } from "@/routes/resources";
import { AppRoutes } from "@/routes/AppRoutes";

const customTitleHandler = () => { // { resource, action, params }: any
  // let title = document.title || import.meta.env.VITE_APP_NAME; // Default title  
  
  // if(resource && action) {  
  //   title = `${resource} ${action} ${params.id}`;  
  // }

  return document.title || import.meta.env.VITE_APP_NAME; // title
};

export function App(){
  const { t, i18n } = useTranslation();

  const i18nProvider: I18nProvider = { // @ts-ignore
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      <AppContextProvider>
        <Refine // @ts-ignore
          dataProvider={dataProvider(Q.api)} // import.meta.env.VITE_API
          routerProvider={routerBindings}
          authProvider={authProvider}
          notificationProvider={useNotificationProvider}
          i18nProvider={i18nProvider}
          resources={RESOURCES}
          options={{
            /** @DOCS : https://refine.dev/docs/core/refine-component/#disabletelemetry */
            disableTelemetry: true,

            /** @DOCS : https://refine.dev/docs/core/refine-component/#syncwithlocation */
            syncWithLocation: true,

            /** @DOCS : https://refine.dev/docs/core/refine-component/#warnwhenunsavedchanges */
            // warnWhenUnsavedChanges: true,
            
            /** @DOCS : https://refine.dev/docs/core/refine-component/#usenewquerykeys */
            useNewQueryKeys: true,
            
            /** @DOCS : https://refine.dev/docs/core/refine-component/#disableserversidevalidation */
            // disableServerSideValidation: true,

            /** @DOCS : https://refine.dev/docs/core/refine-component/#redirect */
            redirect: {
              // If the resource doesn't have a show page defined, the user will be redirected to the list page.
              // afterCreate: false, // "show"
              // If the mutation mode is `undoable` or `optimistic`, the redirect happens before the mutation succeeds. Therefore, if there is no known `id` value, the user will be redirected to the list page.
              // afterClone: "edit",
              // If set to `false`, no redirect is performed after a successful form mutation.
              afterEdit: false,
            },

            /** @DOCS : https://refine.dev/docs/core/refine-component/#reactquery */
            reactQuery: {
              clientConfig: {
                defaultOptions: {
                  queries: {
                    // staleTime: Infinity,
                    retry: false,
                  },
                },
              },
            },

            // projectId: "qTyQbm-G9BqZC-wVhLmz", // ???
          }}
        >
          <AppLocale>
            <AppRoutes />
          </AppLocale>

          {/* <UnsavedChangesNotifier /> */}

          <DocumentTitleHandler
            handler={customTitleHandler}
          />
        </Refine>
      </AppContextProvider>
    </BrowserRouter>
  );
}
