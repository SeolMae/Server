const express = require('express');
const router = express.Router();
const async = require('async');
var moment = require('moment');

const db = require('../../module/pool.js');

router.post('/', async(req, res)=> {

    if(!(req.body.hal_gender && req.body.hal_interest && req.body.hal_address)){ //전부 없을때
        let filterResultData = [];
        let tempObj = {};

        let filteringQuery = 'SELECT hal_idx, hal_name, hal_img, hal_gender, hal_age, hal_address FROM HalAe.halmate ORDER BY RAND() LIMIT 6';
        let filteringResult = await db.queryParam_None(filteringQuery);
        console.log(filteringResult);
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

        console.log(filterResultData);

        
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

        console.log(filterResultData);

        res.status(201).send({
            "message" : "get halmate schedule information Success",
            result : filterResultData
        });
        return;
    }
    if(!(req.body.hal_gender || req.body.hal_interest || req.body.hal_address)){
        res.status(403).send({
            "message" : "please input halmate's gender, interest, and address"
        });
        
        return;
    }
    
    else{
        try{
        console.log(req.body);

        let filterResultData = [];
        let interestArry = [];
        let tempObj = {};

        let filteringQuery = 'SELECT hal_idx, hal_name, hal_img, hal_gender, hal_age, hal_address FROM HalAe.halmate WHERE hal_gender = ? and hal_address = ?';
        let filteringResult = await db.queryParam_Arr(filteringQuery, [req.body.hal_gender, req.body.hal_address]);
        console.log(filteringResult);

        let gethal_idxQuery = 'SELECT hal_idx FROM HalAe.halmate_inter WHERE inter_idx = (SELECT inter_idx FROM HalAe.interest WHERE inter_text = ?)';
        let hal_idxArry = await db.queryParam_Arr(gethal_idxQuery, [req.body.hal_interest]);
        console.log(hal_idxArry);

        if(!(filteringResult&&hal_idxArry)){
            res.status(300).send({
                "message" : "No data"
              });

              return;

        }

        let h, k;
        for(h=0; h<filteringResult.length; h++){
            //성별이랑 주소 거르기
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
                tempObj.hal_age = filteringResult[h].hal_age;
                tempObj.hal_gender = filteringResult[h].hal_gender;
                tempObj.hal_address = filteringResult[h].hal_address;
                tempObj.hal_img = filteringResult[h].hal_img;
                filterResultData.push(tempObj);
            }
        }

        console.log(filterResultData);

        
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
    }
    }
})

module.exports = router;
//SELECT inter_text FROM HalAe.halmate_interest WHERE hal_idx = (SELECT hal_idx FROM HalAe.halmate_interest WHERE inter_text = '춤추기');