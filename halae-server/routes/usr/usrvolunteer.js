var express = require('express');
var router = express.Router();
const moment = require('moment');

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

//유저 봉사시간 보기
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
        let getusrvol_Query = 'select * from HalAe.volunteer where usr_id = ?';
        let getusrvol_Result = await db.queryParam_Arr(getusrvol_Query, [user_id]);
        
        if(!getusrvol_Result){
            res.status(500).send({
            message: "Internal server error"
            });
            return;
        }

        let usrvolData_res=[];
        let usrvolData;
        let vol_sum=0;
        for(var i=0;i<getusrvol_Result.length;i++){ //봉사내역 추가

            usrvolData={
                vol_date : vol_date,
                hal_name : hal_name,
                vol_time : vol_time,
                vol_sum : vol_sum
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