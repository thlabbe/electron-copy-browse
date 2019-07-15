import { CopyElement } from "./CopyElement";
import { DataDescription } from "./DataDescription";
import { PictureString } from "./PictureString";

export const DEFAULT_ENCODING = "latin1";
export const RE_IS_COMMENT = new RegExp("^.{6}\\*.*");
export const RE_ENDS_WITH_PERIOD = new RegExp("^.*\\.\s*");

/**
 * Copy CopyDescription est une agrégation d'instances de DataDescription
 * permet de determiner la position de ses éléments (CopyElement)
 */
export class CopyDescription {
    private elements: CopyElement[];

    constructor(dataDescriptions: DataDescription[]) {

        this.elements = new Array<CopyElement>();
        dataDescriptions.forEach((element, index) => {
            let position: number;

            if (element.Level === 1) {
                position = 1;
            }
            this.elements.push(new CopyElement({
                comment: element.Comments,
                length: element.Length,
                level: element.Level,
                name: element.Name,
                pictureString: element.Picture_string,
                position,
            }));
        });

        this.updateAllLengths();
        this.updateAllPositions();
    }

    /* methods for queries */
    public getElementsAtPosition(position: number) {
        return this.elements.filter((e) => {
            return (e.Position <= position && e.Position + e.Length >= position);
        });
    }

    public getElementsNameContains(str: string) {
        return this.elements.filter((e) => e.Name.includes(str));
    }
    /* methods for queries */

    /**
     * mettre a jour les length ( en partant de la fin )
     */
    private updateAllLengths() {
        // en partant de la fin
        for (let i = this.elements.length - 1; i >= 0; i--) {
            if (this.elements[i].Length == null) {
                this.elements[i].Length = addLength(directChildren(this.elements, i));
            }
        }
        // repasser dans l'autre sens pour les niveau 88 qui restent à null :
        for (let i = 1; i < this.elements.length; i++) {
            if (this.elements[i].Level === 88 && this.elements[i].Length === null) {
                this.elements[i].Length = this.elements[i - 1].Length;
            }
        }
    }

    private updateAllPositions() {
        const positions = new Array(100);
        positions[1] = 1;
        const nullElement = { level: 0, length: 0, position: 0 };
        const previousElement = nullElement;
        // tslint:disable-next-line
        for (let i = 0; i < this.elements.length; i++) {
            const elem = this.elements[i];

            if (elem.Level === 1) {
                positions[elem.Level] = 1;
            } else if (elem.Level === previousElement.level && (elem.Level !== 88)) {
                positions[elem.Level] = previousElement.position + previousElement.length;
            } else if ((elem.Level >= previousElement.level) || (elem.Level === 88)) {
                positions[elem.Level] = positions[previousElement.level];
            } else if (elem.Level <= previousElement.level) {
                positions[elem.Level] = positions[previousElement.level] + previousElement.length;
            }
            if (elem.Position === null) {
                this.elements[i].Position = positions[elem.Level];
            }

            previousElement.length = this.elements[i].Length;
            previousElement.position = this.elements[i].Position;
            previousElement.level = this.elements[i].Level;
        }
    }
}

function addLength(items: CopyElement[]) {
    let sum = 0;
    items.forEach((element, idx) => {
        if (element.Length != null) {
            sum += element.Length;
        } else {
            // tslint:disable-next-line
            console.log("probleme " + idx );
            // tslint:disable-next-line
            console.log(element);
        }
    });
    if (sum > 0) { return sum; } else { return null; }
}


function directChildren(items: CopyElement[], index: number): CopyElement[] {
    if (index + 1 >= items.length) { return []; }
    const res = [];
    const parent = items[index];
    const parentLevel = parent.Level;
    let idx = index + 1;
    let child = items[idx];

    const searchedLevel = child.Level;
    while (child != null && child.Level > parentLevel) {
        if (child.Level === searchedLevel) { // on ne renvoie que les enfants du premier niveau
            res.push(child);
        }
        child = items[++idx];
    }
    return res;
}

const L_PARENT = "(";
const R_PARENT = ")";

export function picToLen(picstr: string): number {
    if (picstr.startsWith("VALUE")) {
        return null;
    }

    if (!(picstr) || picstr === "" || picstr === ".") {
        return undefined;
    }

    let temp = picstr;
    let leftParenthPosition = temp.indexOf(L_PARENT);
    let rightParenthPosition = temp.indexOf(R_PARENT);
    let startLen = leftParenthPosition + 1;
    let endLen = rightParenthPosition - 1;
    let result;

    if (leftParenthPosition !== -1 && rightParenthPosition !== -1) {
        result = parseInt(temp.substr(startLen, endLen), 10);
        temp = temp.substr(rightParenthPosition + 1);
        if (temp.length > endLen + 1) {
            leftParenthPosition = temp.indexOf(L_PARENT);
        }
        rightParenthPosition = temp.indexOf(R_PARENT);
        startLen = leftParenthPosition + 1;
        endLen = temp.indexOf(R_PARENT) - 1;

        if (leftParenthPosition !== -1 && rightParenthPosition !== -1) {
            result = result + parseInt(temp.substr(startLen, endLen), 10);
        }
    } else { /* pas de parenthese */
        result = picstr.replace(".", "").trim().length;
    }

    if (picstr.includes("SIGN ") && picstr.includes(" SEPARATE")) {
        result++;
    }
    if (isNaN(result)) {
        throw new Error(`Erreur dans picToLen : avec picstr="${picstr}" `);
    }
    return result;
}

exports.CopyDescription = CopyDescription;
exports.CopyElement = CopyElement;
exports.DataDescription = DataDescription;
exports.PictureString = PictureString;
