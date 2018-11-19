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
        let address = req.body.address;
        let updateToken =
        `
        INSERT INTO user (usr_id, usr_name, usr_img, usr_phone, usr_address)
        VALUES (?, ?, ?, ?, ?);
        `;
        let updatefcmToken = await db.queryParam_Arr(updateToken, [user_user_idx, name, age, phone,address, user_user_idx]);
        if(!updatefcmToken){
            res.status(500).send({
                
                message : "incorrect "
              });
        }
            res.status(201).send({
              data : {
                id : user_user_idx,
                token : token
              },
              message : "Successfully register user's info"
            });
        
    } catch(err){
        res.status(400).send({
            message : err
        });
        return;
    }  
});

module.exports = router;