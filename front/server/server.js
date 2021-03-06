/**
 * 数据请求处理层
 */

const Router = require('koa-router');
const oneBcrypt = require('./oneBcrypt');

let user = require('./api/user');
let Article = require('./api/article');
// let scenicspot = require('./api/scenicspot');
let Match = require('./api/match.js');
let Search = require('./api/search.js');
let Prodict = require('./api/prodiction.js')
const jwt = require('jsonwebtoken');

let route = new Router();

let article = new Article();
let search = new Search();
let prodict = new Prodict();
const secret = 'oneStep_secret';

// 用户相关---------------------------------------------------------------------------
route.get('/api/user', async (ctx) => {
    // 验证码
    let phone = ctx.query.userPhone;
    console.log('输入的手机号：' + phone);
    try {
        let res = await user.verificationCode(phone);
        status = res ? 1 : 0;
        // let data = res ? createdMd5(createdMd5(res.toString()).toString()) : 0;
        // console.log(res);
        ctx.response.type = 'json';
        ctx.response.body = {
            status: status,
            data: res
        };
    }
    catch (err) {
        console.log(err);
    }
});

route.get('/api/setting', async (ctx) => {
    // 验证码
    let type = ctx.query.type;
    let value = ctx.query.value;
    try {
        let res = await user.userSetting(ctx.state.user.aid, type, value);

        ctx.response.type = 'json';
        ctx.response.body = {
            data: res
        };
    }
    catch (err) {
        console.log(err);
    }
});

// 注册
route.post('/api/user', async (ctx) => {
    const {body} = ctx.request;
    body.hashPassword = await oneBcrypt.getPasswrdHash(body.userPassword);
    console.log(body.hashPassword);
    if (!body.hashPassword) {
        ctx.body = {
            message: '服务器繁忙'
        };
    }

    console.log(`注册接收到的数据为${body}`);
    try {
        let res = await user.registration(body);
        console.log(res);
        if (!res) {
            ctx.status = 401;
            ctx.body = {
                message: '服务器繁忙'
            };
        }
        else {
            ctx.body = {
                status: true,
                message: '注册成功'
            };
        }
    }
    catch (error) {
        ctx.throw(500);
    }

});

// 登录
route.put('/api/user', async (ctx) => {
    const {body} = ctx.request;
    try {
        const userInfo = await user.login(body);
        if (userInfo.length < 1) {
            ctx.status = 200;
            ctx.body = {
                message: '用户名错误'
            };
            return;
        }

        // 匹配密码是否相等
        let flag = await oneBcrypt.comparePassword(body.userPassword, userInfo[0].password);
        if (flag) {
            delete userInfo[0].upassword;
            ctx.status = 200;
            ctx.body = {
                status: true,
                message: '登录成功',
                user: userInfo[0],
                // 生成 token 返回给客户端
                token: jwt.sign({
                    aid: userInfo[0].aid,
                    phone: userInfo[0].phone,
                    // 设置 token 过期时间
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 5), // 60 seconds * 60 minutes = 1 hour
                }, secret)
            };
        }
        else {
            ctx.status = 200;
            ctx.body = {
                message: '密码错误'
            };
            return;
        }
    }
    catch (error) {
        console.log(error);
        ctx.throw(500);
    }

});

// 二次进入网站获取用户信息
route.get('/api/userInfo', async (ctx) => {
    // 验证码
    let aid = ctx.state.user.aid;
    console.log(aid)
    try {
        const userInfo = await user.getUserInfoById(aid);
            ctx.status = 200;
            ctx.body = {
                status: true,
                userInfo: userInfo
            };
    }
    catch (err) {
        console.log(err);
    }
});

// 文章相关------------------------------------------------------------------------

// 存文章
route.post('/api/article', async (ctx) => {
    let {body} = ctx.request;
    let res = await article.addArticle(body);
    ctx.response.type = 'json';
    ctx.response.body = {
        data: res
    };
});

// 收藏
route.post('/api/collection', async (ctx) => {
    let {body} = ctx.request;
    let res = await article.addCollect(body);
    ctx.response.type = 'json';
    ctx.response.body = {
        msg: '收藏成功',
        status: true
    };
});

// 获取收藏列表
route.get('/api/collection', async (ctx) => {

    let res = await article.selectCollectArticle(ctx.state.user.aid);

    ctx.response.type = 'json';
    ctx.response.body = {
        msg: '获取收藏成功',
        status: true,
        data: res
    };
});

// 步行街获取文章列表，根据uptime排序
route.get('/api/allArticle', async (ctx) => {
    let lastTime = ctx.query.lastTime;
    console.log('ddd')
    let res = await article.selectAllArticle(lastTime);
    ctx.response.type = 'json';
    ctx.response.body = {
        data: res
    };
});

// 获取用户自己发布的文章
route.get('/api/userOwnArticle', async (ctx) => {

    let res = await article.searchUserOwnArticle(ctx.state.user.aid);
    ctx.response.type = 'json';
    ctx.response.body = {
        data: res
    };
});


route.get('/api/article', async (ctx) => {
    let articleId = ctx.query.articleId;
    // console.log(ctx.state.user);
    let res = await article.selectArticle(articleId);

    ctx.response.type = 'json';
    ctx.response.body = {
        data: res
    };
});

// 评论
route.post('/api/comment', async (ctx) => {
    console.log('cddddddddddddddddddddd');
    let {body} = ctx.request;
    console.log(body);
    let res = await article.addComment(body.id, body.commentInfo);
    ctx.response.type = 'json';
    ctx.response.body = res;
});

// 比赛相关请求
let match = new Match();
route.get('/api/match', async (ctx) => {
    let days = ctx.query.days;
    console.log(days);
    let res = await match.getShowMatchList(days);
    ctx.response.type = 'json';
    ctx.response.body = {
        data: res
    };
});

// 用户相关操作
// 1. 获取用户上传图片token
route.get('/api/qiniuToken', async (ctx) => {
    // let days = ctx.query.days;
    let res = await user.getQiniuToken();
    ctx.response.type = 'json';
    ctx.response.body = {
        data: res
    };
});


// 搜索相关
route.get('/api/search', async (ctx) => {
    let key = ctx.query.key;
    // console.log(ctx.state.user);
    let res = await search.returnSearchValue(key);

    ctx.response.type = 'json';
    ctx.response.body = {
        data: res
    };
});

// 预测操作
route.post('/api/prodict', async (ctx) => {
    let {body} = ctx.request;
    console.log(body);
    let aid = ctx.state.user.aid;
    let res = await prodict.dict(body.gameid, aid, body.isBelieve, body.repu);
    ctx.response.type = 'json';
    ctx.response.body = {
        data: res
    };
});

// 获取用户预测列表
route.get('/api/userProdict', async (ctx) => {
    let res = await prodict.getUserProdict(ctx.state.user.aid);
    ctx.response.type = 'json';
    ctx.response.body = {
        msg: '获取预测成功',
        status: true,
        data: res
    };
});


module.exports = route;
