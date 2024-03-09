import axios, { AxiosResponse, AxiosError } from 'axios';

// Interface to define the structure of the API response
interface APIResponse {
	data: any;
	status: number;
}

/**
 * Function to make a GET request to the specified endpoint
 * @param {string} BASE_URL - The base URL of the API
 * @param {string} queryString - The query string parameters
 * @returns {Promise<APIResponse>} - A promise resolving to the API response
 */
export const getRequest = async (
	BASE_URL: string,
	queryString: string = ''
): Promise<APIResponse> => {
	try {
		// Making the GET request using axios
		const response: AxiosResponse = await axios.get(
			`${BASE_URL}${queryString}`
		);
		// Returning the response with standardized structure
		return { data: response.data, status: response.status };
	} catch (error) {
		console.log('error', error);
		// Handling errors
		if (axios.isAxiosError(error)) {
			const axiosError: AxiosError = error;
			// If the error is related to the request being made
			if (axiosError.response) {
				// Return response data and status from the error response
				return {
					data: axiosError.response.data,
					status: axiosError.response.status,
				};
			} else if (axiosError.request) {
				// If no response was received from the server
				throw new Error('No response received from the server.');
			} else {
				// If the request failed to be sent
				throw new Error('Request failed to be sent.');
			}
		} else {
			// If an unexpected error occurred
			throw new Error('An unexpected error occurred.');
		}
	}
};
