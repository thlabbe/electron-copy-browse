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
        this.name = parameters.name;
        this.pictureString = new PictureString(parameters.pictureString);
        this.comments = parameters.comments;
        this.length = this.pictureString.length();
    }

    public get Level() { return this.level; }
    public get Name() { return this.name; }
    public get Comments() { return this.comments; }
    public get Picture_string() { return this.pictureString; }
    public get Length(): number { return this.length; }
    public set Length(val: number) { this.length = val; }
}
