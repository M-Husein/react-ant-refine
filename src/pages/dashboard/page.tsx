import { useDocumentTitle } from "@refinedev/react-router-v6";

//  Page
export default function(){
  useDocumentTitle("Dashboard • " + import.meta.env.VITE_APP_NAME);

  return (
    <>
      <h1>Dashboard</h1>
    </>
  );
}
