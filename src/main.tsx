import ReactDOM from "react-dom/client";
import App from "./App";
import { worker } from "./mocks/browser";

worker.start({
  serviceWorker: {
    url: new URL("/mockServiceWorker.js", import.meta.url).href,
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />,
);
