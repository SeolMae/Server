var express = require('express');
var router = express.Router();
const moment = require('moment');

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

const upload = require('../../config/multer.js');

router.get('/:board_idx', async function(req, res){
    let board_idx = req.params.board_idx; 
    let token=req.headers.token; 
    let user_user_idx; //접속되어 있는 유저

    if(token){

        let decoded = jwt.verify(token);
    
        if (decoded == -1){
            res.status(500).send({
                message : "Token error"
            }); 
            return;
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
    let user_img;

    let bookmark_flag=0;

    //board_idx 게시글이 존재하는지 확인
    //board_idx 입력 오류 
    if(!board_idx){
        res.status(400).send({
            message : "Null Value"
        }); 
        return;
    }
    else {
        let selectOneBoardQuery = 'SELECT * FROM HalAe.board WHERE board_idx = ?'; 
        let selectOneBoardResult = await db.queryParam_Arr(selectOneBoardQuery, [board_idx]); 

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
        res.status(201).send({
            message : "Successfully get One board", 
            data : data_res
        }); 
    
    }
});

router.post('/',upload.single('board_img'), async function(req, res){
    let board_title = req.body.board_title;
    let board_desc=req.body.board_desc;
    let hal_idx=req.body.hal_idx;

    if(!req.file || !board_title  || !board_desc  || !hal_idx ){ //값이 없을 때
        res.status(403).send({
            message : "Null Value"
        }); 
        return;
    }
    board_img = req.file.location;
    let token=req.headers.token; 
    let user_user_idx; //접속되어 있는 유저

    if(token){

        let decoded = jwt.verify(token);
    
        if (decoded == -1){
            res.status(500).send({
                message : "Token error"
            }); 
            return;
        }
        user_user_idx = decoded.user_idx;
    }
    else{
            res.status(403).send({
                message : "no token"
            }); 
        return;
    }
    //글쓴이 이름 가지고 오기
    let getUserId = 'SELECT * FROM HalAe.user WHERE usr_id = ?'; 
    let getUserIdRes = await db.queryParam_Arr(getUserId, [user_user_idx]);
    
    if(!getUserIdRes){
        res.status(500).send({
            message : "Internal Server Error3"
        });
        return;
    }
    user_name = getUserIdRes[0].usr_name; 
    console.log(user_name);
    //게시물 등록하기
    let insertCommentQuery = 'INSERT INTO HalAe.board (board_usr, board_name, board_hal, board_title, board_img, board_time, board_text) VALUES(?, ?,?, ?, ?, ?, ?)'; 
    let insertCommentRes = await db.queryParam_Arr(insertCommentQuery, [ user_name , user_user_idx, hal_idx, board_title, board_img, new moment().format("yyyy-mm-dd hh:mm:ss") ,board_desc]);
    if(!insertCommentRes){
        res.status(500).send({
            mesasge : "Internal Server Error"
        });
        return;
    }

    res.status(201).send({
        message : "Successfully register board"
    }); 
    
});

module.exports = router;