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
    auth: { _id: userInfo._id, firstName: userInfo.firstName },
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
    const { users, setUsers, selectedUserData, setSelectedUserData, userInfo } = useAppStore.getState();
    // console.log(data)
    const updatedUsers = users.filter((user) => user._id !== data.groupId);
    if (data.deletedBy != userInfo._id) {
      toast.info(`You were removed from ${data.groupName} group`)
    }
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


  socket.on('typing', (data) => {
    const { selectedUserData, setTypingUsers, typingUsers } = useAppStore.getState();
    if (selectedUserData?._id == data.id) {
      let newTypingUsers = typingUsers
      if (!typingUsers.includes(data.senderName)) {
        newTypingUsers = [...typingUsers, data.senderName]
      }
      setTypingUsers(newTypingUsers);
    }
    else {
      const { users, setUsers } = useAppStore.getState();
      const updatedUsers = users.map((user) => {
        if (user._id === data.id) {
          const updatedUser = { ...user, typing: true }
          return updatedUser;
        }
        return user;
      });
      setUsers(updatedUsers)
    }
  })

  socket.on('stopTyping', (data) => {
    const { selectedUserData, typingUsers, setTypingUsers } = useAppStore.getState();
    if (selectedUserData?._id == data.id) {
      const newTypingUsers = typingUsers.filter((user) => user != data.senderName)
      setTypingUsers(newTypingUsers);
    }
    else {
      const { users, setUsers } = useAppStore.getState();
      const updatedUsers = users.map((user) => {
        if (user._id === data.id) {
          const updatedUser = { ...user, typing: false }
          return updatedUser;
        }
        return user;
      });
      setUsers(updatedUsers)
    }
  })
  socket.onAny((eventName, ...args) => {
    console.log(eventName, args);
  })
  socket.on("disconnect", () => cleanupSocketListeners());
  socket.on("connect_error", handleConnectionError);
};

const cleanupSocketListeners = () => {
  if (!socket) return;
  socket.removeAllListeners();
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