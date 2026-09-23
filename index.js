const express =  require('express')
const app = express();
require('./config/config')
const userrouter = require('./router/userrouter')
const jobrouter = require('./router/jobrouter')
const applicationrouter = require('./router/applicationrouter')
const messagerouter = require('./router/messagerouter')
const contactrouter = require('./router/contactrouter')
const notificationrouter = require('./router/notificationrouter')
const cors = require('cors')





app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));  // resume files yahan se serve honge
app.use(userrouter);
app.use(jobrouter);
app.use(applicationrouter);
app.use(messagerouter);
app.use(contactrouter);
app.use(notificationrouter);


app.listen(6100,()=>console.log("server running on port 6100"))