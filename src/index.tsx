import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HeroUIProvider } from "@heroui/react";
import {ToastProvider} from "@heroui/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { UserContextProvider } from "./contexts/UserContext";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import "./app.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}
const root = ReactDOM.createRoot(rootElement);
const queryClient = new QueryClient();
dayjs.locale("fr");

const toastPlacement = "top-center";
root.render(
  <React.StrictMode>
    <HeroUIProvider>
      <ToastProvider placement={toastPlacement} toastOffset={toastPlacement.includes("top") ? 60 : 0} />
        <QueryClientProvider client={queryClient}>
          <UserContextProvider>
            <App />
          </UserContextProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </HeroUIProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
