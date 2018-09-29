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

    let checkLikeInBoard = 'select usr_name, usr_img from HalAe.user where usr_id = ?'; 
    let checkLikeInBoardRes = await db.queryParam_Arr(checkLikeInBoard, [user_user_idx]); 
    
    if(!checkLikeInBoardRes){
        res.status(500).send({
            message : "Internal Server Error"
        });
        return;
    }

    
    res.status(201).send({
        message : "Successfully get user_info", 
        usr_name : checkLikeInBoardRes[0].usr_name,
        usr_img : checkLikeInBoardRes[0].usr_img
    }); 
    
});

module.exports = router;