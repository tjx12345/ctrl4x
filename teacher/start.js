'use strict';

const fs = require('fs');
const path = require('path');

// var ffmpeg = require('ffmpeg');

const chokidar = require('chokidar');
const config = require('../config.js');

//启动调度器
require('./mySchedule.js');

var watcher = chokidar.watch('./audio', {
  persistent: true
});
 
// Something to use when events are received.
var log = console.log.bind(console);
// Add event listeners.
let oldFileName;
let beginTime;
let newFileName;
let endTime;
let second;
const linebreak = (process.platform === 'win32') ? '\n\r' : '\n';
const moment = require('moment');
const today = moment().format('YYYY-MM-DD');
//最后修改时间
let fileLastModify;
let saveAbleName = '';
watcher
  .on('add', tempPath => {
      log(`File ${tempPath} has been added`);


      if(tempPath.includes('EV')){
        //记录临时文件名
        oldFileName = tempPath;
        //记录开始时间
        beginTime = new Date();
      }else if(tempPath.includes('json')){//数据文件
          return;
      }else{
        //不是最终的添加操作
        if(newFileName == tempPath) return;
              //添加非临时文件
              newFileName = tempPath;
              //获取视频秒数
              let fpath = path.join('./',tempPath);
              let name = path.parse(tempPath).base;

              //视频时长
              let second = (new Date(fileLastModify) - beginTime) / 1000;
              //保存数据到文件
              let data = {
                teacher:'凃俊雄',
                second,
                begin:beginTime,
                end:fileLastModify,
                name,
              }
              //如果second计算失败则不向文件写入
              if(!second)return;
              let postKey = '凃俊雄'+'_'+ today;
              let postArr = { [postKey]:[]};
              try{
                  postArr[postKey] = JSON.parse(require('fs').readFileSync(config.record))[postKey]
              }catch(e){
                console.log(e);
                  console.log('读取数据json文件失败');
              }
              //追加数据
              postArr[postKey].push(data);
              require('fs').writeFile(config.record,JSON.stringify(postArr),err=>{
                  if(err) throw err;
                  console.log('数据追加成功')
              });

      }
      
  })
  .on('change',(path, stats) => {
    if (stats) console.log(`File ${path} changed size to ${stats.size}`);
    fileLastModify = stats.mtime;
  })
