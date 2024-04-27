import { useEffect } from "react";
import { useDocumentTitle } from "@refinedev/react-router-v6";

//  Page
export default function(){
  // "Home • " + 
  useDocumentTitle(import.meta.env.VITE_APP_NAME);

  // useEffect(() => {
  //   const loader = document.getElementById('_splashScreen');
  //   console.log('loader: ', loader);
  //   // Show loading
  //   loader?.classList.remove('hidden');
    
  //   return () => { // Hide loading
  //     loader?.classList.add('hidden');
  //   }
  // }, []);

  return (
    <>
      <h1>Home</h1>
    </>
  );
}
