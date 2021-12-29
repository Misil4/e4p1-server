import Express from "express";
import Mongoose from "mongoose";
console.log(process.env.replace(/\\n/g, '\n'))
import { createRequire } from "module";
import UserModel from "./models/userModel.js";
import GarbageModel from "./models/garbageModel.js";
const require = createRequire(import.meta.url);
const mongodbRoute = process.env.MONGO_DB_URI.replace(/\\n/g, '\n')
import router from "./routes/routes.js";
import { Server } from "socket.io";



const app  = Express();
const port = process.env.PORT.replace(/\\n/g, '\n') || 3001;
const http = require('http')
const server = http.createServer(app)

const socketIO = require('socket.io');
const io = socketIO(server);
io.on('connection', socket => {
  console.log('client connected on websocket');
  socket.on('disconnect', () => {
    console.log("disconnected")
  })

  socket.on("user_data", () => {
    UserModel.find({ rol: "user" }).then(docs => {
      io.sockets.emit("get_users", docs);
    })
  })

  try {
  socket.on("badge_update", (email) => {
    console.log("estamos en el server")
    console.log(email)
    let login_status = true;
      UserModel.findOne({ email: email }, (err, docs) => {
        if (docs.login_status) {
          login_status = false
        }
        UserModel.updateOne({ email: email }, { $set: { login_status: login_status } }, { new: true }, (err, docs) => {
          if (err) return console.log("error al realizar la peticion")
          if (!docs) return console.log("no existe el user")
          console.log(docs)
          io.sockets.emit("change_data");
        })
      })





    /*UserModel.updateOne({email: email}, { $set: {login_status: login_status} }, { new: true })
      .then(updatedDoc => {
        // Emitting event to update the Kitchen opened across the devices with the realtime order values
        io.sockets.emit("change_data");
      });*/
  });
} catch (error) {
  console.error(error)
}

  socket.on("garbage_data", () => {
    GarbageModel.find({ completed: false }).then(docs => {
      io.sockets.emit("get_trash", docs);
    })
  })
  socket.send("Hello!");
});

server.listen(port, () => {
  console.log('server started and listening on port ' + port);
});

app.use(Express.urlencoded({ extended: false }));
app.use(Express.json());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})


app.use(router);
const options = {
  socketTimeoutMS: 0,
  keepAlive: true,
  useNewUrlParser: true
};
Mongoose.Promise = global.Promise
Mongoose.connect(mongodbRoute, options, (err) => {
  if (err) {
    return console.log(`Error al conectar a la base de datos: ${err}`)
  }


  console.log(`Conexión con Mongo correcta.`)
})
