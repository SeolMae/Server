var express = require('express');
var router = express.Router();
const moment = require('moment');

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

router.get('/', async function(req, res){
    let token=req.headers.token; 
    let user_user_idx; //접속되어 있는 유저

    if(token){

        let decoded = jwt.verify(token);
    
        if (decoded == -1){
            res.status(500).send({
                message : "Token error"
            }); 
        }
        user_user_idx = decoded.user_idx;
    }
    else{
            res.status(403).send({
                message : "no token"
            }); 
        return;
    }
    let user_name;
    console.log(user_user_idx);
    //현재 이름 가지고 오기
    let getUserId = 'SELECT usr_name FROM HalAe.user WHERE usr_id = ?'; 
    let getUserIdRes = await db.queryParam_Arr(getUserId, [user_user_idx]);
    
    if(!getUserIdRes){
        res.status(500).send({
            message : "Internal Server Error"
       });
        return;
    }
    console.log(getUserIdRes);
    user_name=getUserIdRes[0].usr_name;

    //기부글 랜덤으로 2개 가져오기
    let selectBoardQuery = 'SELECT * FROM HalAe.donation order by rand() limit 2'; 
    let selectBoardResult = await db.queryParam_None(selectBoardQuery); 
    let board_list=[];
    for(var i=0;i<selectBoardResult.length;i++){
        //기부글의 할머니 이름 가져오기
        let selechalNameQuery = 'SELECT hal_name FROM HalAe.halmate where hal_idx = ?'; 
        let selecthalNameResult = await db.queryParam_Arr(selechalNameQuery, [selectBoardResult[i].hal_idx]);

        let data_res = {
            don_idx : selectBoardResult[i].don_idx,
            don_title : selectBoardResult[i].don_title,
            don_img : selectBoardResult[i].don_img,
            hal_name : selecthalNameResult[0].hal_name,
            don_now : selectBoardResult[i].now_money,
            don_percent : (selectBoardResult[i].now_money/selectBoardResult[i].goal_money)*100
        }
        board_list.push(data_res);
    }
        
    res.status(201).send({
        message : "Successfully get recommend_donate",
        usr_name : user_name,
        data : board_list
    });
});

module.exports = router;