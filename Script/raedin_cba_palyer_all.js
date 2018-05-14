// let https = require('https');
let Ut = require('./lib/sleep.js');

let GetMysqlPool = require('../front/server/model/connectDatabase.js').GetMysqlConnectPool;

let pool = GetMysqlPool();

let json = require('../front/data/cbaPlayerInfo.json');
/**
 * 数据库操作
 *
 * @inner
 * @param {Object} dbConn 数据库实例句柄
 * @param {string} sql sql命令
 */
function sqlQuery(sql) {
    // 需要建立失败状态处理
    return new Promise((resolve, reject) => {
        pool.query(sql, function (error, results, field) {
            if (error) {
                console.log(error);
                reject();
            }
            else {
                resolve(results);
            }
        });
    });
}

function sqlStr(data) {
    

    let sql = `INSERT INTO match_list (id, homeClubId, homeClubName, home_club_logo, homeScore, guestClubId, guestClubName, guest_club_logo, guestScore, matchTime, round, roundName, matchStatus) VALUES ('${data.id}', '${data.homeClubId}', '${data.homeClubName}', '${data.home_club_logo}', '${data.homeScore}', '${data.guestClubId}', '${data.guestClubName}', '${data.guest_club_logo}', '${data.guestScore}', '${data.matchTime}', '${data.round}', '${data.roundName}', '${data.matchStatus}')`;

    return sql;
}

function match(num) {
    
}

match(38);

