const { contractInstance } = require('./blockchain');
const compareHash= async(id,hash)=>
{
    try {
        const hash1 = await contractInstance.getHash(id);
        return hash1==hash;
      } catch (error) {
        return false;
      }
}
module.exports=compareHash;