import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL, {autoConnect : false}); 

socket.onAny((event, ...args) => {
  console.log(event, args);
});

socket.on("connect", () => {
  console.log('Socket-Client is connected with socket id: ',socket.id); // x8WIv7-mJelg7on_ALbx
});
socket.on("disconnect", (reason) => {
    // the reason of the disconnection, for example "transport error"
    console.log(reason);
})

socket.on("connect_error", (error) => {
  if (socket.active) {
    // temporary failure, the socket will automatically try to reconnect
    console.log(error, "Temprory failure")
  } else {
    // the connection was denied by the server
    // in that case, `socket.connect()` must be manually called in order to reconnect
    console.log(error, "Connection denied by server");
  }
});

  // socket.on("connect_error", (err) => {
  //   // the reason of the error, for example "xhr poll error"
  //   console.log(err.message);
  
  //   // some additional description, for example the status code of the initial HTTP response
  //   console.log(err.description);
  
  //   // some additional context, for example the XMLHttpRequest object
  //   console.log(err.context);
  // });

export default socket;