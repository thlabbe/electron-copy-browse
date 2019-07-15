import { IDataDescriptionParameters } from "./IDataDescriptionParameters";
import { PictureString } from "./PictureString";

/**
 * Décrit une zone de working/copybook unitaire 
 */
export class DataDescription {

    private level: number;
    private name: string;
    private pictureString: PictureString;
    private comments: string;
    private length: number;

    constructor(parameters: IDataDescriptionParameters) {
        this.level = parameters.level;
        this.name = name;
        this.pictureString = new PictureString(parameters.pictureString);
        this.comments = parameters.comments;
        this.length = this.pictureString.length();
    }

    get Level() { return this.level; }
    get Name() { return this.name; }
    get Comments() { return this.comments; }
    get Picture_string() { return this.pictureString; }
    get Length(): number { return this.length; }
    set Length(val: number) { this.length = val; }
}
