import axios from "axios";

export async function callApi({ endPoint, method, body }) {
    const baseURL = process.env.REACT_APP_API_URL;
    const fullURL = `${baseURL}${endPoint}`;
    const upperMethod = method.toUpperCase();
    if (upperMethod === "GET") {
        return await getRequest(fullURL);
    }
    if (upperMethod === "POST") {
        return await postRequest(fullURL, body);
    }
}

async function getRequest(url) {
    return await axios.get(url);
}

async function postRequest(url, body) {
    return await axios.post(url, body);
}