import { useIsAuthenticated } from "@refinedev/core"; // , useGo
import { FloatButton } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { LoaderApp } from '@/components/LoaderApp';

export const Layout: React.FC<any> = ({
  children,
}) => {
  const { isLoading, data } = useIsAuthenticated();

  if(isLoading){
    return <LoaderApp />;
  }

  // console.log('data: ', data);

  return (
    <div className="flex flex-col min-h-fullscreen">
      <Nav user={data} />

      <main className="w-full flex-1">
        {children}
      </main>

      <Footer />

      <FloatButton.BackTop
        type="primary"
        // visibilityHeight={90}
        icon={<ArrowUpOutlined />} // @ts-ignore
        tabIndex={-1}
        style={{ marginBottom: -29, marginRight: -7, border: '1px solid #eee' }}
        // title="Back to top" // tooltip
      />
    </div>
  );

  // if(data?.authenticated){
  //   return (
  //     <div className="flex flex-col min-h-fullscreen">
  //       <Nav />
  
  //       <main className="w-full flex-1">
  //         {children}
  //       </main>
  
  //       <Footer />
  
  //       <FloatButton.BackTop
  //         type="primary"
  //         // visibilityHeight={90}
  //         icon={<ArrowUpOutlined />} // @ts-ignore
  //         tabIndex={-1}
  //         style={{ marginBottom: -29, marginRight: -7, border: '1px solid #eee' }}
  //         // title="Back to top" // tooltip
  //       />
  //     </div>
  //   );
  // }

  // return null;
}
