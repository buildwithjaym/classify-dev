import "./styles/globals.css";
import { App } from "./app";

const root = document.querySelector("#app");
root.innerHTML = "";
root.appendChild(App());
