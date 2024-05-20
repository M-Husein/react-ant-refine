import { useState } from "react"; // useEffect
import { useDocumentTitle } from "@refinedev/react-router-v6";
import { useNotification, useTranslate } from "@refinedev/core";
import { Button, Modal } from "antd";

//  Page
export default function(){
  useDocumentTitle("Devs • " + import.meta.env.VITE_APP_NAME);

  const translate = useTranslate();
  const { open } = useNotification();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // useEffect(() => {
  //   console.log('loader: ', loader);
  // }, []);

  const notifCustom = (type: any) => open?.({
    type,
    message: `This is a ${type} message`,
    description: type.toUpperCase(),
    // @ts-ignore
    // closeIcon: false,
  });

  const toggleModal = () => setModalOpen(!modalOpen);

  return (
    <>
      <h1>Devs</h1>

      {["success", "error", "info", "warning"].map((item: string) =>
        <Button 
          key={item} 
          // type="primary" 
          onClick={() => notifCustom(item)}
          className="mr-2"
        >
          Notif {item}
        </Button>
      )}

      <hr />

      <Button type="primary" onClick={toggleModal}>
        {translate('buttons.show')} Modal
      </Button>

      <Modal
        open={modalOpen}
        onOk={toggleModal}
        onCancel={toggleModal}
      >
        <p>
          Modal
        </p>
      </Modal>

      {/* {Array.from({ length: 50 }).map((x: any, index: number) => 
        <p key={index}>DUMMY {index + 1}</p>
      )} */}
    </>
  );
}
