// import axios from 'axios';
// import { useState } from 'react';

// export default function AuthUser(){



//     const getToken = () =>{
//         const tokenString = sessionStorage.getItem('token');
//         const userToken = JSON.parse(tokenString);
//         return userToken;
//     }

//     const [token,setToken] = useState(getToken());

//     const saveToken = (token) =>{
//         sessionStorage.setItem('token',JSON.stringify(token));
//         setToken(token);
//     }

//     const logout = () => {
//         sessionStorage.clear();
//         http.get('/logout').then((res)=>{
//             toast.success(`${res.data.message}`, StyleToast);
//         }).catch(error=>
//         {
//             toast.error(`${error.message}`, StyleToast);
//         }
//     )
//     }
//     const http = axios.create({
//         baseURL:'http://localhost:8000',
//         headers:{
//             "Content-type" : "application/json",
//             "Authorization" : `Bearer ${token}`
//         }
//     });
//     return {
//         setToken:saveToken,
//         token,
//         getToken,
//         http,
//         logout
//     }
// }



import axios from 'axios'

// Create axios instance with the correct configuration
export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
});