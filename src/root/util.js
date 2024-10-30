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



