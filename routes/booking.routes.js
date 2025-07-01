// const express = require('express');
// const router = express.Router();

// const{
//     bookSlot,
//     exitParking,
//     getMyBookings
// }=require('../controllers/booking.controller')

// const auth=require('../middlewares/auth')

// router.post('/book',auth,bookSlot);

// router.put('/exit/:id',auth,exitParking)

// router.get('/my',auth,getMyBookings);

// module.exports = router;


const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const {
  bookSlot,
  exitParking,
  getMyBookings
} = require('../controllers/booking.controller');

// Correct handlers
router.post('/book/:slotId', auth, bookSlot);
router.post('/exit/:id', auth, exitParking);
router.get('/my', auth, getMyBookings);

module.exports = router;
