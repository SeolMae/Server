var express = require('express');
var router = express.Router();
const moment = require('moment');

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

//유저의 할메이트 찾기
router.get('/', async (req, res) => {

    let token = req.headers.token;
    let decoded = jwt.verify(token);
    let user_id;
    //decoding 실패시
    if(decoded == -1){
        res.status(500).send({
            message : "Token Error"
        });
        return;
    }
    //정상 수행 시
    else{
       user_id = decoded.user_idx;
    }
    
    try{
        //유저의 할메이트들
        let getusrhal_Query = 'SELECT hal_idx, met_time FROM HalAe.group WHERE usr_id = ?';
        let getusrhal_Result = await db.queryParam_Arr(getusrhal_Query, [user_id]);
        
        if(!getusrhal_Result){
            res.status(201).send({
            message: "user don't have halmmate"
            });
            return;
        }

        let usrhalResultData_res=[];
        let data_res;
        let current_time = moment();
        for(var i=0;i<getusrhal_Result.length;i++){
            let getusrhalinfo_Query = 'SELECT hal_idx, hal_img, hal_name, hal_phone FROM HalAe.halmate WHERE hal_idx = ?';
            let getusrhalinfo_Result = await db.queryParam_Arr(getusrhalinfo_Query, [getusrhal_Result[i].hal_idx]);
    
            if(!getusrhalinfo_Result){
                res.status(501).send({
                message: "No halmae info Data"
                });
                return;
            }
            
            var time = moment(current_time,"YYYY-MM-DD").diff(moment(getusrhal_Result[i].met_time,"YYYY-MM-DD"));
            data_res={
                hal_idx : getusrhalinfo_Result[0].hal_idx,
                hal_name : getusrhalinfo_Result[0].hal_name,
                hal_img : getusrhalinfo_Result[0].hal_img,
                hal_phone : getusrhalinfo_Result[0].hal_phone,
                met_time : time
            }
            

            usrhalResultData_res.push(data_res);
        }
        res.status(201).send({
            "message" : "Successfully get usr_halmae", 
            data : usrhalResultData_res
        }); 

    }catch(err){
        console.log(err);
        res.status(500).send({
            "message" : "Server error"
        });
    }
  
});

//유저의 할메이트 등록
router.post('/', async (req, res) => {

    let token = req.headers.token;
    let decoded = jwt.verify(token);
    let user_id;
    //decoding 실패시
    if(decoded == -1){
        res.status(500).send({
            message : "Token Error"
        });
        return;
    }
    //정상 수행 시
    else{
       user_id = decoded.user_idx;
    }
    
    let hal_idx=req.body.hal_idx;
    try{
        let is_leader=1;
        //리더인지 아닌지 확인
        let getusrvol_Query = 'select * from HalAe.group where hal_idx = ?';
        let getusrvol_Result = await db.queryParam_Arr(getusrvol_Query, [hal_idx]);
        
        if(!getusrvol_Result){
            res.status(500).send({
            message: "Internal server error"
            });
            return;
        }else if(getusrvol_Result.length>0){
            is_leader=0;
        }


        //유저의 할메이트 등록
        let getusrhal_Query = 'INSERT INTO HalAe.grup (usr_id, hal_idx, isleader, met_time) VALUES (?,?,?,?)';
        let getusrhal_Result = await db.queryParam_Arr(getusrhal_Query, [user_id, hal_idx, is_leader, moment()]);
        
        res.status(201).send({
            message: "successfully register usr_halmae"
        });

    }catch(err){
        console.log(err);
        res.status(500).send({
            "message" : "Server error"
        });
    }
  
});

//유저의 할메이트 삭제
router.delete('/', async (req, res) => {

    let token = req.headers.token;
    let decoded = jwt.verify(token);
    let user_id;
    //decoding 실패시
    if(decoded == -1){
        res.status(500).send({
            message : "Token Error"
        });
        return;
    }
    //정상 수행 시
    else{
       user_id = decoded.user_idx;
    }
    
    let hal_idx=req.body.hal_idx;
    try{
        
        let getusrvol_Query = 'DELETE FROM HalAe.group where usr_id = ? and hal_idx = ?';
        let getusrvol_Result = await db.queryParam_Arr(getusrvol_Query, [user_id, hal_idx]);
        
        if(!getusrvol_Result){
            res.status(500).send({
            message: "Internal server error"
            });
            return;
        }
        
        res.status(201).send({
            message: "successfully delete usr_halmae"
        });

    }catch(err){
        console.log(err);
        res.status(500).send({
            "message" : "Server error"
        });
    }
  
});

module.exports = router;