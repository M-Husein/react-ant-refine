import "@refinedev/antd/dist/reset.css";

// import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

createRoot(document.getElementById("root") as HTMLElement)
  .render(
    <App />
  );

/*
<React.StrictMode>
  <App />
</React.StrictMode>
*/
