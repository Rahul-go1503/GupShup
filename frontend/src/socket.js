import { io } from "socket.io-client";
import { useAppStore } from "./store";
import { toast } from "sonner";
import { HOST } from "./utils/constants";


const connectSocket = () => {
  const { userInfo } = useAppStore.getState()
  // console.log(userInfo)
  const socket = io(HOST, {
    autoConnect: false,
    auth: userInfo,
    withCredentials: true
  });
  socket.connect()

  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  socket.on("connect", () => {
    console.log(`Socket-Client(${userInfo.firstName}) is connected with socket id: ${socket.id}`)
  });

  socket.on('receiveMessage', (data) => {
    const { addMessage } = useAppStore.getState()
    console.log('receiveMessage', data)
    addMessage(data)
  })

  socket.on('newChat', (data) => {
    // console.log(data)
    const { users, setUsers } = useAppStore.getState()
    // console.log(data)
    setUsers([data, ...users])
  })

  socket.on('newGroup', (data) => {
    console.log('newGroup Event handler', data)
    try {
      const { users, setUsers } = useAppStore.getState()
      setUsers([data.group, ...users])
      console.log(data)
      toast.success('Group Created')
    }
    catch (err) {
      console.log(err)
      toast.error('Something went wrong')
    }
  })
  socket.on('updateContactId', (contactId) => {
    const { selectedUserData, setSelectedUserData } = useAppStore.getState()
    // console.log(contactId)
    setSelectedUserData({ ...selectedUserData, _id: contactId })
  })
  socket.on("disconnect", (reason) => {
    // the reason of the disconnection, for example "transport error"
    console.log(reason);

    //Check: is it correct to off event here
    socket.off('receiveMessage')
    socket.off('newChat')
    socket.off('newGroup')
    socket.off('updateContactId')
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