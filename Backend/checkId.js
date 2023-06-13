const { contractInstance } = require('./blockchain');
const checkId= async(id,hash)=>
{
    try{
        const exists=await contractInstance.IdExists(id);
        return exists;
    }
    catch(error)
    {
        return false;
    }
    
}
module.exports=checkId;