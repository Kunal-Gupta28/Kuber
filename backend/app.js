const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapRoutes = require('./routes/map.routes')
const rideRoutes = require('./routes/ride.routes')
const paymentRoutes = require('./routes/payment.routes')
const connectedToDB = require("./config/database.config");
connectedToDB();
const cookie = require("cookie-parser");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie());


app.use('/users',userRoutes);
app.use('/captains',captainRoutes);
app.use("/maps",mapRoutes);
app.use('/rides',rideRoutes);
app.use('/payment',paymentRoutes);

   
module.exports = app;    


 
