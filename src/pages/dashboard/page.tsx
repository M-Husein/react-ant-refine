// import { useEffect } from "react";
import { useDocumentTitle } from "@refinedev/react-router-v6";

//  Page
export default function(){
  useDocumentTitle("Dashboard • " + import.meta.env.VITE_APP_NAME);

  // useEffect(() => {
  //   console.log('useEffect document.hidden: ', document.hidden)
  // }, []);

  // console.log('document.hidden: ', document.hidden)

  return (
    <>
      <h1>Dashboard</h1>
    </>
  );
}
