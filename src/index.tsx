// import { Suspense } from "react"; // StrictMode
import { createRoot } from "react-dom/client";
import { App } from "./App";
// import { SplashScreen } from '@/components/SplashScreen';

import './i18n'; // locale

// import "@refinedev/antd/dist/reset.css";
import "./style/style.scss";

createRoot(document.getElementById("app") as HTMLElement)
  .render(
    <App />
  );

/*
<Suspense 
  // fallback={<SplashScreen />}
  fallback=""
>
  <App />
</Suspense>
*/

/*
<StrictMode>
  <App />
</StrictMode>
*/
