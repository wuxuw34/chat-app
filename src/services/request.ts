import axios from "axios";

const axiosIns = axios.create({
    baseURL:"",
    timeout:2000
})

export default axiosIns