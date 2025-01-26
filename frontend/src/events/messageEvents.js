import { useAppStore } from "@/store"
import { toast } from "sonner"

// Check: error handling
// const emitSocketEvent = async (event, data) => {
//     const { socket } = useAppStore.getState();
//     return new Promise((resolve, reject) => {
//       socket.emit(event, data, (response) => {
//         if (response?.error) {
//           reject(new Error(response.error));
//         } else {
//           resolve(response);
//         }
//       });
//     });
//   };

export const sendMessage = async (data) => {
    try {
        const { socket } = useAppStore.getState()
        socket.emit('sendMessage', data, (err) => {
            throw new Error('Something Went Wrong')
        })
    }
    catch (err) {
        console.log(err.message)
        toast.error(err.message)
    }
}

export const createNewChat = async (data) => {
    try {
        const { socket } = useAppStore.getState()
        socket.emit('newChat', data, (err) => {
            throw new Error('Something Went Wrong')
        })
    }
    catch (err) {
        console.log(err.message)
        toast.error(err.message)
    }

}
