const express = require('express');
const router = express.Router();
const async = require('async');
var moment = require('moment');

const db = require('../../module/pool.js');
const date = require('../../module/moment.js');


router.get('/:don_idx', async(req, res) => {

    if(!req.params.don_idx){
        res.status(403).send({
            "message" : "please input don_idx"
        });
        
        return;
      }

      try{

        console.log(req.params.don_idx);

        let getdonateQuery = 'SELECT * FROM HalAe.donation WHERE don_idx = ?';
        let donate_Result = await db.queryParam_Arr(getdonateQuery,[req.params.don_idx]);
    

        if(!donate_Result){
            res.status(300).send({
              message: "No Data"
            });
            return;
        }
        
        //할머니 정보도 가져오기
        let gethalmateinfoQuery = 'SELECT hal_name, hal_img, hal_gender, hal_age FROM HalAe.halmate WHERE hal_idx = ?';
        let halmateinfo;                                                            
        let tempObj = {};

            tempObj.don_title = donate_Result[0].don_title;
            tempObj.don_text = donate_Result[0].don_text;
            //date.datechange(schedule_Result[0].vol_date)
            tempObj.start_date = date.datechange(donate_Result[0].start_date);
            tempObj.finish_date = date.datechange(donate_Result[0].finish_date);
            tempObj.goal_money = donate_Result[0].goal_money;
            tempObj.now_money = donate_Result[0].now_money;

            halmateinfo = await db.queryParam_Arr(gethalmateinfoQuery, donate_Result[0].hal_idx);
            console.log(halmateinfo);

            tempObj.hal_name = halmateinfo[0].hal_name;
            tempObj.hal_img = halmateinfo[0].hal_img;
            tempObj.hal_gender = halmateinfo[0].hal_gender;
            tempObj.hal_age = halmateinfo[0].hal_age;

        res.status(201).send({
            "message" : "get donate list Success",
            result : tempObj
          });
      

    }catch(err){
        console.log(err);
        res.status(500).send({
            "message" : "Internal Server error"
        });

    }

})


module.exports = router;