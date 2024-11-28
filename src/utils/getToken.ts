/**
 * Get the value of a specific cookie
 * @param {string} name - The name of the cookie to retrieve
 * @returns {string | null} - The cookie value or null if not found
 */
const getCookie = (name:string='refreshToken'): string | null => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((row) => row.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };
  
  // Example: Retrieve the token cookie
export {getCookie};
  