
import { ipcRenderer } from "electron";
import { Copy } from "./Copy";
import { COPY_SELECT_MSG, COPY_ANALYZE_MSG } from "./actions";
import { CopyView } from "./CopyView";
import { CopyDescription } from "./CopyItems";

let copybookInput: HTMLInputElement = document.getElementById("copybook-path") as HTMLInputElement;
let copybookSelectBtn: HTMLButtonElement =  document.getElementById("copybrowse-select") as HTMLButtonElement;
let copybookAnalyseBtn: HTMLButtonElement = document.getElementById("copybook-analyze") as HTMLButtonElement;



let copy = null;
if (copybookSelectBtn) {
    copybookSelectBtn.addEventListener("click", () => {
        const options = {};
        //console.log(`COPYBOOK_INPUT "click -> ${copybookInput.value}"`)
        const copyname = ipcRenderer.sendSync(COPY_SELECT_MSG, options);
        if (copyname !== "") {
            console.log(copyname);
            afficher_copy(copyname);
            copybookInput.value = copyname;
            ipcRenderer.send("copy-copybook-msg", copybookInput.value);
        }
    });
};

if (copybookInput) {
    copybookInput.addEventListener("click", () => {
        const options = {};
        console.log(`COPYBOOK_INPUT "click -> ${copybookInput.value}"`)
        const copyname = ipcRenderer.sendSync(COPY_SELECT_MSG, options);
        if (copyname !== "") {
            console.log(copyname);
            afficher_copy(copyname);
            copybookInput.value = copyname;
            ipcRenderer.send("copy-copybook-msg", copybookInput.value);
        }
    });
};

if (copybookInput) {
    copybookInput.addEventListener("change", () => {
        const options = {};
        const copyname = ipcRenderer.sendSync(COPY_SELECT_MSG, options) as string;

    });
};

if (copybookAnalyseBtn) {
    copybookAnalyseBtn.addEventListener("click", () => {
        console.log('COPYBOOK_BTN_ANALYSE click -> ...')
        //copy = new Copy(copybookInput.value);
        console.log(`COPYBOOK_BTN_ANALYSE "click -> ${copybookInput.value}"`);
        const json_x = ipcRenderer.sendSync(COPY_ANALYZE_MSG, copybookInput.value);
        console.log(json_x);
        let x = json_x as Array<object>;
        //const x = Object.assign(new CopyDescription(), json_x)
        console.log(`x: ${x}`);
        let resultArea: HTMLDivElement = document.getElementById("copybook-result") as HTMLDivElement;
        resultArea.innerHTML = new CopyView(x).render(); // as string;

        const inputsFilters = Array.prototype.slice.call( document.getElementsByClassName("input-filter") );
        inputsFilters.forEach(inputFilter => {
        inputFilter.addEventListener('keyup', () => {
            console.log('keyup');
            copybookFilter(inputFilter.id);
        })
        
    });
    });
};

function copybookFilter(kind) {
    console.log(`copybookFilter(${kind})`);
    const input = document.getElementById(kind) as HTMLInputElement;
    
    const table = document.getElementById("copybook-table");
    var rows = table.getElementsByTagName("tr"); 
    
    if (kind == "input-filter-name") {
        const filter = input.value.toUpperCase();
        for (let i=0; i < rows.length; i++) {
            let cellName = rows[i].getElementsByTagName("td")[1];
            if (cellName) {
                let value = cellName.textContent || cellName.innerText;
                if(value.toUpperCase().indexOf(filter) > -1) {
                    rows[i].style.display = "";
                } else {
                    rows[i].style.display = "none";
                }
            }
        }
    }
    else if ( kind == "input-filter-offset") {
        
        const filter = parseInt(input.value, 10);
        for (let i=0; i < rows.length; i++) {
            if (input.value !== "" ) { 
                let cellStart = rows[i].getElementsByTagName("td")[2];
                let cellStop = rows[i].getElementsByTagName("td")[4];
                if (cellStart && cellStop) {
                    let valueStart = parseInt(cellStart.textContent || cellStart.innerText, 10);
                    let valueStop = parseInt(cellStop.textContent || cellStop.innerText, 10);
                    if(valueStart <= filter && valueStop >= filter) {
                        rows[i].style.display = "";
                    } else {
                        rows[i].style.display = "none";
                    }
                }
            } else { // si le filtre est vide on affiche toutes les valeurs
                rows[i].style.display = "";
            }
        }
    }
    else if ( kind == "input-filter-picture") {
        console.log("not implemnted")
    }
}
function afficher_copy(copyname: string) {
    //console.log("COPYBOOK_BTN_ANALYSE");
    //console.log(copybookAnalyseBtn);
    
    let resultArea: HTMLDivElement = document.getElementById("copybook-result") as HTMLDivElement;
    //console.log("RESULT_AREA");
    //console.log(resultArea);

    console.log("afficher_copy" + copyname);
    if (resultArea) {
        resultArea.innerText = `le copy selectionné est : ${copyname}`;
    }
    if (copybookAnalyseBtn) { // } = document.getElementById("copybook-analyze") as HTMLButtonElement) {
        // copybookAnalyseBtn.disabled = true;
    } else {
        console.error("COPYBOOK_BTN_ANALYSE est ");
        console.error(copybookAnalyseBtn);
    }
}

