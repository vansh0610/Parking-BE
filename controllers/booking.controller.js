const Booking = require('../models/Booking');
const Slot = require('../models/Slot');

// Book a parking slot
exports.bookSlot = async (req, res) => {
  const { startTime, vehicleType } = req.body;
const slotId = req.params.slotId;
  if (!startTime || !vehicleType) {
    return res.status(400).json({ message: 'Start time and vehicle type are required' });
  }

  try {
    const slot = await Slot.findOne({
      _id:slotId,
      isAvailable: true,
      allowedVehicleType: vehicleType,
    });

    if (!slot) {
      return res.status(400).json({ message: `No available slots for ${vehicleType}` });
    }

    const booking = new Booking({
      user: req.user._id,
      slot: slot._id,
      startTime: new Date(startTime),
    });

    await booking.save();

    slot.isAvailable = false;
    slot.currentBooking = booking._id;
    await slot.save();

    res.status(201).json({
      message: `Slot ${slot.slotNumber} booked successfully for ${vehicleType}`,
      booking,
    });
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ message: 'Error booking slot' });
  }
};

// Exit parking and generate bill
exports.exitParking = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const booking = await Booking.findById(bookingId).populate('slot');

    if (!booking || booking.isComplete) {
      return res.status(400).json({ message: 'Invalid or already completed booking' });
    }

    const endTime = new Date();
    const durationMs = endTime - booking.startTime;
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
    const ratePerHour = 50;
    const totalAmount = durationHours * ratePerHour;

    booking.endTime = endTime;
    booking.isComplete = true;
    booking.amount = totalAmount;
    await booking.save();

    const slot = await Slot.findById(booking.slot._id);
    slot.isAvailable = true;
    slot.currentBooking = null;
    await slot.save();

    res.status(200).json({
      message: 'Exited parking successfully. Payment calculated.',
      durationHours,
      amount: totalAmount,
      booking,
    });
  } catch (error) {
    console.error('Exit Error:', error);
    res.status(500).json({ message: 'Error while exiting parking' });
  }
};

// Get all bookings by the logged-in user
// exports.getMyBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user: req.user._id }).populate('slot');
//     res.status(200).json(bookings);
//   } catch (error) {
//     console.error('Fetch Error:', error);
//     res.status(500).json({ message: 'Error fetching bookings' });
//   }
// };
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const allBookings = await Booking.find({ user: userId })
      .populate('slot')
      .sort({ createdAt: 1 }); // Old to New

    const activeBookings = allBookings.filter(b => !b.isComplete);

    res.status(200).json({
      bookings: allBookings,
      activeBookings: activeBookings,
    });
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};
