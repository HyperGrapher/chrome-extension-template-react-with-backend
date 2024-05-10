import { authAxios as api, responseData } from "./axios.config";

// TODO: fix those for whats needed in the body etc...
const request = {
	get: (url: string) => api.get(url).then(responseData),
	post: (url: string, body: {}) => api.post(url, body).then(responseData),
	put: (url: string, body: {}) => api.put(url, body).then(responseData),
	delete: (url: string) => api.delete(url).then(responseData),
};

// TODO: create API calls with headers
export const apiService = {
	// getProjects: (): Promise<IProject[]> => request.get("/v1/projects", axiosAuthHeader()),
	// getSubCategories: (id: string): Promise<ISubCategory[]> => request.get(`/v1/subCategory/${id}`, axiosAuthHeader()),
	// postProject: (body: IProjectPost): Promise<any> => request.post("/v1/projects", body, axiosAuthHeader()),
};
