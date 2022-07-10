const mongoose = require('mongoose');

const planCatSchema = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    icon : {
        type : String,
        required : true
    },
    items : {
        type : Number,
        default : 0
    },
    userId : String,    
})


module.exports = mongoose.model('Category' , planCatSchema);