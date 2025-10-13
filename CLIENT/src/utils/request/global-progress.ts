import { useGlobalStore } from '#src/store'

// Define a global variable to track how many requests are currently in progress
let requestCount = 0

export const globalProgress = {
  /**
   * Start a request
   *
   * If the request count is 0, show the global loading spinner
   * and then increment the request count by 1.
   */
  start() {
    if (requestCount === 0) {
      // Show the global loading spinner
      useGlobalStore.getState().openGlobalSpin()
    }
    // Increment the request count
    requestCount++
  },

  /**
   * Callback after a request completes
   *
   * @description Decrease the request count by 1 (ensuring it never goes below 0);
   *              If the count reaches 0, hide the global loading spinner.
   */
  done() {
    // Decrease the request count, ensuring it doesn't go below 0
    requestCount = Math.max(requestCount - 1, 0)
    if (requestCount === 0) {
      // Hide the global loading spinner
      useGlobalStore.getState().closeGlobalSpin()
    }
  },

  /**
   * Forcefully finish all requests
   *
   * Directly set the request count to 0 and hide the global loading spinner.
   */
  forceFinish() {
    // Reset the request count to 0
    requestCount = 0
    // Hide the global loading spinner
    useGlobalStore.getState().closeGlobalSpin()
  }
}
