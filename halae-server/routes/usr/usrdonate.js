var express = require('express');
var router = express.Router();
const moment = require('moment');

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

//유저의 기부내역 확인하기
router.get('/', async (req, res) => {

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
    
    try{
        //유저의 기부내역
        let getusrhal_Query = 'SELECT * FROM HalAe.usr_donation where usr_id = ?';
        let getusrhal_Result = await db.queryParam_Arr(getusrhal_Query, [user_id]);
        
        let usrhalResultData_res=[];
        let data_res;

        let money_sum =0;
        for(var i=0;i<getusrhal_Result.length;i++){
            let getusrhalinfo_Query = 'SELECT hal_name, don_idx, don_title FROM HalAe.donation as b, HalAe.halmate as u where b.don_idx = ? and b.hal_idx=u.hal_idx';
            let getusrhalinfo_Result = await db.queryParam_Arr(getusrhalinfo_Query, [getusrhal_Result[i].don_idx]);
    
            if(!getusrhalinfo_Result){
                res.status(501).send({
                message: "No donation Data"
                });
                return;
            }
            money_sum += getusrhal_Result[i].money;
            data_res={
                hal_name : getusrhalinfo_Result[0].hal_name,
                don_idx : getusrhalinfo_Result[0].don_idx,
                don_title : getusrhalinfo_Result[0].don_title,
                don_money : getusrhal_Result[i].money,
                don_time : moment(getusrhal_Result[i].time).format("YYYY.MM.DD")
            }
            

            usrhalResultData_res.push(data_res);
        }
        res.status(201).send({
            "message" : "Successfully get usr_donate", 
            money_total : money_sum,
            data : usrhalResultData_res,
        }); 

    }catch(err){
        console.log(err);
        res.status(500).send({
            "message" : "Server error"
        });
    }
  
});


module.exports = router;