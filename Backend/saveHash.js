//BLOCKCHAIN CONFIGURATION
const { contractInstance } = require('./blockchain');
const saveHash= async(id,hash)=>
{
    try {
        const tx = await contractInstance.saveHash(id, hash);
        await tx.wait();
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
}
module.exports=saveHash;