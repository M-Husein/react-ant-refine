import { Card, Row, Col } from "antd";
import { Link } from 'react-router-dom';
import { useDocumentTitle } from "@refinedev/react-router-v6";

const APP_NAME = import.meta.env.VITE_APP_NAME;

export function Layout({
  title,
  form,
  h1,
  desc,
  img = "sign_up_1.png",
}: any){
  useDocumentTitle(title + " • " + APP_NAME);

  return (
    <div className="flex flex-col min-h-fullscreen p-4">
      <Row gutter={[24, 24]} className="flex-1">
        <Col lg={10} xs={24}>
          <div className="md_px-24 md_pt-6">
            <Link to="/" className="inline-block focus-visible_ring">
              <img 
                height={50}
                alt={APP_NAME} 
                src="/media/img/logo/naiju_text.png"
              />
            </Link>

            <h1 className="text-3xl mt-6">
              {h1}
            </h1>
            
            {desc}
            
            {form}
          </div>
        </Col>

        <Col lg={14} xs={24} flex={1}>
          <Card
            className="min-h-full bg-yellow-300 md_px-10"
            classNames={{
              body: "flex flex-col"
            }}
          >
            <img 
              loading="lazy"
              decoding="async"
              alt={APP_NAME} 
              src={"/media/img/" + img}
              className="max-w-full flex-none"
            />

            <h2 className="text-4xl font-semibold mt-auto">
              Lorem Ipsum
            </h2>
            <p className="text-xl font-light">
              Lorem Ipsum is simply
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
