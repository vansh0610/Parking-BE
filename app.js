const express=require('express')
const cors =require('cors')
const connectDB=require('./config/db')
const dotenv=require('dotenv')

dotenv.config();


const app=express();
app.use(cors())
app.use(express.json());

connectDB();


app.use('/api/users',require('./routes/user.routes'))
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/slots', require('./routes/slot.routes'));



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




module.exports=app;