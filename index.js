const express = require('express');
const app = express();
const path = require('path');
// const morgan = require('morgan');
const port = 4000;
const server = require("http").Server(app);
const io = require('socket.io')(server);

var user = [];
io.on("connection", function(socket) {
    console.log("Connection: " + socket.id + " | " + Date());

    socket.on("disconnect", function() {
        console.log(socket.id + " disconnect | " + Date());
    });

    socket.on("Client-sent-user-data", function(data) {
        if (user.indexOf(data) >= 0) {
            socket.emit("Server-sent-user-data-fail", data);
        } else {
            user.push(data)
            console.log(user);
            console.log(socket.id + "sent: " + data);
            socket.Username = data;
            console.log(socket.Username + " login | " + Date());
            socket.emit("Server-sent-user-data-done", data);
            io.sockets.emit("Server-sent-user-data-all", user);
        }
    });

    socket.on("logout", function() {
        console.log(socket.Username + " logout | " + Date());
        user.splice(user.indexOf(socket.Username), 1);
        io.sockets.emit("Server-sent-user-data-all", user);
    });

    socket.on("Client-sent-messages", function(data) {
        console.log(socket.Username + data + " | " + Date());
        io.sockets.emit("Server-sent-messages", { username: socket.Username, messages: data });

    });

    socket.on("Client-sent-data", function(data) {
        console.log(socket.id + "sent: " + data);
        //sau khi lắng nghe dữ liệu, server phát lại dữ liệu này đến tất cả client        
        // io.sockets.emit("Server-sent-data", data + socket.id);
        //sau khi lắng nghe dữ liệu, server phát lại dữ liệu này đến chính client đó 
        // socket.emit("Server-sent-data", data + socket.id);
        //sau khi lắng nghe dữ liệu, server phát lại dữ liệu này đến các client khác
        socket.broadcast.emit("Server-sent-data", data + socket.id);
    });
});


// app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'))
server.listen(port);


app.get("/", function(req, res, next) {
    res.render("home");
})

app.get("/chat", function(req, res, next) {
    res.render("chat");
})

console.log("Run");