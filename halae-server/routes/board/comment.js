var express = require('express');
var router = express.Router();
const moment = require('moment');

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

router.get('/:board_idx', async function(req, res){
    
    let board_idx = req.params.board_idx; 
    

    if(!board_idx){
        res.status(400).send({
            message : "Null Value"
        }); 
        return;
    }

    let comment_arr = []; 
    //comment를 가져오기 위한 board_comment와 comment 테이블 접근
    let checkCmtInBoard = 'SELECT * FROM board_comment WHERE board_idx = ?'; 
    let checkCmtInBoardRes = await db.queryParam_Arr(checkCmtInBoard, [board_idx]); 

    if(!checkCmtInBoardRes){
        res.status(500).send({
            message : "Internal Server Error"
        }); 
    }
    else if(checkCmtInBoardRes.length == 0){
        //댓글이 없음
        comment_arr = null; 
    }
    else {
        //댓글이 있음
        let getCommentInfo = 'SELECT * FROM comment c, (SELECT user_img FROM user u WHERE u.user_id = (select comment_id from comment where comment_idx=?)) u WHERE comment_idx = ?'; 
        let getCommentInfoRes;
        let comment_arry;
        for (var i=0; i<checkCmtInBoardRes.length; i++){
            comment_idx = checkCmtInBoardRes[i].comment_idx; 
            getCommentInfoRes = await db.queryParam_Arr(getCommentInfo, [comment_idx, comment_idx]);

            if(!getCommentInfoRes){
                res.status(500).send({
                    message : "Internal Server Error"
                });
            }
            else {
                comment_arry={
                    comment_idx : getCommentInfoRes[0].comment_idx,
                    comment_desc : getCommentInfoRes[0].comment_desc,
                    comment_date : moment(getCommentInfoRes[0].comment_date).format('MM DD HH mm ss'),
                    comment_id : getCommentInfoRes[0].comment_id,
                    user_img : getCommentInfoRes[0].user_img
                }
                comment_arr = comment_arr.concat(comment_arry); 
            }
        }
    }
    res.status(200).send({
        message : "Successfully get comment list",
        data : comment_arr
    });
});

router.post('/', async function(req, res){

    let board_idx = req.body.board_idx; 
    let comment_desc = req.body.comment_text;
    let token = req.headers.token; 

    let decoded = jwt.verify(token); 
    if(!board_idx || !comment_desc){
        res.status(400).send({
            message : "Null Value"
        }); 
        return;
    }
    else{
        if(token)
        {
            if(decoded == -1){
                res.status(500).send({
                    mesasge : "Token Error"
                }); 
                return; 
            }
        } 
        else{
            res.status(403).send({
                mesasge : "No token"
            }); 
            return; 
        }
        
        let user_idx = decoded.user_idx;
        

        let insertCommentQuery = 'INSERT INTO HalAe.comment (board_idx, usr_id, cmt_date, cmt_text) VALUES(?, ?, ?, ?)'; 
        let insertCommentRes = await db.queryParam_Arr(insertCommentQuery, [board_idx, user_idx, moment() ,comment_desc]);
        if(!insertCommentRes){
            res.status(500).send({
                mesasge : "Internal Server Error"
            });
            return;
        }
       
    }
    res.status(200).send({
        message : "Successfully register comment",
        data : comment_arr
    });
});

module.exports = router;