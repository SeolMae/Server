//한 할머니 게시글 긁어오기 
var express = require('express');
var router = express.Router();
const async = require('async');

const db = require('../../module/pool.js');

//board 테이블에서 board_hal = hal_idx
//board_idx, board_title, board_img, board_time -> arry

router.get('/:hal_idx', async(req, res) =>{

    if(!req.params.hal_idx){
        res.status(403).send({
            "message" : "please input hal_idx"
        });
        
        return;
      }
    try{
        let boardResult=[];
        let boardResultData = {};

        //board 테이블 할머니 게시글 정보 가져오기
        let getboard_Query = 'SELECT board_idx, board_title, board_img, board_time FROM HalAe.board WHERE board_hal = ?'
        let board_Result = await db.queryParam_Arr(getboard_Query, [req.params.hal_idx]);

        if(!board_Result){
            res.status(300).send({
              message: "No Data"
            });
      
            return;
          }
        for(var i=0;i<board_Result.length;i++){
            boardResultData = {};
            boardResultData.board_idx = board_Result[i].board_idx;
            boardResultData.board_title = board_Result[i].board_title;
            boardResultData.board_img = board_Result[i].board_img;
            boardResultData.board_time = board_Result[i].board_time;
            boardResult.push(boardResultData);
        }


        res.status(201).send({
            "message" : "get halmate information Success",
            result : boardResult
          });
      

    }catch(err){
        console.log(err);
        res.status(500).send({
            "message" : "Internal Server error"
        });

    }

})
module.exports = router;