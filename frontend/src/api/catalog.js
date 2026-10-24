import {apiRequest} from './client';
export const getProducts=()=>apiRequest('/products');
export const getBlogs=()=>apiRequest('/blogs');
export const getCases=()=>apiRequest('/case-studies');
export const getBranches=()=>apiRequest('/branches');
export const getDoctors=()=>apiRequest('/doctors');
export const sendContact=(data)=>apiRequest('/contact',{method:'POST',body:data});
