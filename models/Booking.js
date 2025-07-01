const mongoose = require('mongoose');

const bookingSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,
        ref:'User'},
    slot:{type:mongoose.Schema.Types.ObjectId,
        ref:'Slot'},
     startTime: {
    type: Date,
    required: true,  
  }, 
  endTime: {
    type: Date,
    default: null,  },
     
    isComplete:{type:Boolean, 
        default:false},
   amount: {
    type: Number,
    default: 0,
  }
},{timestamps:true});





module.exports = mongoose.model('Booking', bookingSchema);
