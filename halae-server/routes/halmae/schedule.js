//할메이트 스케쥴
var express = require('express');
var router = express.Router();
const async = require('async');

const moment = require('moment');
const db = require('../../module/pool.js');
const date_moment = require('../../module/moment.js');

//volunteer 테이블에서 usr_id, vol_date

router.get('/:hal_idx', async(req, res) =>{

    if(!req.params.hal_idx){
        res.status(403).send({
            "message" : "please input hal_idx"
        });
        
        return;
      }
    
    try{
        console.log(req.params.hal_idx);
        let getmonth_Query = 'SELECT MONTH(vol_date) AS m, count(*) as n FROM HalAe.volunteer WHERE hal_idx = ? GROUP BY m';
        let getmonth_Result = await db.queryParam_Arr(getmonth_Query, [req.params.hal_idx]);
        let getsche_Query = 'SELECT usr_name, vol_date, vol_starttime, vol_endtime FROM HalAe.volunteer WHERE hal_idx = ? order by vol_date asc'
        let schedule_Result = await db.queryParam_Arr(getsche_Query, [req.params.hal_idx]);
        

        if(!schedule_Result || !getmonth_Result){
            res.status(300).send({
              message: "No Data"
            });
            return;
        }
        let result=[];
        let result_bymon={};
        let result_data=[];
        var result_byday ={};
        var result_daysch=[];
        var result_onesch={};
        var date;
        var i=0;
    
        for(var j=0;j<getmonth_Result.length;j++){
            result_bymon={};
            result_bymon.month=getmonth_Result[j].m;
            date=date_moment.date_no_change(schedule_Result[i].vol_date);
            for(var k=0;k<getmonth_Result[j].n ; k++){
                result_onesch={};
                result_onesch.usr_name = schedule_Result[i].usr_name;
                result_onesch.starttime=schedule_Result[i].vol_starttime;
                result_onesch.endtime = schedule_Result[i].vol_endtime;
                if(moment(date,'YYYY-MM-DD').diff(schedule_Result[i].vol_date,'day')!=0){//이전 것과 날짜가 다를 때
                    result_byday.date=date_moment.date_no_change(date);
                    result_byday.sch=result_daysch;
                    result_data.push(result_byday);
                    result_byday={};
                    result_daysch=[];
                }
                result_daysch.push(result_onesch);
                date = date_moment.date_no_change(schedule_Result[i].vol_date);
                i++;
            }
            result_byday.date=date_moment.date_no_change(date);
            result_byday.sch=result_daysch;
            result_data.push(result_byday);
            result_byday={};
            result_daysch=[];

            result_bymon.mon_sch=result_data;
            result_data=[];
            result.push(result_bymon);
        }
       
        /*let result=[];
        for(let l=0;l<schedule_Result.length;l++){
            var op={};
            voldatearry.push(date.datechange(schedule_Result[l].vol_date));
        }*/
        //var tempcheck = 0;
        /*let voldatearry = [];
        for(let l=0;l<schedule_Result.length;l++){
            voldatearry.push(date.datechange(schedule_Result[l].vol_date));
        }*/
        //-----------------------봉사자가 있는 날짜 정리------------------------------
        /*for(let i=1;i<schedule_Result.length;i++){
            
            for(let j=0;j<voldatearry.length;j++){
                if((date.datechange(schedule_Result[i].vol_date)) != voldatearry[j]){
                    tempcheck++;
                }
            }

            if(tempcheck==voldatearry.length){
                voldatearry.push(date.datechange(schedule_Result[i].vol_date));

            }
            tempcheck = 0;
        }
       console.log(voldatearry);

    
       //-------------------------------날짜에 따른 봉사자 정리------------------------------

       let tempObj = {};

        // for(let h=0;h<schedule_Result.length;h++){
        //     scheResultData[h].usrbydate = [];
        //     for(let m=0;m<scheResultData.length;m++){
        //         if(date.datechange(schedule_Result[h].vol_date)==scheResultData[m].date){
        //             scheResultData[m].usrbydate.push(schedule_Result[h].usr_id);
        //         }
        //     }
        // }
        
        for(let h=0;h<voldatearry.length;h++){
            tempObj.date = voldatearry[h];
            tempObj.usrbydate = [];
            for(let m=0;m<schedule_Result.length;m++){
                if(date.datechange(schedule_Result[m].vol_date)==voldatearry[h]){
                    tempObj.usrbydate.push(schedule_Result[m].usr_id);
                }
            }
            scheResultData.push(tempObj);
        }       

        console.log(scheResultData);*/


        res.status(201).send({
            "message" : "get halmate schedule information Success",
            data : result
          });
      

    }catch(err){
        console.log(err);
        res.status(500).send({
            "message" : "Internal Server error"
        });

    }

})
module.exports = router;