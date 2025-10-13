import { isObject, message } from '#src/utils'

/**
 * Handles error responses
 *
 * @param response - The response object
 * @returns The response object
 */
export async function handleErrorResponse(response: Response) {
  try {
    // Parse the response body as JSON
    const data = await response.json()

    // Check if the parsed data is an object
    if (isObject(data)) {
      // Cast the parsed data to an object that may contain error information
      const json = data as { errorMsg?: string; message?: string }

      // If the parsed data contains 'errorMsg' or 'message', display that as the error
      // Otherwise, display the response's status text as the error message
      message.error(json.errorMsg || json.message || response.statusText)
    } else {
      // If the parsed data is not an object, display the response's status text as the error message
      message.error(response.statusText)
    }
  } catch (e) {
    // If parsing the JSON fails, log the error to the console
    console.error('Error parsing JSON:', e)

    // Display the response's status text as the error message
    message.error(response.statusText)
  }

  // Return the original response object
  return response
}
