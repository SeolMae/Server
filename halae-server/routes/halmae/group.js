const express = require('express');
const router = express.Router();
const async = require('async');

const db = require('../../module/pool.js');


//hal_idx 받아서 halmate 테이블에서 그룹 소개글, group 테이블에서 그룹원들 
router.get('/:hal_idx', async(req, res) => {

    if(!req.params.hal_idx){
        res.status(403).send({
            "message" : "please input hal_idx"
        });
        
        return;
    }

    try{
        let groupResultData = {};

        let getgroupintro_Query = 'SELECT hal_group_intro FROM HalAe.halmate WHERE hal_idx = ?'
        let groupintro_Result = await db.queryParam_Arr(getgroupintro_Query, [req.params.hal_idx]);

        groupResultData.groupintro = groupintro_Result[0].hal_group_intro;


        let getgroup_Query = 'SELECT u.usr_name, usr_img, isleader FROM HalAe.group as g, HalAe.user as u WHERE hal_idx = ? and g.usr_id=u.usr_id';
        let group_Result = await db.queryParam_Arr(getgroup_Query, [req.params.hal_idx]);
        

        let groupmemlen = group_Result.length;
        groupResultData.groupmemarry = [];

        for(let i = 0; i < groupmemlen; i++){
            groupResultData.groupmemarry.push(group_Result[i]);
        }

        if(!group_Result){
        res.status(203).send({
        message: "No Data"
        });
            return;
        }

        res.status(201).send({
           "message" : "get halmate group information Success",
            result : groupResultData
        });   


    }catch(err){
        console.log(err);
        res.status(500).send({
        "message" : "Internal Server error"
    });

    }


} )
module.exports = router;