import React from "react";
import axios from "axios";



const getPostsData = async() => {
    const getPostsURL = `https://moeexposts.netlify.app/.netlify/functions/api/Getposts`;
    try{
   const resp =  await axios.get(getPostsURL).then(response => {
    if(response.status === 200)
    {
        return {
            data: response?.data
        }
    }
   })
   return resp;
    }
    catch(error : any)
    {
        throw new Error(error?.message);
    }
}

const insertPostData = async(payload: {
    title: string;
    body:string;
}) => {
    const addPostsURL = `https://moeexposts.netlify.app/.netlify/functions/api/Addpost`;
    try{
   const resp =  await axios.post(addPostsURL,payload).then(response => {
    if(response.status === 200)
    {
        return {
            data: response?.data
        }
    }
   })
   return resp;
    }
    catch(error : any)
    {
        throw new Error(error?.message);
    }
}


export {getPostsData, insertPostData};