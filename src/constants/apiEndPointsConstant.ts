// Base URL (Environment-specific)
import dotenv from 'dotenv';


dotenv.config();
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log(BASE_URL)

// Endpoints grouped by feature/module
const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/users/login`,
    SIGNUP: `${BASE_URL}/users/register`,
  },
  USER: {
    GET_ALL_DOCUMENTS_CREATED:`${BASE_URL}/users/documents`,
  },
  DOCUMENT: {
    CREATE: `${BASE_URL}/document/create`,
    GET_LAST_TEN_VERSIONS: (documentId:string) => `${BASE_URL}/document/${documentId}/versions`,
    GET_DETAIL:(documentId:string)=> `${BASE_URL}/document/${documentId}`,
    ADD_PERMISSIONS:(documentId:string)=>`${BASE_URL}/document/${documentId}/add-permission`,
    UPDATE_DOCUMENT:(documentId:string)=>`${BASE_URL}/document/${documentId}/update`,
    CHANGE_VISIBILITY:(documentId:string)=>`${BASE_URL}/document/${documentId}/change-visibility`
  },
};

export { API_ENDPOINTS};
