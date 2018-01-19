const axios = require('axios');  
const schedule = require("node-schedule");  
const moment = require('moment');
const config = require('../config');

const today = moment().format('YYYY-MM-DD') + ' ' + config.scheduleTime;
schedule.scheduleJob(new Date(today), function(){  
  console.log('send')
   axios.post(`${config.server_host}:${config.server_port}/recode`,require(config.record))
   .then(res=>{
    console.log(res)
   })
   .catch(err=>console.log(err));

});