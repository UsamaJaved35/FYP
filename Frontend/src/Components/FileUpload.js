import React, { useState } from 'react';
import { MDBProgress, MDBProgressBar } from 'mdb-react-ui-kit';
import Tesseract from 'tesseract.js';
const FileUpload = () => {
    const [Image,setImage]=useState('');
    const [loading,IsLoading]=useState(false)
    const [text,setText]=useState('')   
    const [progress,setProgress]=useState(0)
    const handleSubmit=()=>{
        IsLoading(true);
        console.log(loading);
        Tesseract.recognize(
            Image,
            'eng',
            { logger: (m) =>{
                console.log(m);
                if(m.status === 'recognizing text') {
                    setProgress(parseInt(m.progress * 100));
                }
            }
            }
          ).then((result) => {
            console.log(result.data);
            setText(result.data.text);
            IsLoading(false);
          });
          console.log(text)
        //IsLoading(false);
    }
    return (
    <div>
    <div className="container" style={{ height: '100vh' }}>
      <div className="row h-50">
      <h1 className='text-center'>Image to text</h1>
        <div className="col-md-5 mx-auto d-flex flex-column justify-content-center">
        {!loading && !text &&
            <>
                <input
                type="file"
                onChange={(e) =>
                  setImage(URL.createObjectURL(e.target.files[0]))
                }
                className="form-control mb-2"
              />
             <input
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary mt-5"
                value="Convert"
              />
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
            <textarea
                className="form-control w-100 mt-5"
                rows="30"
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
    }
        </div>
    </div>
    </div>
    </div>
  )
}
export default FileUpload