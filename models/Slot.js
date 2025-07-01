const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  slotNumber: String,
  isAvailable: {
    type: Boolean,
    default: true,
  },
  currentBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null,
  },
  allowedVehicleType: {
    type: String,
    enum: ['2-wheeler', '3-wheeler', '4-wheeler'],
    required: true,
  }
});

module.exports = mongoose.model('Slot', slotSchema);
