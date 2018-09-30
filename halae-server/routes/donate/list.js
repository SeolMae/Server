const express = require('express');
const router = express.Router();
const async = require('async');
var moment = require('moment');

const db = require('../../module/pool.js');
const date = require('../../module/moment.js');


// //마감임박순 모금액 적은 순 모금액 많은 순 최신순

router.post('/', async(req, res) => {

    if(!req.body.align){
        res.status(403).send({
            "message" : "please input align"
        });
        
        return;
      }

      try{

        console.log(req.body.align);

        let donatelistResult = [];
        let donate_Result;
        let getdonateQuery;

        //기부 타이틀, 할머니 이름,나이,사진,성별, 모금 목표금액, 현재금액, 종료일 
        
        if(req.body.align == '마감임박순'){
            console.log(req.params.align);
            getdonateQuery = 'SELECT * FROM HalAe.donation ORDER BY finish_date ASC';

        }else if(req.body.align == '모금액적은순'){
            getdonateQuery = 'SELECT * FROM HalAe.donation ORDER BY goal_money ASC ';

        }else if(req.body.align == '모금액많은순'){
            getdonateQuery = 'SELECT * FROM HalAe.donation ORDER BY goal_money DESC ';

        }else{
            getdonateQuery = 'SELECT * FROM HalAe.donation ORDER BY goal_money ASC ';
        }
        //-----------------------최신순 -> 디비 수정 해야 함 
        
        donate_Result = await db.queryParam_None(getdonateQuery);
        console.log(donate_Result);

        if(!donate_Result){
            res.status(300).send({
              message: "No Data"
            });
            return;
        }

        
        //--------------------donate_Result 배열 정리--------------------여기 코드 추가 

        //할머니 정보도 가져오기
        let gethalmateinfoQuery = 'SELECT hal_name, hal_img, hal_gender, hal_age FROM HalAe.halmate WHERE hal_idx = ?';
        let halmateinfo;                                                            
        let tempObj = {};

        for(let i=0; i<donate_Result.length; i++){
            tempObj.don_title = donate_Result[i].don_title;
            tempObj.don_text = donate_Result[i].don_text;
            //date.datechange(schedule_Result[0].vol_date)
            tempObj.start_date = date.datechange(donate_Result[i].start_date);
            tempObj.finish_date = date.datechange(donate_Result[i].finish_date);
            tempObj.goal_money = donate_Result[i].goal_money;
            tempObj.now_money = donate_Result[i].now_money;

            halmateinfo = await db.queryParam_Arr(gethalmateinfoQuery, donate_Result[i].hal_idx);
            console.log(halmateinfo);

            tempObj.hal_name = halmateinfo[i].hal_name;
            tempObj.hal_img = halmateinfo[i].hal_img;
            tempObj.hal_gender = halmateinfo[i].hal_gender;
            tempObj.hal_age = halmateinfo[i].hal_age;

            donatelistResult.push(tempObj);
        }

        res.status(201).send({
            "message" : "get donate list Success",
            result : donatelistResult
          });
      

    }catch(err){
        console.log(err);
        res.status(500).send({
            "message" : "Internal Server error"
        });

    }

})


module.exports = router;