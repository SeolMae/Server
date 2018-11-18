var express = require('express');
var router = express.Router();
const moment = require('moment');

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

router.post('/', async function(req, res){

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
        let name =req.body.name;
        let age = req.body.age;
        let phone =req.body.phone;
    
        let updateToken =
        `
        UPDATE user SET usr_name =? and usr_age = ? and usr_phone = ? where usr_id = ?;
        `;
        let updatefcmToken = await db.queryParam_Arr(updateToken, [name, age, phone, user_user_idx]);
    
            res.status(201).send({
              data : {
                id : user_user_idx,
                token : token
              },
              message : "Successfully register user's info"
            });
        
    } catch(err){
        let deleteQuery = 'DELETE FROM HalAe.user where usr_id=?';
        let deleteResult = await db.queryParam_Arr(deleteQuery,[user_user_idx]);
        res.status(400).send({
            message : err
        });
        return;
    }  
});

module.exports = router;