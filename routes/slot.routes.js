const express = require('express');
const router = express.Router();
 const auth=require('../middlewares/auth')
 const checkRole=require('../middlewares/checkRole')

const { getAllSlots, createSlot,deleteSlot } = require('../controllers/slot.controller');
  

router.get('/',getAllSlots);
router.post('/', auth, checkRole('admin'), createSlot);
router.delete('/:id',auth,checkRole('admin'),deleteSlot);

module.exports=router;