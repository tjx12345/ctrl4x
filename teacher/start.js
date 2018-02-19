'use strict';

const fs = require('fs');
const path = require('path');

// var ffmpeg = require('ffmpeg');

const chokidar = require('chokidar');
const config = require('../config.js');


const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('请输入视频保存路径!!\n', (answer) => {

    try {
        fs.accessSync(answer);
    } catch (e) {
        console.log('路径不存在,正在创建中...');
        fs.mkdirSync(answer);
    }

    rl.question('请输入老师名称:\n',name=>{

    console.log('教室端正在运行中,请勿关闭此窗口..');
    var watcher = chokidar.watch(answer, {
        persistent: true
    });

    // Something to use when events are received.
    var log = console.log.bind(console);
    // Add event listeners.
    let oldFileName;
    let beginTime;
    let newFileName;
    let endTimenpmform === 'win32') ? '\n\r' : '\n';
    const moment = require('moment');
    const today = moment().format('YYYY-MM-DD');
    //最后修改时间
    let fileLastModify;
    let saveAbleName = '';
    watcher
        .on('add', tempPath => {
            log(`File ${tempPath} has been added`);


            if (tempPath.includes('EV')) {
                //记录临时文件名
                oldFileName = tempPath;
                //记录开始时间
                beginTime = new Date();
            } else if (tempPath.includes('json')) { //数据文件
                return;
            } else {
                //不是最终的添加操作
                if (newFileName == tempPath) return;
                //添加非临时文件
                newFileName = tempPath;
                //获取视频秒数
                let fpath = path.join('./', tempPath);
                let name = path.parse(tempPath).base;

                //视频时长
                let second = (new Date(fileLastModify) - beginTime) / 1000;
                //保存数据到文件
                let data = {
                    second,
                    begin: beginTime,
                    end: fileLastModify,
                    name,
                }
                //如果second计算失败则不向文件写入
                if (!second) return;
                let postData = {};
                postData.name = name;
                postData.time = today;
                postData.course = [];

                //要么被赋值
                try {
                    postData = JSON.parse(require('fs').readFileSync(config.record));
                } catch (e) {
                    console.log(e);
                    console.log('读取数据json文件失败');
                }
                //追加数据
                postData.course.push(data);
                require('fs').writeFile(config.record, JSON.stringify(postData), err => {
                    if (err) throw err;
                    console.log('数据追加成功')
                });

            }

        })
        .on('change', (path, stats) => {
            if (stats) console.log(`File ${path} changed size to ${stats.size}`);
            fileLastModify = stats.mtime;
        })

    //启动调度器
    require('./mySchedule.js');

    //关闭输入
    rl.close();
  });
});