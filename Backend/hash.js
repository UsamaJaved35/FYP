const crypto=require('crypto');

const hashGenerator=(text)=>
{
    let hash=crypto.createHash('sha256').update(text).digest('hex');
    return hash;
}
module.exports=hashGenerator;