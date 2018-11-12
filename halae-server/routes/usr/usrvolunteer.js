var express = require('express');
var router = express.Router();
const moment = require('moment');

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

//유저 봉사시간 보기
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
        let getusrvol_Query = 'select * from HalAe.volunteer where usr_id = ? order by vol_date asc';
        let getusrvol_Result = await db.queryParam_Arr(getusrvol_Query, [user_user_idx]);
        
        if(!getusrvol_Result){
            res.status(500).send({
            message: "Internal server error"
            });
            return;
        }

        let usrvolData_res=[];
        let usrvolData;
        let vol_sum=0;
        let gethal_Query = 'select * from HalAe.halmate where hal_idx = ?';
        
        for(var i=0;i<getusrvol_Result.length;i++){ 
    
            let gethal_Result = await db.queryParam_Arr(gethal_Query, [getusrvol_Result[i].hal_idx]);
            vol_sum = vol_sum + getusrvol_Result[i].vol_totaltime;
        
            usrvolData={
                vol_date : moment(getusrvol_Result[i].vol_date,"MM-DD"),
                hal_name : gethal_Result[0].hal_name,
                hal_gender : gethal_Result[0].hal_gender,
                vol_time : getusrvol_Result[i].vol_totaltime,
            }
            
            usrvolData_res.push(usrvolData);
        }

        res.status(201).send({
            "message" : "Successfully get user's volunteer list",
            sum : vol_sum,
            data : usrvolData_res
        }); 

    }catch(err){
        console.log(err);
        res.status(500).send({
            "message" : "Server error"
        });
    }
  
});

module.exports = router;