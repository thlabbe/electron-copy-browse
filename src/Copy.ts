import * as fs from "fs";
import { CopyDescription, DEFAULT_ENCODING, RE_ENDS_WITH_PERIOD, RE_IS_COMMENT } from "./CopyItems";
import { DataDescription } from "./DataDescription";

export class Copy {

    private copybook: string;
    private encoding: string;
    private rawLines: string[];

    constructor(filename: string, options?: any) {
        this.copybook = filename;
        if (options) {
            this.encoding = options.encoding || DEFAULT_ENCODING;
        } else {
            this.encoding = DEFAULT_ENCODING;
        }
        this.rawLines = new Array<string>();

        const raw = fs.readFileSync(this.copybook, { encoding: this.encoding })
            .split("\n") as string[];
        raw.forEach((element) => this.rawLines.push(element));
    }
    public buidDataDescription(listSpecification: string[], listComments: string[]) {
        function removeRedundantSpaces(input: string) {
            input = input.replace(/\s\s+/g, " ");
            return input;
        }
        const comments = listComments.join("\n");
        const tmp = listSpecification.filter( (e) => e.length > 0 ).join(" ");
        const specification = removeRedundantSpaces(tmp);
        const tokens = specification.split(" ");
        if (tokens.length >= 2) {
            const level = +tokens[0]; // +x implict cast x to number
            let name: string = tokens[1];
            let pic = "";
            if (RE_ENDS_WITH_PERIOD.test(name)) {
                name = name.substring(0, name.length - 1);
            }
            if (tokens[2] && tokens[2].startsWith("PIC")) {
                for (let t = 3; t < tokens.length; t++) {
                    pic = pic.concat(tokens[t]).concat(" ");
                }
            }
            pic = pic.trim();
            return new DataDescription({
                comments,
                level,
                name,
                pictureString: pic,
            });
        }
    }
    public parse() {
        const dataDescriptions = new Array<DataDescription>();
        let currentComments = [];
        let currentSpecification = [];
        // tslint:disable-next-line
        for (let i = 0; i < this.rawLines.length; i++) {
            const line = this.rawLines[i];
            if (line.length >= 7) {
                if (RE_IS_COMMENT.test(line)) {
                    currentComments.push(line.substring(6).trim());
                } else {
                    currentSpecification.push(line.substring(6).trim());
                    if (RE_ENDS_WITH_PERIOD.test(line)) {
                        const newDataDesc = this.buidDataDescription(currentSpecification, currentComments);
                        dataDescriptions.push(newDataDesc);
                        currentComments = [];
                        currentSpecification = [];
                    }
                }
            }
        }
        return new CopyDescription(dataDescriptions);
    }
}
exports.Copy = Copy;
