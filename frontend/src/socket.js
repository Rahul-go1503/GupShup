import { io } from "socket.io-client";
import { useAppStore } from "./store";
import { HOST } from "./utils/constants";
import { toast } from "sonner";

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

  socket.on('removeGroup', (data) => {
    const { users, setUsers, selectedUserData, setSelectedUserData } = useAppStore.getState();
    // console.log(data)
    const updatedUsers = users.filter((user) => user._id !== data.groupId);
    toast.info('You were removed from one group')
    if (selectedUserData?._id == data.groupId) {
      setSelectedUserData(undefined)
    }
    setUsers(updatedUsers);
  })
  socket.on('updateGroup', (data) => {
    const { users, selectedUserData, setSelectedUserData, setUsers } = useAppStore.getState();
    const updatedUsers = users.map((user) => {
      if (user._id === data._id) {
        const updatedUser = { ...user, ...data }
        return updatedUser;
      }
      return user;
    });
    // console.log(data, updatedUsers)
    setUsers(updatedUsers)
    if (selectedUserData?._id == data._id) {
      setSelectedUserData({ ...selectedUserData, ...data })
    }
    // setUsers(updatedUsers);
  })

  socket.onAny((eventName, ...args) => {
    console.log(eventName, args);
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