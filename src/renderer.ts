
import {ipcRenderer} from "electron";
import {Copy} from "./Copy";

const COPYBOOK_INPUT: HTMLInputElement = document.getElementById("copybook-path") as HTMLInputElement;
const COPYBOOK_BTN_SELECT: HTMLButtonElement =  document.getElementById("copybrowse-select") as HTMLButtonElement;
const COPYBOOK_BTN_ANALYSE: HTMLButtonElement =  document.getElementById("copybook_analyze") as HTMLButtonElement;

let copy = null;

COPYBOOK_BTN_SELECT.addEventListener("click", () => {
    const options = {};
    const copyname = ipcRenderer.sendSync("copy-select-msg", options);
    if (copyname !== "") {
        COPYBOOK_INPUT.value = copyname;
        ipcRenderer.send("copy-copybook-msg", COPYBOOK_INPUT.value);
        COPYBOOK_BTN_ANALYSE.disabled = false;
    }

});

COPYBOOK_INPUT.addEventListener("change", () => {
    const options = {};
    const copyname = ipcRenderer.send("copy-select-msg", options);

});

COPYBOOK_BTN_ANALYSE.addEventListener("click", () => {
    copy = new Copy({filename: COPYBOOK_INPUT.value});
});
