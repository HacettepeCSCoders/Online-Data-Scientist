import axios from "axios";

export const login = async (creds) => {
    try {
        const response = await axios({
            method: "post",
            url: "http://localhost:8080/api/v1/auth/login",
            data: creds,
            config: {headers: {"Content-Type": "multipart/form-data"}},
        });
        //handle success
        console.log(response);
        return response;
    } catch (response_1) {
        //handle error
        console.log(response_1);
    }
};

export const signup = async (creds) => {
    try {
        const response = await axios({
            method: "post",
            url: "http://localhost:8080/api/v1/auth/register",
            data: creds,
            config: {headers: {"Content-Type": "multipart/form-data"}},
        });
        //handle success
        console.log(response);
        return response;
    } catch (response_1) {
        //handle error
        console.log(response_1);
    }
};
