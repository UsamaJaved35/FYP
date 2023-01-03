import React, { useState } from 'react'
import Tesseract from 'tesseract.js';
const TextExtraction = (props) => {
  const [text,setText]=useState('')
  console.log({props})   
Tesseract.recognize(
  props.image,
  'eng',
  { logger: m => console.log(m) }
).then((result) => {
  console.log(result.data);
  setText(result.data.text);
});
  return (
    <div>
        <textarea
                className="form-control w-100 mt-5"
                rows="30"
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
    </div>
  )
}
export default TextExtraction