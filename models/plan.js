 const mongoose = require('mongoose');

const planSchema = mongoose.Schema({
    title : String,
    categoryID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        required : true
    },
    tasks : {
        type : Array,
        required : true,
    },
    date : {
        type : String,
        required : true
    },
    category:{
        title : String,
        icon : String
    },
    userId : {
        type : String
    }

})


module.exports = mongoose.model('Plan' , planSchema);