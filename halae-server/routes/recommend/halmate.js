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

    //유저의 주소 가져오기
    let getUserAddressQuery = 'SELECT usr_name, usr_address FROM HalAe.user where usr_id = ?'; 
    let getUserAddressResult = await db.queryParam_Arr(getUserAddressQuery, [user_user_idx]); 
    let address;
    if(!getUserAddressResult){
        res.status(500).send({
            message : "Internal Server Error"
        });
        return;
    }
    else{
        address = getUserAddressResult[0].usr_address;
    }
    
    let trim_address=address.split(' ');
    let str_address=trim_address[0].concat(" ",trim_address[1]);
    str_address=trim_address[1];
    console.log(str_address);
    let address_="%";
        address_=address.concat(str_address);
        address_=address.concat("%");
    let gethalmateQuery='SELECT * from HalAe.halmate WHERE (SELECT SUBSTRING_INDEX(hal_address, \' \', 2) FROM HalAe.halmate) = ?';
    gethalmateQuery='SELECT * from HalAe.halmate WHERE hal_address LIKE ?';
    let gethalmateResult = await db.queryParam_Arr(gethalmateQuery, [address_]);
    
    if(!gethalmateResult){
        res.status(500).send({
            message : "Internal Server Error"
        });
        return;
    }
    let board_list=[];
    for(var i=0;i<2;i++){
        let gethalmateQuery='select inter_text from HalAe.interest where inter_idx in (SELECT inter_idx from HalAe.halmate_inter WHERE hal_idx = ?)';
        let gethalmateinterResult = await db.queryParam_Arr(gethalmateQuery, [gethalmateResult[i].hal_idx]);
    
        let inter_list = [];
        if(!gethalmateinterResult){
                res.status(500).send({
                message : "Internal Server Error"
            });
            return;
        }else {
            for(var j=0;j<gethalmateinterResult.length;j++){
                inter_list.push(gethalmateinterResult[j].inter_text);
            }
        }
        var addarr=gethalmateResult[i].hal_address.split(' ');
        let data_res = {
            
            hal_img : gethalmateResult[i].hal_img,
            hal_idx : gethalmateResult[i].hal_idx,
            hal_name : gethalmateResult[i].hal_name,
            hal_age : gethalmateResult[i].hal_age,
            hal_address : addarr[0]+" "+addarr[1],
            inter_list : inter_list
        }
        board_list.push(data_res);
    }
        
    res.status(201).send({
        message : "Successfully get recommend_halmate",
        usr_name : getUserAddressResult[0].usr_name,
        data : board_list
    });
});

module.exports = router;