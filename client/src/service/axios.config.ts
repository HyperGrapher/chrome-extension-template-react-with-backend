import axios, { AxiosResponse } from "axios";

/* create axios configuration with base url and headers */
export const authAxios = axios.create({
	baseURL: "http://localhost:5656/api",
	headers: {
		Accept: "application/json",
	},
	withCredentials: true, 
});

export const publicAxios = axios.create({
	baseURL: "http://localhost:5656/api",
	headers: {
		Accept: "application/json",
	},
});

authAxios.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		const status = error && error.response ? error.response.status : 0;

		if (status === 401 || status === 403) {
			// do something to inform user
			console.error(error);
			
		}
		return Promise.reject(error);
	}
);

// TODO: make responseData type safe: i.e. (response: AxiosResponse<T>)
export const responseData = (response: AxiosResponse) => response.data;
export const parseAuthResponse = (response: AxiosResponse<{id: string, email: string, token: string}>) => response.data;