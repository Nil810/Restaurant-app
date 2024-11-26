//  import axios from "axios";

// let domain = window.location.href.indexOf('localhost') > 0 ?'https://menu.merchantnations.com':window.location.origin;

//  export  function getParameterByName(e,t=window.location.href){
//     e=e.replace(/[\[\]]/g,"\\$&");var n=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)").exec(t);
//   return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null;
//   };

// const p = new Promise((response, rej) => {
//   let config =localStorage.getItem("configs") ?JSON.parse(localStorage.getItem("configs")):null;
// 	if(!config){
//  	axios.get(`https://menuapi.${domain.split(".")[1]}.com/api/configs`).then(res=>{
//         console.log(res.data[0]);
//         let data = res&&res.data.length?JSON.stringify(res.data[0]):null;
//         localStorage.setItem("configs",data);
//         config = JSON.parse(data);
//         response(config);
//     });
// }else{
// 	response(config);
// }
// });

// //getConfigs().then((res)=> console.log(res));


// export default await p;


// export  const baseURL = 'https://menuapi.merchantnations.com';
// export const authapi ="https://authapi.merchantnations.com";
// export const  authUrl="https://auth.merchantnations.com";


// // "baseURL": "https://menuapi.merchantnations.com",
// // "authapi": "https://authapi.merchantnations.com",
// // "authUrl": "https://auth.merchantnations.com",
// // "cmsUrl": "https://cms.merchantnations.com",
// // "createdDate": "2023-11-21T07:13:26.122Z",
// // "id": "655c3302fb557f6deb6d56e2"

import {initializeApp} from "firebase/app";
import {getDatabase} from "firebase/database";

const fbConfig ={
  apiKey: "AIzaSyDBu9AN-kYx90i51PGp1gp4rziNXyLrt1Q",
  authDomain: "menulive-4ac00.firebaseapp.com",
  databaseURL: "https://menulive-4ac00-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "menulive-4ac00",
  storageBucket: "menulive-4ac00.firebasestorage.app",
  messagingSenderId: "448344052309",
  appId: "1:448344052309:web:ae0145b857f5a7af5e7adc"
};

const appfb = initializeApp(fbConfig);
 
export const db = getDatabase(appfb)
