const express = require('express');
const connectDb = require('./app/config/dbConnect');
const dotenv = require("dotenv").config();

//Middlewares
const errorHandler = require('./app/middleware/errorHandler');
const verifyToken = require('./app/middleware/verifyToken')

//Server
const app = express();
const port = process.env.PORT || 5000
const http = require('http');
const server = http.createServer(app);

//Routes
const AuthController = require('./app/controllers/auth.controller');
const UserRoutes = require('./app/routes/user.route');
const AppointmenRoutes = require('./app/routes/appointment.route');
const MeetingRoutes = require('./app/routes/meeting.route');

const {initMeetingServer} = require('./meeting-server')


//Datatabase Init

initMeetingServer(server)
connectDb();

app.use(express.json({limit:'250mb', extended: true }));
app.use(express.urlencoded({ limit:'250mb', extended: true }));
//app.use(cors());
app.use('/api/v1/auth', AuthController);
app.use('/api/v1/user', verifyToken, UserRoutes);
app.use('/api/v1/appointments', verifyToken, AppointmenRoutes);
app.use('/api/v1/meeting', MeetingRoutes);
app.get('/', (req, res)=>res.status(201).json({response:'System status 200'}));
app.use(errorHandler);

app.listen(port, '192.168.43.177' || 'localhost', ()=>{
console.log(`Server running on port: ${port}`);
});