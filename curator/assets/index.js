const renderUploads = (uploads) => {
    console.log(uploads);
    uploads.map((upload) => {
        $('#messages').append(`<li>${upload.name}</li>`);
    });
}

// use websockets to update data
$(function () {
    var socket = io();
    $('#event-dispatch').on('click', function(){
        console.log('clicked');
        socket.emit('chat message', 'TEST');
    });
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
    socket.on('db update', function(msg){
        console.log(msg);
        var desc = msg.payload.split(',')[4];
        $('#messages').append($('<li>').text(desc));
    });
});

// get data on page loads
$(function () {
    $.get( "/api/uploads", function( data ) {
        renderUploads(data);
    });
});