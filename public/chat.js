const socket = io("http://localhost:4000");

socket.on("Server-sent-user-data-fail", function(data) {
    alert(data + " đã tồn tại");
});
socket.on("Server-sent-user-data-done", function(data) {
    alert("Tạo thành công " + data);
    $("#currentUser").html(data);
    $("#login").hide(2000);
    $("#chat").show(1000);
});

socket.on("Server-sent-user-data-all", function(data) {
    $("#boxContent").html("");
    data.forEach(i => {
        $("#boxContent").append("<p>" + i + "</p>")
    });
});

socket.on("Server-sent-messages", function(data) {
    $("#listMessages").append("<p>" + data.username + ": " + data.messages + "</p>")

});

$(document).ready(function() {
    $("#login").show();
    $("#chat").hide();

    $("#btnOk").click(function() {
        socket.emit("Client-sent-user-data", $("#txtName").val());
    })

    $("#btnLogout").click(function() {
        socket.emit("logout");
        $("#login").show(2000);
        $("#chat").hide(1000);
    })

    $("#btnMessages").click(function() {
        socket.emit("Client-sent-messages", $("#txtMessages").val());
        $("#txtMessages").val("");
    })

})