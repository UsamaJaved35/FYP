import React, { useState } from 'react';
import {io} from 'socket.io-client';
import { useEffect } from 'react';
import { MDBProgress, MDBProgressBar } from 'mdb-react-ui-kit';
const socket = io('http://localhost:4003');
const FileUpload = () => {
    const [Image,setImage]=useState('');
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
      const formData = new FormData();  
      formData.append('file', Image);
      setProgress(0)
      IsLoading(true)
      const response=await fetch('http://localhost:4003/api/upload',
      {
        method:'POST',
        body:formData
      });
      //then(response=>{
        let data= await response.json()
        console.log(data)
        console.log(data.message)
        if(data.message){
          console.log(true)
        setSuccess(true)
        setText(data.message)
        IsLoading(false)
        }
        else{
          setSuccess(false)
        }
      //}).catch(error=>{
        //console.log('catch')
      //});
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
        {!loading && !text &&
            <>
             <h4 className='text-center'>Just Drop your E-Stamp Image here!</h4>
                <input
                type="file"
                onChange={(e) =>
                  setImage(e.target.files[0])
                }
                className="form-control mb-2 mt-4"
              />
              {Image &&
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
              {/* <progress className="form-control" value={progress} max="100">
                {progress}%{' '}
              </progress>{' '}
              <p className="text-center py-0 my-0">Converting:- {progress} %</p> */}
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