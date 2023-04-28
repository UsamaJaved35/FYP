import React, { useState } from 'react';
import {io} from 'socket.io-client';
import { useEffect } from 'react';
import { MDBProgress, MDBProgressBar } from 'mdb-react-ui-kit';
let port=process.env.PORT || 4001
const socket = io(`http://localhost:${port}`);
const FileUpload = () => {
    const [File,setFile]=useState('');
    const [fileType,setfileType]=useState(true);
    const [loading,IsLoading]=useState(false)
    const [text,setText]=useState('')   
    const [success,setSuccess]=useState(true)
    const [progress,setProgress]=useState(0)
    useEffect(() => {
      socket.on('connect', () => {
        console.log('Connected to server');
      });
      socket.on('progress', (progress) => {
       // IsLoading(true)
        setProgress(parseInt(progress*100));
      });
       socket.on('text', (data) => {
         setText(data.text);
         IsLoading(false) });
      // socket.on('disconnect', () => {
      //   console.log('Disconnected from server');
      // });
      // return () => {
      //   socket.disconnect();
      // };
    }, []);

     const  handleSubmit= async()=>{
      setfileType(true)
      const formData = new FormData();
      const extension = File.name.split('.').pop().toLowerCase();
     // console.log(File.name.split('.')[1].toLowerCase())
      if(extension!=='pdf' && extension!=='jpg'&& extension!=='jpeg' &&
        extension!=='png'){
        setfileType(false)
       }
      else{
      formData.append('file', File);
      setProgress(0)
      IsLoading(true)
      let address=File.name.split('.')[1].toLowerCase()==='pdf'?`http://localhost:${port}/api/upload/pdf`:`http://localhost:${port}/api/upload`
      const response=await fetch(address,
      {
        method:'POST',
        body:formData
      });
      //then(response=>{
        let data= await response.json()
        console.log(data)
        console.log(data.message)
        if(data.message){
         // console.log(data.Id)
        setSuccess(true)
        setText(data.hash)
        IsLoading(false)
        }
        else{
          setSuccess(false)
        }
      }
    }
    return (
    <div>
    <div className="container" style={{ height: '100vh' }}>
      <div className="row h-50 pt-6">
      <h1 className='text-center pt-6'>E-Stamp Verification System</h1>
        <div className="col-md-5 mx-auto d-flex flex-column justify-content-center">
          {!success &&
        <div className="alert alert-danger" role="alert">
          There's some issue with the server. Please try again later.
        </div>
        }
          {!fileType &&
        <div className="alert alert-danger" role="alert">
          Unsupported format of file! Use:jpeg/jpg/png/pdf format
        </div>
        }
        {!loading && !text &&
            <>
             <h4 className='text-center'>Just Drop your E-Stamp File here!</h4>
                <input
                type="file"
                onChange={(e) =>
                  setFile(e.target.files[0])
                }
                className="form-control mb-2 mt-4"
              />
              {File &&
             <input
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary mt-5"
                value="CHECK"
              />
              }
              </>
            }
            {loading && !text &&
            <>
            <MDBProgress height='20'>
                <MDBProgressBar width={progress} value={progress} valuemin={0} valuemax={100}>
               {progress}%
                </MDBProgressBar>
            </MDBProgress>
            </>
          }
            { text && !loading &&
            <>
             <h4 className='text-center'>Below is the extracted text!</h4>
            <textarea
                className="form-control w-100 mt-5"
                rows="24"
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
              </>
    }
        </div>
    </div>
    </div>
    </div>
  )
}
export default FileUpload