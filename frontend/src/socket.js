import { io } from "socket.io-client";
import { useAppStore } from "./store";
// import { HOST } from "./utils/constants";


const connectSocket = (userId) => {
  const socket = io('http://localhost:5000/', {
    query: {
      userId: userId
    },
    withCredentials: true
  });
  // socket.connect()

  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  socket.on("connect", () => {
    console.log('Socket-Client is connected with socket id: ', socket.id); // x8WIv7-mJelg7on_ALbx
  });

  socket.on('receiveMessage', (data) => {
    // const { message, to } = data
    // console.log(data)
    const { selectedUserData, addMessage } = useAppStore.getState()
    if (selectedUserData._id !== data.receiverId) return
    addMessage(data)
  })
  socket.on("disconnect", (reason) => {
    // the reason of the disconnection, for example "transport error"
    console.log(reason);
  })

  socket.on("connect_error", (error) => {
    if (socket.active) {
      // temporary failure, the socket will automatically try to reconnect
      console.log(error.message, "Temprory failure")
    } else {
      // the connection was denied by the server
      // in that case, `socket.connect()` must be manually called in order to reconnect
      console.log(error, "Connection denied by server");
    }
  });
  return socket
}
export default connectSocket;