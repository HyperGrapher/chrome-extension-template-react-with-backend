import { useState, useEffect } from 'react'
import Options from './Options';
import AuthRegister from './auth/AuthRegister';
import Login from './auth/AuthLogin';
import authStore from './service/auth.store';
import AuthComp from './auth/AuthComp';
import useAuthStore from './service/auth.store';


const App = () => {

	const setUser = useAuthStore((state) => state.setUser);

	useEffect(() => {
		// check if chrome extension is installed (for dev only)
		if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
			
			// get user from extension storage
			chrome.storage.local.get(["user"], (result) => {
				if (chrome.runtime.lastError) {
					console.error("Error retrieving data:", chrome.runtime.lastError);
					// Handle the error gracefully, such as displaying a message to the user
					return;
				}
				const user  = result.user
				if (user && user !== 'undefined') setUser(result.user);
			});

			chrome.storage.onChanged.addListener((changes, namespace) => {
				for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
					console.log(
						`Storage key "${key}" in namespace "${namespace}" changed.`,
						`Old value was "${oldValue}", new value is "${newValue}".`
					);
				}
			});
		} else {
			// get user from web localstorage (for dev only)
			const user = localStorage.getItem("user");
			if (user && user !== 'undefined') setUser(JSON.parse(user));
		}
	}, []);



	return (
		<div className="bg-gray-700 w-80 min-h-96 mx-auto">

			<AuthComp />

		</div>
	)
}

export default App
