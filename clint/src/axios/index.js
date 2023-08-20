import axios from "axios";

const baseURL = "/server/server";

const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    withCredentials: true,
  },
});

export default instance;
