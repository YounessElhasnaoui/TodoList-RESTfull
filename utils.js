const verifyTask = (task,state)=>{
    if(!task)
        return {status:false, msg:"task is required"}
   
    if(task.length<=4)
        return  {status:false, msg:"task must contains at least 4 caracters"}

    if(state != "pending" && state != "completed")
        return  {status:false, msg:"task must be a valid state"}

    return {status:true, msg:"state is "+state}
}
const middlewareVerification  = (req,res,next)=>{

    let {task,state} = req.body
    let {status,msg} = verifyTask(task,state)
    if(status)
        return next()
    res.status(400).json({status:"error",msg: msg})
}
module.exports={
    verifyTask,
    middlewareVerification
}