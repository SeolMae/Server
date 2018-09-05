//할메이트 스케쥴
var express = require('express');
var router = express.Router();
const async = require('async');
var moment = require('moment');

const db = require('../../module/pool.js');
const date = require('../../module/moment.js');

//volunteer 테이블에서 usr_id, vol_date

router.get('/:hal_idx', async(req, res) =>{

    if(!req.params.hal_idx){
        res.status(403).send({
            "message" : "please input hal_idx"
        });
        
        return;
      }
    
    try{

        let scheResultData = [];

        let getsche_Query = 'SELECT usr_id, vol_date FROM HalAe.volunteer WHERE hal_idx = ?'
        let schedule_Result = await db.queryParam_Arr(getsche_Query, [req.params.hal_idx]);
        
        console.log(schedule_Result);
        

        if(!schedule_Result){
            res.status(300).send({
              message: "No Data"
            });
            return;
        }
        
        var tempcheck = 0;
        let voldatearry = [];
        voldatearry.push(date.datechange(schedule_Result[0].vol_date));

        //-----------------------봉사자가 있는 날짜 정리------------------------------
        for(let i=1;i<schedule_Result.length;i++){
            
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

        console.log(scheResultData);

        res.status(201).send({
            "message" : "get halmate schedule information Success",
            result : scheResultData
          });
      

    }catch(err){
        console.log(err);
        res.status(500).send({
            "message" : "Internal Server error"
        });

    }

})
module.exports = router;