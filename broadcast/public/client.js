var sock = new SockJS('http://localhost:8080/broadcast');
sock.onmessage = function (event) {
    console.log(event.data);
};
