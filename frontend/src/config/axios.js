import { HOST } from "@/utils/constants";
import axios from "axios";

const axiosInstance =  axios.create({
    baseURL: HOST
})

export {axiosInstance}