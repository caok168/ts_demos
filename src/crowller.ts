// ts -> .d.ts 翻译文件 -> js

import superagent from 'superagent';

import fs from 'fs';
import path from 'path';
import DellAnalyzer from './dellAnalyzer';
// import LeeAnalyzer from './leeAnalyzer';

export interface Analyzer {
    analyze: (html: string, filePath: string) => string;
}


class Crowller{
    
    private filePath = path.resolve(__dirname, '../data/course.json');

    private rawHtml = '';

    private async getRawHtml(url: string) {
        const result = await superagent.get(url);
        
        this.rawHtml = result.text;

        return result.text;
        // this.getCourseInfo(result.text);
        // console.log(this.rawHtml);
    }

    private writeFile(content: string) {
        fs.writeFileSync(this.filePath, content);
    }

    private async initSpiderProcess(url: string) {
        const html = await this.getRawHtml(url);
        
        const fileContent = this.analyzer.analyze(html, this.filePath);
        this.writeFile(fileContent);

        // fs.writeFileSync(this.filePath, JSON.stringify(fileContent));

        // console.log(courseInfo)
    }

    constructor(private url: string, private analyzer: Analyzer) {
        // superagent.
        console.log('constructor');

        this.initSpiderProcess(url);
    }
}


const secret = 'secretKey';
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;

// const analyze = new DellAnalyzer();
const analyze = DellAnalyzer.getInstance();
// const analyze = new LeeAnalyzer();
new Crowller(url, analyze);

// const crowller = new Crowller(url, analyze);
console.log('hello world111');
