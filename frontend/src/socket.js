import { io } from "socket.io-client";
import { useAppStore } from "./store";
import { HOST } from "./utils/constants";

let socket = null;
const connectSocket = () => {
  const { userInfo } = useAppStore.getState();

  if (!userInfo) return console.error("User not authenticated");

  socket = io(HOST, {
    autoConnect: false,
    auth: userInfo,
    withCredentials: true,
  });

  socket.connect();

  socket.on("connect", () => {
    console.log(`Socket-Client(${userInfo.firstName}) connected with socket id: ${socket.id}`);
  });

  registerSocketEvents();
};

const registerSocketEvents = () => {
  if (!socket) return;

  socket.on("receiveMessage", (data) => {
    const { addMessage } = useAppStore.getState();
    addMessage(data)
  });
  socket.on("newChat", (data) => {

    const { users, setUsers } = useAppStore.getState();
    setUsers([data, ...users])
  });
  socket.on("newGroup", (data) => {
    const { users, setUsers } = useAppStore.getState();
    setUsers([data.group, ...users])
  });
  socket.on("updateContactId", (contactId) => {
    const { selectedUserData, setSelectedUserData } = useAppStore.getState();
    setSelectedUserData({ ...selectedUserData, _id: contactId })
  })


  socket.on("disconnect", () => cleanupSocketListeners());
  socket.on("connect_error", handleConnectionError);
};

const cleanupSocketListeners = () => {
  if (!socket) return;

  socket.off("receiveMessage");
  socket.off("newChat");
  socket.off("newGroup");
  socket.off("updateContactId");
};

const handleConnectionError = (error) => {
  if (socket.active) {
    console.log(error.message, "Temporary failure");
  } else {
    console.log(error, "Connection denied by server");
  }
};

export const disconnectSocket = () => {
  if (socket) {
    cleanupSocketListeners();
    socket.disconnect();
  }
};

export const getSocket = () => socket;
export default connectSocket;