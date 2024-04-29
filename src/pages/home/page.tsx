// import { useEffect } from "react";
import { useDocumentTitle } from "@refinedev/react-router-v6";

//  Page
export default function(){
  // "Home • " + 
  useDocumentTitle(import.meta.env.VITE_APP_NAME);

  // useEffect(() => {
  //   console.log('loader: ', loader);
  // }, []);

  return (
    <>
      <section className="px-4 xl_max-w-screen-xl mx-auto">
        <h1>Home</h1>

        {/* {Array.from({ length: 50 }).map((x: any, index: number) => 
          <p key={index}>DUMMY {index + 1}</p>
        )} */}
      </section>
    </>
  );
}
