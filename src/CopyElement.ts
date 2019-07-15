import { DataDescription } from "./DataDescription";
import { ICopyElementParameters } from "./ICopyElementParameters";

export class CopyElement extends DataDescription {
    private position: number;
    constructor(params: ICopyElementParameters) {
        super({
            comments: params.comment,
            level: params.level,
            name: params.name,
            pictureString: params.pictureString.asString(),
        });
        this.position = params.position;
    }
    get Position(): number { return this.position; }
    set Position(val: number) { this.position = val; }
}
