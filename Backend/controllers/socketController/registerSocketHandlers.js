import { handleChatEvents } from "./events/chatEvents.js"
import { handleMessageEvents } from "./events/messageEvents.js"


export const registerSocketHandlers = (io, socket) => {
    handleMessageEvents(io, socket)
    handleChatEvents(io, socket)
}