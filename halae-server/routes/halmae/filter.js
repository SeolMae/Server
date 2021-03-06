const express = require('express');
const router = express.Router();
const async = require('async');
var moment = require('moment');

const db = require('../../module/pool.js');

router.post('/', async(req, res)=> {

    if(req.body.hal_gender == 2 && req.body.hal_interest == "관심분야" && req.body.hal_address == "위치"){ //전부 없을때
        let filterResultData = [];
        let tempObj = {};

        let filteringQuery = 'SELECT hal_idx, hal_name, hal_img, hal_gender, hal_age, hal_address FROM HalAe.halmate ORDER BY RAND() LIMIT 6';
        let filteringResult = await db.queryParam_None(filteringQuery);
        let h, k;
        for(h=0; h<filteringResult.length; h++){
            
                tempObj = {};
                tempObj.hal_idx = filteringResult[h].hal_idx;
                tempObj.hal_name = filteringResult[h].hal_name;
                tempObj.hal_age = filteringResult[h].hal_age;
                tempObj.hal_gender = filteringResult[h].hal_gender;
                tempObj.hal_address = filteringResult[h].hal_address;
                tempObj.hal_img = filteringResult[h].hal_img;
                filterResultData.push(tempObj);
        }

        
        let getinterestQuery = 'SELECT inter_idx FROM HalAe.halmate_inter WHERE hal_idx = ?';
        let getintertextQuery = 'SElECT inter_text FROM HalAe.interest WHERE inter_idx = ?';

        let inter_idxArry;
        let inter_textArry;
        let intertempObj;
        for(let n = 0; n<filterResultData.length; n++){
            inter_idxArry = await db.queryParam_Arr(getinterestQuery, filterResultData[n].hal_idx);
            filterResultData[n].interestArry = [];
            for(let m=0; m<inter_idxArry.length; m++){
                inter_textArry =  await db.queryParam_Arr(getintertextQuery, inter_idxArry[m].inter_idx); 
                console.log(inter_textArry);

                filterResultData[n].interestArry.push(inter_textArry[0].inter_text);
                
            }
        }
        res.status(201).send({
            "message" : "get halmate schedule information Success",
            result : filterResultData
        });
        return;
    }
    
    else if((req.body.hal_gender && req.body.hal_interest && req.body.hal_address)){ //
        try{
        console.log(req.body);

        let filterResultData = [];
        let interestArry = [];
        let tempObj = {};
        
        let filteringQuery;
        let filteringResult;
        if(req.body.hal_gender != 2 && req.body.hal_address !="위치"){
            let address="%";
            address=address.concat(req.body.hal_address);
            address=address.concat("%");
            
            filteringQuery = 'SELECT hal_idx, hal_name, hal_img, hal_gender, hal_age, hal_address FROM HalAe.halmate WHERE hal_gender = ? and hal_address LIKE ?';
            filteringResult= await db.queryParam_Arr(filteringQuery, [req.body.hal_gender,address ]);
        }
        else if(req.body.hal_gender == 2 && req.body.hal_address !="위치"){
            let address="%";
            address=address.concat(req.body.hal_address);
            address=address.concat("%");
            
            filteringQuery = 'SELECT hal_idx, hal_name, hal_img, hal_gender, hal_age, hal_address FROM HalAe.halmate WHERE hal_address LIKE ?';
            filteringResult= await db.queryParam_Arr(filteringQuery, [address]);
        }
        else if(req.body.hal_gender != 2 && req.body.hal_address =="위치"){
            
            filteringQuery = 'SELECT hal_idx, hal_name, hal_img, hal_gender, hal_age, hal_address FROM HalAe.halmate WHERE hal_gender = ?';
            filteringResult= await db.queryParam_Arr(filteringQuery, [req.body.hal_gender]);
        }
        
        if(!filteringResult){
            res.status(204).send({
                "message" : "No data"
              });

              return;

        }
        let hal_idxArry;
        if(req.body.hal_interest != "관심분야"){
            let gethal_idxQuery = 'SELECT hal_idx FROM HalAe.halmate_inter WHERE inter_idx = (SELECT inter_idx FROM HalAe.interest WHERE inter_text = ?)';
            hal_idxArry = await db.queryParam_Arr(gethal_idxQuery, [req.body.hal_interest]);

            if(!hal_idxArry){
                res.status(204).send({
                    "message" : "No data"
                });
                return;
            }
        }

        let h, k;
        for(h=0; h<filteringResult.length; h++){
            //성별이랑 주소 거르기
            if(hal_idxArry){
                for(k=0; k<hal_idxArry.length; k++){
                    //취미 거르기 
                    if(filteringResult[h].hal_idx == hal_idxArry[k].hal_idx){
                        break;
                    }
                }
                if(k != hal_idxArry.length){
                    tempObj = {};
                    tempObj.hal_idx = filteringResult[h].hal_idx;
                    tempObj.hal_name = filteringResult[h].hal_name;
                    tempObj.hal_azoge = filteringResult[h].hal_age;
                    tempObj.hal_gender = filteringResult[h].hal_gender;
                    tempObj.hal_address = filteringResult[h].hal_address;
                    tempObj.hal_img = filteringResult[h].hal_img;
                    filterResultData.push(tempObj);
                }
            }
            else{
                tempObj = {};
                tempObj.hal_idx = filteringResult[h].hal_idx;
                tempObj.hal_name = filteringResult[h].hal_name;
                tempObj.hal_age = filteringResult[h].hal_age;
                tempObj.hal_gender = filteringResult[h].hal_gender;
                tempObj.hal_address = filteringResult[h].hal_address;
                tempObj.hal_img = filteringResult[h].hal_img;
                filterResultData.push(tempObj);
            }
                
        }
        
        let getinterestQuery = 'SELECT inter_idx FROM HalAe.halmate_inter WHERE hal_idx = ?';
        let getintertextQuery = 'SElECT inter_text FROM HalAe.interest WHERE inter_idx = ?';

        let inter_idxArry;
        let inter_textArry;
        let intertempObj;
        for(let n = 0; n<filterResultData.length; n++){
            inter_idxArry = await db.queryParam_Arr(getinterestQuery, filterResultData[n].hal_idx);
            filterResultData[n].interestArry = [];
            for(let m=0; m<inter_idxArry.length; m++){
                inter_textArry =  await db.queryParam_Arr(getintertextQuery, inter_idxArry[m].inter_idx); 

                filterResultData[n].interestArry.push(inter_textArry[0].inter_text);
                
            }
        }

        console.log(filterResultData);
    

        // for(let i=0;i<filteringResult.length;i++){
        //     tempObj = {};
        //     tempObj.hal_idx = filteringResult[i].hal_idx;
        //     tempObj.hal_name = filteringResult[i].hal_name;
        //     tempObj.hal_age = filteringResult[i].hal_age;
        //     tempObj.hal_gender = filteringResult[i].hal_gender;
        //     tempObj.hal_address = filteringResult[i].hal_address;
        //     tempObj.hal_img = filteringResult[i].hal_img;
        //     tempObj.interarry = [];

        //     for(let j=0;j<interestResult.length;j++){
        //         if(interestResult[j].hal_idx == filteringResult[i].hal_idx){
        //             tempObj.interarry.push(interestResult[j].inter_text);
        //         }
        //     }

        //     console.log(tempObj);
        //     filterResultData.push(tempObj);
        // }


        
        res.status(201).send({
            "message" : "get halmate schedule information Success",
            result : filterResultData
          });




    }catch(err){
        console.log(err);
        res.status(500).send({
            "message" : "Internal Server error"
        });
        return;
        }
    }
    
    else{
        res.status(403).send({
            "message" : "please input halmate's gender, interest, and address"
        });
        
        return;
    }
})

module.exports = router;
//SELECT inter_text FROM HalAe.halmate_interest WHERE hal_idx = (SELECT hal_idx FROM HalAe.halmate_interest WHERE inter_text = '춤추기');