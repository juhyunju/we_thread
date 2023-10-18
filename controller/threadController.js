const jwt = require('jsonwebtoken')
const threadService = require('../services/threadService')
const getThreads = async (req,res) => {
    try{
        const threads = await threadService.getThreads()
        console.log(threads)
        res.status(200).json({threads}) 
    }catch(err){
        res.status(500).json({message: "error"})
    }
}

const getThread = async (req,res) => {
    const id = req.params.id
    try{
        const thread = await threadService.getThread(id)
        res.status(200).json({thread})
    }catch(err){
        res.status(404).json({message: "error"})
    }
}

const createThread = async(req,res) => {
    const {userId,content} = req.body
    try{
        await threadService.createThread(userId,content)
        res.status(200).json({message: "threadCreated"})

    }catch(err){
        res.status(404).json({message: "error"})
    }
}

const updateThread = async(req,res) => {
    const {userId,threadId,content} = req.body
    const token = req.headers.token
    // console.log("이것이토큰이다",token)
    const decodedToken = jwt.verify(token,'key')
    const loggedInUserId = decodedToken.userId
    console.log('userId :',typeof userId, 'loggedInUserId:',typeof loggedInUserId)
    try{
        if(token){
            if(userId === loggedInUserId){
                await threadService.updateThread(userId,threadId,content)
                return res.status(200).json({message: "threadUpdated"})
            } else{
                return res.status(403).json({ message: "Permission denied" })
            }   
        }else{
            res.status(401).json({message: "Unauthorized"})
        }
    }catch(err){
        res.status(404).json({message: "error"})
    }
}
const deleteThread = async(req,res) => {
    const id = req.params.id
    const threadId = req.params.threadId
    // const checkUser = await userService.checkUser(id)

    // if(checkUser !== id){
    //     res.status(400).json({message: "User not found"})
    // }

    try{
        await threadService.deleteThread(id,threadId)
        res.status(200).json({ message: 'Thread deleted' });
    }catch(err){
        res.status(404).json({message: "error"})
    }
}
module.exports = {
    getThreads,getThread,createThread,updateThread,deleteThread
}