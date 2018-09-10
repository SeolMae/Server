var express = require('express');
var router = express.Router();
const moment = require('moment');

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

//유저 스케쥴 등록
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
    
    try{
        let vol_date = req.body.date;
        let vol_hal_idx=req.body.hal_idx;
        let vol_start_time = req.body.start_time;
        let vol_end_time = req.body.end_time;
        let vol_text = req.body.text;
        let vol_total_time = vol_end_time - vol_start_time;
        let vol_inter = req.body.inter;

        let postusrsch_Query = 'INSERT INTO HalAe.volunteer (usr_id, hal_idx, vol_date, vol_starttime, vol_endtime, vol_text, vol_totaltime) VALUES (?, ?, ?, ?, ?, ?, ?)';
        let postusrsch_Result = await db.queryParam_Arr(postusrsch_Query, [user_id, vol_hal_idx, vol_date, vol_start_time, vol_end_time, vol_text, vol_total_time]);
        
        if(!postusrsch_Result){
            res.status(500).send({
            message: "Internal server error"
            });
            return;
        }

        let vol_index=postusrsch_Result.insertId;

        for(var i=0;i<vol_inter.length;i++){ //관심 리스트 등록
                    let signupStyleQuery="SELECT inter_idx FROM interest WHERE inter_text= ?";
                    
                    let signupStyleResult = await db.queryParam_Arr(signupStyleQuery,vol_inter[i]);
                    let intindex=parseInt(signupStyleResult[0].inter_idx,10);
                  
                    let putStyleQuery="INSERT INTO int_vol (inter_idx , vol_idx) VALUES (?, ?)";
                    let putStyleResult=await db.queryParam_Arr(putStyleQuery, [intindex , vol_index]);
                    if(!signupStyleResult || !putStyleResult){ //쿼리 에러 
                        res.status(500).send({
                            message : "Internal Server Error, failed to insert style"
                        }); 
                    }  
        }

        res.status(201).send({
            "message" : "Successfully register user's schedule"
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
    let vol_date=req.body.date;
    try{
        
        let getusrvol_Query = 'DELETE FROM HalAe.volunteer where user_id = ? and hal_idx = ? and date(vol_date)=date( ? )';
        let getusrvol_Result = await db.queryParam_Arr(getusrvol_Query, [user_id, hal_idx, vol_date]);
        
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