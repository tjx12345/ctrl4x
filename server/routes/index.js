var express = require('express');
var router = express.Router();
const Stu = require('../models/db.js');
const Course = require('../models/db.js');

const stu_db = new Stu('stu_comment');
const course_db = new Course('courses');



const infos = [];
const records = [];
// 接收学生信息
router.post('/infos', function(req, res, next) {
        stu_db.insert([req.body], function(err, result) {
            res.end('ok');
        });
    })
    // 接收老师信息
    .post('/records', function(req, res, next) {
        course_db.insert([req.body], function(err, result) {
            res.end('ok');
        });

    })
    .get('/infos', function(req, res, next) {
        stu_db.find({}, function(err, comments) {
            res.json(comments);
        });
    })
    .get('/records', function(req, res, next) {
        course_db.find({}, function(err, course) {
            if (err) throw err;
            res.json(course);
        });
    })
    .get('/records/:name/:time', function(req, res, next) {
        let commentsReport = [];
        let name = req.params.name; // 老师名称

        const moment = require('moment');
        const time = req.params.time || moment().format('YYYY-MM-DD');

        course_db.find({ name, time }, function(err, teachers) {
            if (err) throw err;

            if (teachers.length == 0) return res.json({
                msg: '没有数据'
            });
            let course = teachers[0].course;

            stu_db.find({ date: time, teacherId: name }, function(err, comments) {
                //查找学生信息
                //一个个视频
                for (let i = 0; i < course.length; i++) {
                    //根据老师匹配评论,按老师及评论日期查询
                    let cou = course[i];
                    for (var j = comments.length - 1; j >= 0; j--) {
                        let comment = comments[j];
                        //如果 课程时间起始包含了评论时间 
                        let begin = new Date(cou.begin);
                        let end = new Date(cou.end);
                        let t = new Date(comment.time);

                        if (begin > t || end < t) {
                            continue;
                        }

                        let minusTime = (t - begin) / 1000; //视频秒

                        commentsReport.push({
                            minusTime,
                            courseName: cou.name,
                            teacher: comment.teacherId,
                            comment: comment.info == '0' ? '不懂' : '理解'
                        });
                    }

                }

                //比较完毕            
                res.json(commentsReport);

            });


        });

    });


module.exports = router;