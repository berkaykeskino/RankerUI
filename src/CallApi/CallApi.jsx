import axios from "axios";

export async function callApi({ endPoint, method, body, params }) {
    const baseURL = process.env.REACT_APP_API_URL;
    const fullURL = `${baseURL}${endPoint}`;
    const upperMethod = method.toUpperCase();
    if (upperMethod === "GET") {
        return await getRequest(fullURL, params);
    }
    if (upperMethod === "POST") {
        return await postRequest(fullURL, body);
    }
}

async function getRequest(url, params) {
    return await axios.get(url, {params});
}

async function postRequest(url, body) {
    return await axios.post(url, body);
}