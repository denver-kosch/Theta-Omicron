import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./AppRouter";

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error('Could not find the element with id "root".');

createRoot(rootElement).render(<StrictMode><Router /></StrictMode>);