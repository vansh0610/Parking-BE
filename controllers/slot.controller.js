const Slot = require('../models/Slot');

// 🔍 Get all slots (admin or user view)
// exports.getAllSlots = async (req, res) => {
//   try {
//     const slots = await Slot.find().populate('currentBooking');
//     res.status(200).json(slots);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching slots' });
//   }
// };

exports.getAllSlots = async (req, res) => {
  try {
    const { type } = req.query;

    // ✅ This must match exactly how vehicleType is stored in DB
    const filter = type ? { allowedVehicleType: type } : {};

    const slots = await Slot.find(filter);
    res.json({ slots });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch slots' });
  }
};





// ✅ Create a new slot (admin only)
exports.createSlot = async (req, res) => {
  const { slotNumber, allowedVehicleType } = req.body;

  if (!slotNumber || !allowedVehicleType) {
    return res.status(400).json({ message: 'Slot number and vehicle type are required' });
  }

  try {
    const existing = await Slot.findOne({ slotNumber });
    if (existing) {
      return res.status(400).json({ message: 'Slot number already exists' });
    }

    const slot = new Slot({
      slotNumber,
      allowedVehicleType, // must be: '2-wheeler', '3-wheeler', '4-wheeler'
    });

    await slot.save();
    res.status(201).json({ message: 'Slot created successfully', slot });
  } catch (err) {
    res.status(500).json({ message: 'Error creating slot' });
  }
};

// ❌ Delete a slot (admin only)
exports.deleteSlot = async (req, res) => {
  const { id } = req.params;

  try {
    const slot = await Slot.findById(id);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });

    if (slot.currentBooking) {
      return res.status(400).json({ message: 'Slot is currently booked. Cannot delete.' });
    }

    await Slot.findByIdAndDelete(id);
    res.status(200).json({ message: 'Slot deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting slot' });
  }
};
