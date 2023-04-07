import axios from "axios";
import router from "@/router";
import Toastify from "toastify-js";

const uri = "/api";

const setNextRoutePath = function () {
  localStorage.setItem("_next", router.currentRoute.value.path);
};

const http = axios.create({
  baseURL: uri,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

http.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      
      setNextRoutePath();
      localStorage.removeItem("auth");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      router.push({ path: "/login" });
    }

    if (error.response && error.response.status === 422) {
      Toastify({
        text: "Faild due to validation Error.",
        duration: 3000,
        newWindow: true,
        // close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#D32929",
        style: {
          padding: "8px 15px",
        },
        stopOnFocus: true,
      }).showToast();
    }
    if (error.response && error.response.status === 403) {
      Toastify({
        text: error.response.data.message,
        duration: 3000,
        newWindow: true,
        // close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#D32929",
        style: {
          padding: "8px 15px",
        },
        stopOnFocus: true,
      }).showToast();

      localStorage.removeItem("auth");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      router.push({ path: "/login" });
    }
    if (error.response && error.response.status === 500) {
      if (
        error.response.data.message === "Expired token" ||
        error.response.data.message === "Unauthenticated"
      ) {
        localStorage.removeItem("auth");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setNextRoutePath();
        router.push({ path: "/login" });
      }
      Toastify({
        text: error.response.data.message,
        duration: 3000,
        newWindow: true,
        // close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#D32929",
        style: {
          padding: "8px 15px",
        },
        stopOnFocus: true,
      }).showToast();
    }
    return Promise.reject(error);
  }
);

export { http };