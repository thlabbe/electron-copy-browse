import { CopyElement } from "./CopyElement";

export class CopyElementView {
    private element: CopyElement;
    constructor(copyElement: CopyElement) {
        this.element = copyElement;
    }

    public render(): string {
        return `<tr><td>${this.element.Level}</td>
            <td>${this.element.Name}</td>
            <td>${this.element.Position}</td>
            <td>${this.element.Length}</td>
            <td>${this.element.Position - 1 + this.element.Length}</td>
            <td>${this.element.Picture_string}</td>
            </tr>`;
    }
}
