import { RefineErrorPageProps } from "@refinedev/ui-types";
import { useEffect } from "react";
import { useGo, useRouterType, useGetIdentity, useNavigation } from "@refinedev/core"; // , useResource
import { Button, Result } from "antd"; // , Typography, Space, Tooltip
// import { InfoCircleOutlined } from "@ant-design/icons";

/**
 * When the app is navigated to a non-existent route, refine shows a default error page.
 * A custom error component can be used for this error page.
 *
 * @see {@link https://refine.dev/docs/packages/documentation/routers/} for more details.
 */
export const ErrorComponent: React.FC<RefineErrorPageProps> = () => {
  // const [errorMessage, setErrorMessage] = useState<string>();
  // const translate = useTranslate();
  const { data: user } = useGetIdentity<any>();
  const { push } = useNavigation();
  const go = useGo();
  const routerType = useRouterType();

  // const { resource, action } = useResource();

  useEffect(() => {
    const loader = document.getElementById('_splashScreen');
    loader?.classList.add('hidden');
  }, []);

  // useEffect(() => {
  //   if (resource) {
  //     if (action) {
  //       setErrorMessage(
  //         translate(
  //           "pages.error.info",
  //           {
  //             action: action,
  //             resource: resource?.name,
  //           },
  //           `You may have forgotten to add the "${action}" component to "${resource?.name}" resource.`,
  //         ),
  //       );
  //     }
  //   }
  // }, [resource, action]);

  const backTo = () => {
    let path = "/";
    
    // if(window.location.pathname.startsWith('/admin')){
    //   path += "admin";
    // }

    if(user?.name === 'system'){
      path += "admin";
    }
    
    routerType === "legacy" ? push(path) : go({ to: path })
  }

  return (
    <Result
      status="404"
      title="404"
      extra={
        <div>
          <p>Sorry, the page you visited does not exist.</p>

          {/* Not render when in home page */}
          {!['/', '/admin'].includes(window.location.pathname) && (
            <Button
              type="primary"
              onClick={backTo}
            >
              Back to Home
            </Button>
          )}
        </div>
      }
    />
  );
}
