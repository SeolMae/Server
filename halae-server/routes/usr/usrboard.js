var express = require('express');
var router = express.Router();
const moment = require('moment');

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

router.get('/', async function(req, res){
    let board_idx = req.params.board_idx; 
    let token;
    let user_user_idx; //접속되어 있는 유저

    if(token){
        token = req.headers.token; 

        let decoded = jwt.verify(token);
    
        if (decoded == -1){
            res.status(500).send({
                message : "Token error"
            }); 
        }
        user_user_idx = decoded.user_idx;
    }

    let user_name;
    let user_img;

    let bookmark_flag=0;

    let board_list;

    let selectBoardQuery = 'SELECT * FROM HalAe.board where board_usr = ? order by board_time desc'; 
    let selectBoardResult = await db.queryParam_Arr(selectBoardQuery, [board_idx, user_user_idx]); 

    for(var i=0;i<selectBoardResult.length;i++){
        let board_idx=selectBoardResult[i].board_idx;

        //user_idx를 가져오기 위한 user_board 테이블에 접근
        let selectWriterOneBoardQuery = 'SELECT * FROM HalAe.board WHERE board_idx = ?'; 
        let selectWriterOneBoardResult = await db.queryParam_Arr(selectWriterOneBoardQuery, [board_idx]);
        
        if(user_user_idx){
            //bookmark flag를 가져오기 위한 북마크 테이블 비교
            let checkLikeInBoard = 'select * from HalAe.bookmark where usr_id = ? and board_idx = ?'; 
            let checkLikeInBoardRes = await db.queryParam_Arr(checkLikeInBoard, [user_user_idx, board_idx]); 
        
            if(!checkLikeInBoardRes){
                res.status(500).send({
                    message : "Internal Server Error1"
                });
                return;
            }

            if(checkLikeInBoardRes.length>0) bookmark_flag=1;
        }
        if(!selectOneBoardResult || !selectWriterOneBoardResult){
            res.status(500).send({
                message : "Internal Server Error2"
            });
            return;
        }
        else {

            //글쓴이 이름과 이미지 가지고 오기
            let getUserId = 'SELECT * FROM HalAe.user WHERE usr_id = ?'; 
            let getUserIdRes = await db.queryParam_Arr(getUserId, [selectWriterOneBoardResult[0].board_usr]);
            
            if(!getUserIdRes){
                res.status(500).send({
                    message : "Internal Server Error3"
                });
                return;
            }
            user_name = getUserIdRes[0].usr_name;
            user_img = getUserIdRes[0].usr_img; 
        
        }
        let data_res = {
            board_idx : board_idx,
            usr_img : user_img,
            usr_name : user_name,
            board_date : moment(selectOneBoardResult[0].board_time).format('YYYY.MM.DD'),
            board_title : selectOneBoardResult[0].board_title,
            board_img : selectOneBoardResult[0].board_img,
            board_desc : selectOneBoardResult[0].board_text,
            bookmark_flag : bookmark_flag
        }
        board_list.push(data_res);
    }
        
        res.status(201).send({
            message : "Successfully get board list", 
            data : board_list
        });
    });

module.exports = router;