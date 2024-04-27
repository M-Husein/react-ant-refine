import { FloatButton } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export const Layout: React.FC<any> = ({
  children,
}) => {
  return (
    <div className="flex flex-col min-h-fullscreen">
      <Nav />

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
}
