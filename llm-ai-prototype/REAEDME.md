Clone the entire repository and enter it in VSCode, enter into prototype's directory and click the Go Live button at the bottom of VSCode. 

For the LLM AI Prototype specifically, testing it requires an API Key that can be found in the google doc. 

In order to run it, you must create a config.js file in the same directory as the index.html file, and paste this code in it:

const CONFIG = { MISTRAL_API_KEY: (API KEY FOUND IN GOOGLE DOC SUBMISSION) };

Also, sometimes there may be a 429 error for this LLM part because we are using a free LLM API, so please click the Ask button again (multiple times if needed until the LLM works) if you encounter a 429 error.


AI Attribution: We used AI to aid us with debugging syntax issues.
