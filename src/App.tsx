import React, { useState } from 'react';
import { getPostsData,insertPostData } from './APIReducers/PostsAPIReducer';
import { useQueryClient, useQuery, useMutation} from 'react-query';

function App() {
  const query = useQueryClient();
  const [formData,setFormData] = useState({
    title: "",
    body: ""
  })
 const [btnLabel,setBtnLabel] = useState("Add Post");
  const handleChanges = (event: any) => {
  setFormData({...formData,[event.target.name]:event.target.value})
  }

  const handleNewPost = async() => {
  await mutateAsync(formData);
  }

  const {mutateAsync} = useMutation({
    mutationFn: insertPostData,
    onError: async(error: any) => {
    console.log("error",error.message);
    },
    onSuccess: async(data: any) => {
      console.log("Data",data?.data);
      query.invalidateQueries({queryKey:['added']})
    }
  })

  const submitHandler = async(e: any) => {
    e.preventDefault();
  setBtnLabel("Adding Post...")
  await handleNewPost();
  setBtnLabel("Add Post");
  setFormData({
    title: "",
    body:""
  })
  }

  const {isLoading, data : posts, error, isError} = useQuery({
    queryFn : async() => await getPostsData(),
    refetchOnWindowFocus: false,
    queryKey: ["added"]
  })
  if(isLoading === true)
  {
    return <div>Loading...</div>
  }
  if(isError === true)
  {
    console.log("Error",error);
  }
  return (
    <div className='flex w-full h-full flex-col gap-7 p-4'>
    <div className='w-full h-full flex justify-center'>
    <span className='text-center text-red-500 font-bold text-2xl'>React Query VS Use Effect</span>
    </div>
    <div className='w-fit flex flex-col gap-4'>
      <div className='flex flex-col w-fit h-fit p-4 border-4 border-indigo-400 rounded-md justify-start'>
      <form onSubmit={(e) => submitHandler(e)} className='flex flex-col w-fit h-fit gap-5'>
        <label className='text-center text-indigo-400 font-extrabold'>Add Post Form</label>
        <div className='flex flex-col gap-1'>
          <label className='text-indigo-400 font-bold'>Enter Post Tile</label>
        <input value={formData.title} className='outline-1 outline-indigo-400 p-2 outline focus:outline-2 focus:outline-indigo-600' type='text' name='title' onChange={(e) => handleChanges(e)} required placeholder='Enter Title'/>
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-indigo-400 font-bold'>Write Post</label>
        <textarea name='body' className='outline-1 outline-indigo-400 p-2 outline focus:outline-2 focus:outline-indigo-600' cols={4} rows={5} autoFocus value={formData.body} maxLength={80} onChange={(e) => handleChanges(e)} placeholder='Enter Post Detail' required></textarea>
        </div>
        <div>
        <button type='submit' className='w-fit h-fit p-2 text-slate-100 bg-indigo-400 disabled:bg-indigo-200 disabled:pointer-events-none' disabled={btnLabel === "Adding Post..."}>{btnLabel}</button>
        </div>
        </form>
      </div>
    <div className='flex flex-col gap-4 mt-10'>
    <label className='text-2xl'>Posts</label>
    <div className='flex flex-col gap-5'>
    {posts?.data?.length> 0 && posts?.data?.map((post : {
      title: string;
      body: string;
    })=> {
      return(
        <div className='flex flex-col gap-2 p-2 w-[30%] bg-slate-300 rounded-md border-2 border-indigo-400 text-left'>
          <label className='text-lg p-1'>Title: {post?.title}</label>
          <p className='text-sm bg-indigo-300 p-1 text-left'>{post?.body}</p>
          </div>
      )
    })}
    </div>
    </div>
    </div>
    </div>
  );
}

export default App;
