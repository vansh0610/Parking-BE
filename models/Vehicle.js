const vehicleSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId,
           ref: 'User' },
  numberPlate: String,
  type: {
    type: String,
    enum: ['2-wheeler', '3-wheeler', '4-wheeler'],
    required: true,
  },
});