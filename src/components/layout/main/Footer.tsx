import { Row, Col } from 'antd';
import { NavLink } from 'react-router-dom';
import { RiFacebookCircleFill, RiInstagramFill } from "react-icons/ri";

export const Footer = () => {
  return (
    <footer className="w-full pt-8 max-md_pb-14 bg-yellow-300">
      <div className="xl_max-w-screen-xl mx-auto px-4">
        <Row gutter={[24, 24]}>
          <Col lg={12} xs={24}>
            <p className="text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit..
            </p>
          </Col>

          <Col lg={4} xs={24}>
            <h4 className="text-xs font-bold mb-4">About</h4>
            <nav className="flex flex-col items-baseline gap-y-3 text-xs">
              <NavLink to="/news" className="text-gray-800 hover_text-white">News</NavLink>
              <NavLink to="/our-team" className="text-gray-800 hover_text-white">Our Team</NavLink>
              <NavLink to="/careers" className="text-gray-800 hover_text-white">Careers</NavLink>
            </nav>
          </Col>

          <Col lg={4} xs={24}>
            <h4 className="text-xs font-bold mb-4">Contact</h4>
            <nav className="flex flex-col items-baseline gap-y-3 text-xs">
              {[
                {
                  url: "/help-center",
                  label: "Help center",
                },
                {
                  url: "/support-community",
                  label: "Support community",
                },
              ].map((item: any) => 
                <NavLink 
                  key={item.url} 
                  to={item.url}
                  className="text-gray-800 hover_text-white"
                >
                  {item.label}
                </NavLink>
              )}
            </nav>
          </Col>

          <Col lg={4} xs={24}>
            <h4 className="text-xs font-bold mb-4">Courses</h4>
            <nav className="flex flex-col items-baseline gap-y-3 text-xs">
              {[10, 11, 12].map((item: any) =>
                <NavLink 
                  key={item} 
                  to={"/course/" + item}
                  className="text-gray-800 hover_text-white"
                >
                  Matematika {item}
                </NavLink>
              )}
            </nav>
          </Col>
        </Row>

        <hr className="mb-2 border-zinc-500"  />
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-2 text-xs">
          <span>@ 2024 {import.meta.env.VITE_APP_NAME} Indonesia</span>
          <NavLink to="/term-of-use" className="text-gray-800 hover_text-white">
            Term of use
          </NavLink>
          <NavLink to="/privacy-policy" className="text-gray-800 hover_text-white">
            Privacy Policy
          </NavLink>
          <NavLink to="/cookie-notice" className="text-gray-800 hover_text-white">
            Cookie Notice
          </NavLink>

          <div className="ml-auto space-x-2">
            {[
              {
                url: "#facebook",
                icon: RiFacebookCircleFill
              },
              {
                url: "#instagram",
                icon: RiInstagramFill
              }
            ].map((Item: any) =>
              <a 
                key={Item.url}
                href={Item.url}
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 hover_text-white text-xl"
              >
                <Item.icon />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
