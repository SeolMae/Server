var moment = require('moment');

module.exports = {
    datechange : function(time){
        return(moment(time).format("YYYY년 MM월 DD일"));
    },
    date_no_change : function(time){
        return(moment(time).format("YYYY-MM-DD"));
    }
}