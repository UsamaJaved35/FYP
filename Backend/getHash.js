const { contractInstance } = require('./blockchain');
const getHash= async(id)=>
{
    try {
        const hash = await contractInstance.getHash(id);
        return {hash:hash,status:true};
      } catch (error) {
        console.error(error);
        return {status:false};
      }
}
module.exports=getHash;