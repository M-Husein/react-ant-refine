// import "@refinedev/antd/dist/reset.css";
import "./style/style.scss";

// import { Suspense } from "react"; // StrictMode
import { createRoot } from "react-dom/client";

import { App } from "./App";
// import { SplashScreen } from '@/components/SplashScreen';

// import i18n (needs to be bundled ;))
import './i18n';

createRoot(document.getElementById("root") as HTMLElement)
  .render(
    // <Suspense fallback={<SplashScreen />}>
      <App />
    // </Suspense>
  );

/*
<React.StrictMode>
  <App />
</React.StrictMode>
*/
