import { create } from "zustand";

interface IUser {
	id: string;
	email: string;
	token: string;
}

type Auth = {
	user: IUser | undefined;
	setUser: (type: IUser | undefined) => void;

	isAuth: boolean; // is the user logged in?
	setAuth: (type: boolean) => void;
	
	logout: () => void;
};

// persists the user in the browser or chrome extensoion context
const useAuthStore = create<Auth>((set) => ({
	user: undefined,
	setUser: (user: IUser | undefined) => {
		if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
			chrome.storage.local.set({ user: user });
		} else {
			localStorage.setItem("user", JSON.stringify(user));
		}

		return set({ user: user });
	},

	isAuth: false,
	setAuth: (val: boolean) => {
		if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
			chrome.storage.local.set({ isAuth: val });
		} else {
			localStorage.setItem("isAuth", JSON.stringify(val));
		}

		return set({ isAuth: val });
	},
	logout: () => {
		if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
			chrome.storage.local.clear();
		} else {
			localStorage.removeItem("user");
			localStorage.removeItem("isAuth");
		}

		return set({ isAuth: false, user: undefined });
	},
}));

export default useAuthStore;
