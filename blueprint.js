// Description:
//   Download blueprint and etc..
//
// Commands:
//   ?|？ - download start
'use strict';
var request = require('request');
var fs = require('fs');
var path = require('path');

module.exports = (robot) => {
    robot.hear(/^\?$|^？$/i, (res) => {
        if (res.message.roomType === 2) { // グループトークのみ反応する
            res.send({
                question: '取得する資料を選択してください',
                options: ['図面','工程表']
            });
        }
    });
    robot.hear('select', (res) => { // セレクトスタンプ受信
        if (res.json.response !== null) { // セレクトスタンプの応答だった場合
            if (res.json.question === '取得する資料を選択してください') { // ボットのセレクトスタンプのみに反応
                if( res.json.options[res.json.response] === '図面' ) { // 応答が「図面」だった場合
                    // 図面を取得しにいく処理
                    // PDFのサンプルファイルを取得 urlを本番用APIに差し替える
                    var url = 'https://helpx.adobe.com/jp/acrobat/kb/cq07071635/_jcr_content/main-pars/download-section/download-1/file.res/sample.pdf'
                    request({method: 'GET', url: url, encoding: null}, (error,response,body) => {
                        fs.writeFileSync('/tmp/'+path.basename(url), body, 'binary');
                        res.send({path: '/tmp/'+path.basename(url)});
                    });
                }
                else if ( res.json.options[res.json.response] === '工程表' ) { // 応答が「工程表」だった場合
                    // 工程表を取りに行く処理
                    res.send('準備中');
                }
            }
        }
    });
};
