//한 할머니 정보 보기 & 정보 수정하기 
var express = require('express');
var router = express.Router();
const async = require('async');

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

//파라미터로 할머니 idx 
//halmate 테이블에서 할머니 정보(이름, 성별, 주소, 번호)  +  volunteer 테이블에서 할머니 idx 에 봉사자 count 

router.get('/:hal_idx', async(req, res) => {

  if(!req.params.hal_idx){
    res.status(403).send({
        "message" : "please input hal_idx"
    });
    
    return;
  }

  try{
    let infoResultData = {};

    //할머니 정보 가져오기 -> 할머니 이름, 성별, 프사, 주소, 번호 
    let gethalinfo_Query = 'SELECT hal_img, hal_name, hal_gender, hal_address, hal_phone FROM HalAe.halmate WHERE hal_idx = ?';
    let halinfo_Result = await db.queryParam_Arr(gethalinfo_Query, [req.params.hal_idx]);

    infoResultData.hal_name = halinfo_Result[0].hal_name;
    infoResultData.hal_gender = halinfo_Result[0].hal_gender;
    infoResultData.hal_img = halinfo_Result[0].hal_img;
    infoResultData.hal_address = halinfo_Result[0].hal_address;
    infoResultData.hal_phone = halinfo_Result[0].hal_phone;

    if(!halinfo_Result){
      res.status(300).send({
        message: "No Data"
      });

      return;
    }

    //할머니 봉사자 수 가져오기
    let countvol_Query = 'SELECT COUNT(*) AS vol_cnt FROM HalAe.volunteer WHERE hal_idx = ?';
    let countvol_Result = await db.queryParam_Arr(countvol_Query, [req.params.hal_idx]);

    infoResultData.vol_cnt = countvol_Result[0].vol_cnt;

    console.log(infoResultData);

    res.status(201).send({
      "message" : "get halmate information Success",
      result : infoResultData
    });


  }catch(err){
    console.log(err);
    res.status(500).send({
      "message" : "Server error"
    });
  }
});

module.exports = router;
