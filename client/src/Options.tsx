import { useEffect } from 'react'

// Example for saving user settings
const Options = () => {

    useEffect(() => {

        const options = {
            debug: undefined,
        };
        const optionsForm = document.getElementById("optionsForm") as HTMLFormElement;

        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {

            // Immediately persist options changes
            optionsForm.debug.addEventListener("change", (event: { target: { checked: any; }; }) => {
                options.debug = event.target.checked;
                chrome.storage.sync.set({ options });
            });

            // Initialize the form with the user's option settings
            chrome.storage.sync.get("options").then((result) => {
                Object.assign(options, result.options);
                optionsForm.debug.checked = Boolean(options.debug);
            });

        }

    }, [])

    return (
        <form id="optionsForm">
            <label className='text-slate-200' htmlFor="debug">
                <input type="checkbox" name="debug" id="debug" />
                Enable debug mode
            </label>
        </form>
    )
}

export default Options