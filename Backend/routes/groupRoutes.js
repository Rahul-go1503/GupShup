import { Router } from "express";
import { addNewMember, createNewGroup, deleteGroup, getGroupDetails, removeMember, updateGroupAdmins, updateGroupDetails } from "../controllers/groupController.js";
import validateJWT from "../middlewares/validateJWT.js";

const route = Router()

route.use(validateJWT)
route.post('/', createNewGroup)
route.get('/:id', getGroupDetails)

route.patch('/details', updateGroupDetails)
route.patch('/admins', updateGroupAdmins)

route.delete('/:id', deleteGroup)

route.post('/member/add', addNewMember)
route.post('/member/remove', removeMember)

export default route