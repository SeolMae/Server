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
 
    //현재 이름 가지고 오기
    let getUserId = 'SELECT usr_name FROM HalAe.user WHERE usr_id = ?'; 
    let getUserIdRes = await db.queryParam_Arr(getUserId, [user_user_idx]);

    if(!getUserIdRes){
        res.status(500).send({
            message : "Internal Server Error"
       });
        return;
    }
    user_name=getUserIdRes[0].usr_name;

    //게시글 가져오기
    let selectBoardQuery = 'SELECT * FROM HalAe.board order by rand() limit 2'; 
    let selectBoardResult = await db.queryParam_None(selectBoardQuery); 
    let board_list=[];
    for(var i=0;i<selectBoardResult.length;i++){
        let data_res = {
            board_idx : selectBoardResult[i].board_idx,
            board_title : selectBoardResult[i].board_title,
            board_img : selectBoardResult[i].board_img
        }
        board_list.push(data_res);
    }
        
    res.status(201).send({
        message : "Successfully get recommend_board",
        usr_name : user_name,
        data : board_list
    });
});

module.exports = router;