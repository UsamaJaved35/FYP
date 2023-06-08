import React, { useState } from 'react';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { MDBProgress, MDBProgressBar } from 'mdb-react-ui-kit';
let port = process.env.PORT || 4001
const socket = io(`http://localhost:${port}`);
const FileUpload = () => {
  const [File, setFile] = useState('');
  const [fileType, setfileType] = useState(true);
  const [loading, IsLoading] = useState(false)
  const [text, setText] = useState('')
  const [success, setSuccess] = useState(true)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });
    socket.on('progress', (progress) => {
      // IsLoading(true)
      setProgress(parseInt(progress * 100));
    });
    socket.on('text', (data) => {
      setText(data.text);
      IsLoading(false)
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setfileType(true)
    const formData = new FormData();
    const extension = File.name.split('.').pop().toLowerCase();
    // console.log(File.name.split('.')[1].toLowerCase())
    if (extension !== 'pdf' && extension !== 'jpg' && extension !== 'jpeg' &&
      extension !== 'png') {
      setfileType(false)
    }
    else {
      formData.append('file', File);
      setProgress(0)
      IsLoading(true)
      let address = File.name.split('.')[1].toLowerCase() === 'pdf' ? `http://localhost:${port}/api/upload/pdf` : `http://localhost:${port}/api/upload`
      const response = await fetch(address,
        {
          method: 'POST',
          body: formData
        });
      //then(response=>{
      let data = await response.json();
      setStatus(data.status);
      console.log(data.status)
      console.log(data.Id)
      if (data.success) {
        // console.log(data.Id)
        setSuccess(true)
        setText(data.Id)
        IsLoading(false)
      }
      else {
        setSuccess(false)
        setFile('')
      }
    }
  }
  return (
    <div>
        <section id="hero" style={{ marginTop: 72 }} className="d-flex align-items-center">
          <div className="container">
            <div className="row gy-4">
              <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center">
                <h1>E-Stamp Verification System</h1>
                <h3>Drop your E-stamps here!</h3>
                <h3>Acceptable in <b>PDF PNG JPG JPEG </b></h3>
                <div>
                  <div className="upload-container" style={{ marginTop: 10 }}>
                    {!success && !File &&
                      <div className="alert alert-danger" role="alert">
                        There's some issue with the server. Please try again later.
                        You may try a clear picture of the stamp.
                      </div>
                    }
                    {!fileType &&
                      <div className="alert alert-danger" role="alert">
                        Unsupported format of file! Use:jpeg/jpg/png/pdf format
                      </div>
                    }
                    {!loading && !text &&
                    <input className="upload-btn scrollto"
                      type="file"
                      onChange={(e) =>
                        setFile(e.target.files[0])
                      }
                      id='file-input' />}
                    {File && !loading && !text &&
                      <input
                        type="button"
                        onClick={handleSubmit}
                        className="upload-btn mt-5 ms-2"
                        value="CHECK"
                      />}
                  </div>
                </div>
                {loading && !text &&
                      <>
                        <MDBProgress height='20'>
                          <MDBProgressBar width={progress} value={progress} valuemin={0} valuemax={100}>
                           <span style={{backgroundColor:'green'}} > {progress}% <b>Completed</b> </span>
                          </MDBProgressBar>
                        </MDBProgress>
                      </>
                    }
                    {text && !loading &&
                      <>
                        <h4 className='text-center'>Below are the details!</h4>
                        <textarea
                          className="form-control w-100 mt-5"
                          rows="4"
                          value={`E-STAMP ID: ${text}\nSTATUS: ${status ? 'VERIFIED' : 'NOT VERIFIED'}`}
                          onChange={(e) => setText(e.target.value)}
                        >
                        </textarea>
                      </>
                    }
              </div>
              <div className="col-lg-6 order-1 order-lg-2 hero-img">
                <img src="assets/img/hero-img.svg" className="img-fluid animated" alt="" />
              </div>
            </div>
          </div>
        </section>
    </div>
  )
}
export default FileUpload