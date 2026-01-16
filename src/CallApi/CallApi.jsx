import axios from "axios";

export async function callApi({ endPoint, method, body, params }) {
    const baseURL = process.env.REACT_APP_API_URL;
    const fullURL = `${baseURL}${endPoint}`;
    const upperMethod = method.toUpperCase();

    const token = localStorage.getItem("userToken");
    const config = {
        headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": token
        },
        params: params
    };

    if (upperMethod === "GET") {
        return await getRequest(fullURL, config);
    }
    if (upperMethod === "POST") {
        return await postRequest(fullURL, body, config);
    }
}

async function getRequest(url, config) {
    return await axios.get(url, config);
}

async function postRequest(url, body, config) {
    return await axios.post(url, body, config);
}