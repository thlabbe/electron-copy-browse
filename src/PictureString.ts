import { picToLen } from "./CopyItems";
export class PictureString {
    private pictureStr: string;
    constructor(pictureStr: string) {
        this.pictureStr = pictureStr || "";
    }
    public length() {
        return picToLen(this.pictureStr);
    }
    public asString() {
        return this.pictureStr;
    }
}
