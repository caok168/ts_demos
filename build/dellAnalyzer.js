"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = require("cheerio");
const fs_1 = __importDefault(require("fs"));
class DellAnalyzer {
    constructor() { }
    static getInstance() {
        if (!DellAnalyzer.instance) {
            DellAnalyzer.instance = new DellAnalyzer();
        }
        return DellAnalyzer.instance;
    }
    getCourseInfo(html) {
        const $ = (0, cheerio_1.load)(html);
        const courseItems = $('.course-item');
        const courseInfos = [];
        console.log(courseItems.length);
        courseItems.map((index, element) => {
            const descs = $(element).find('.course-desc');
            const title = descs.eq(0).text();
            const count = parseInt(descs.eq(1).text().split('：')[1], 10);
            // console.log(title, count);
            courseInfos.push({ title, count });
        });
        const result = {
            time: new Date().getTime(),
            data: courseInfos
        };
        return result;
    }
    generateJsonContent(courseInfo, filePath) {
        let fileContent = {};
        if (fs_1.default.existsSync(filePath)) {
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        fileContent[courseInfo.time] = courseInfo.data;
        return fileContent;
        // 
    }
    analyze(html, filePath) {
        const courseInfo = this.getCourseInfo(html);
        const fileContent = this.generateJsonContent(courseInfo, filePath);
        return JSON.stringify(fileContent);
    }
}
exports.default = DellAnalyzer;
