import { useAppStore } from "@/store"
import { toast } from "sonner"

export const sendMessage = async (data) => {
    const { socket } = useAppStore.getState()
    socket.emit('sendMessage', data, (res) => {
        if (res.success == false) {
            console.log(res)
            toast.error(res.error)
        }
    })
}
