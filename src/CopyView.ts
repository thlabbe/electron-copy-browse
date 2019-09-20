//import { CopyElement } from "./CopyElement";
//import { CopyElementView } from "./CopyElementView";
//import { CopyDescription } from "./CopyItems";
//import { ICopyElementParameters } from "./ICopyElementParameters";

export class CopyView {
    private elements = new Array();

    constructor(elements: Array<object>) {
        
/*
        elements["elements"].forEach((element) => {
            const parameters = {};
            for (const key in element) {
                if (element.hasOwnProperty(key)) {
                    parameters[key] = element[key];
                }
            }*/
            this.elements= elements["elements"];
        

        // this.elements = description.elements;
    }

    public render(): string {
        let maxPos = 1;
        console.log("CopyView.render()");
        console.log(this.elements);
        let items = new Array();
        this.elements.forEach( (e) => {
            console.log(e);
            maxPos = Math.max(maxPos, e["position"] - 1 + e["length"]);
            items.push(`<tr><td>${e["level"]}</td>
            <td>${e["name"]}</td>
            <td>${e["position"]}</td>
            <td>${e["length"]}</td>
            <td>${e["position"] - 1 + e["length"]}</td>
            <td>${e["pictureString"]["pictureStr"]}</td>
            <td>${e["comments"].replace(new RegExp("\n", "g"), "&nbsp;")}</td>
            </tr>`);
        });
        console.log(items);
        const filter = `<tr><th></th>
        <th><input type="text" class="input-filter" id="input-filter-name"></th>
        <th colspan="3"><input type="number" min="1" max="${maxPos}" class="input-filter" id="input-filter-offset"></th>
        <th><input type="text" class="input-filter" id="input-filter-picture" ></th>
        <th><input type="text" class="input-filter" id="input-filter-comments" ></th>
        </tr>`;
        const header = `<tr><th>Niveau</th><th>Nom</th><th>debut</th><th>longueur</th><th>fin</th><th>format</th><th>commentaire</th></tr>`;
        return `<table id="copybook-table">${header}${filter}${items.join("\n")}</table>`;
    }
}
