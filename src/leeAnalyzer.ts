import { html } from "cheerio/lib/api/manipulation";
import { Analyzer } from "./crowller";

export default class LeeAnalyzer implements Analyzer {
    public analyze(html: string, filePath: string) {
        return html;
    };
};