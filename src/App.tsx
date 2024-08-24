import React, { useState } from 'react';
import { getPostsData,insertPostData } from './APIReducers/PostsAPIReducer';
import { useQueryClient, useQuery, useMutation} from 'react-query';

function App() {
  const [title,setTitle] = useState<string>("");
  const [body,setBody] = useState("");
 
  const query = useQueryClient();
  const handleNewPost = async() => {
    const payload = {
      title: title,
      body: body
    }
  await mutateAsync(payload);
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
      <div className='flex flex-col w-full justify-start gap-3'>
        <div className='flex flex-col gap-0.5'>
          <label>Enter Post Tile</label>
        <input value={title} type='text' name='Title' onChange={(e) => setTitle(e.target.value)} placeholder='Enter Title'/>
        </div>
        <div className='flex flex-col gap-0.5'>
          <label>Write Post</label>
        <textarea cols={4} rows={5} autoFocus value={body} maxLength={80} onChange={(e) => setBody(e.target.value)} placeholder='Enter Post Detail'></textarea>
        </div>
        <button type='button' className='w-fit h-fit p-2 text-slate-100 bg-indigo-400' onClick={()=> handleNewPost()} disabled={title?.length === 0 || body?.length === 0}>Add Post</button>
      </div>
    <div className='flex flex-col gap-4 mt-10'>
    <label className='text-2xl'>Posts</label>
    <div className='flex flex-col gap-5'>
    {posts?.data?.length> 0 && posts?.data?.map((post : {
      title: string;
      body: string;
    })=> {
      return(
        <div className='flex flex-col gap-2 p-2 w-[30%] bg-slate-300 rounded-md'>
          <label className='text-lg'>Title: {post?.title}</label>
          <p className='text-sm bg-emerald-300'>{post?.body}</p>
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
