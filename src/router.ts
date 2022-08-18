import { Router, Request, Response, NextFunction } from "express";
import Crowller from "./utils/crowller";
import DellAnalyzer from "./utils/dellAnalyzer";
import fs from 'fs';
import path from 'path';
import { getResponseData } from './utils/util';

interface RequestWithBody extends Request {
    body: {
        [key: string]: string | undefined;
    }
}

const checkLogin = (req: Request, res: Response, next: NextFunction) => {
    const isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        next();
    } else {
        res.json(getResponseData(true, '请先登录'));
        // res.send('请先登录');
    }
};

const router = Router();
router.get('/', (req: Request, res: Response) => {
    const isLogin = req.session ? req.session.login : false;
    if (isLogin){
        res.send(`
            <html>
                <body>
                    <a href='/getData'>爬取内容</a>
                    <a href='/showData'>查看内容</a>
                    <a href='/logout'>退出</a>
                </body>
            </html>
        `)
    } else {
        res.send(`
            <html>
                <body>
                    <form method="post" action="/login">
                        <input type="password" name="password" />
                        <button>提交</button>
                    </form>
                </body>
            </html>
        `);
    }
    
});

router.get('/logout', (req: Request, res: Response) => {
    if (req.session) {
        req.session.login = undefined;
    }
    res.redirect('/');
});

router.post('/login', (req: RequestWithBody, res: Response) => {
    const { password } = req.body;
    const isLogin = req.session ? req.session.login : false;

    if (isLogin){
        // res.send('已经登陆');
        res.json(getResponseData(false, '已经登陆'));
    } else {
        if(password === '123' && req.session){
            req.session.login = true;
            // res.send('登陆成功');
            res.json(getResponseData('登陆成功'));
        } else {
            // res.send('登陆失败');
            res.json(getResponseData(false, '登陆失败'));
            // res.send(`${req.teacherName} getData Error`);
        }
    }
    
});

router.get('/getData', checkLogin, (req: RequestWithBody, res: Response) => {
    const secret = 'secretKey';
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyze = DellAnalyzer.getInstance();
    new Crowller(url, analyze);
    // res.send('getData Success!');
    res.json(getResponseData('getData Success!'));

    // const isLogin = req.session ? req.session.login : false;
    // if (isLogin) {
    //     const secret = 'secretKey';
    //     const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    //     const analyze = DellAnalyzer.getInstance();
    //     new Crowller(url, analyze);
    //     res.send('getData Success!');
    // } else {
    //     res.send('请登陆后爬取内容!');
    // }
})

router.get('/showData', checkLogin, (req: RequestWithBody, res: Response) => {
    try {
        const position = path.resolve(__dirname, '../data/course.json');
        const result = fs.readFileSync(position, 'utf8');

        // res.send(JSON.parse(result));
        res.json(getResponseData(JSON.parse(result)));
    } catch (e) {
        // res.send('尚未爬取到内容');
        res.json(getResponseData(false, '尚未爬取到内容'));
    }

    // const isLogin = req.session ? req.session.login : false;
    // if (isLogin){
    //     try {
    //         const position = path.resolve(__dirname, '../data/course.json');
    //         const result = fs.readFileSync(position, 'utf8');
    
    //         res.send(JSON.parse(result));
    //     } catch (e) {
    //         res.send('尚未爬取到内容');
    //     }
    // } else {
    //     res.send('请登陆后爬取内容!');
    // }
});

export default router;
