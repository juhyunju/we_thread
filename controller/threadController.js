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
        const token = req.headers.token
        jwt.verify(token,'key')
        await threadService.createThread(userId,content)
        res.status(200).json({message: "threadCreated"})
    }catch(err){
        res.status(404).json({message: "error"})
    }
}

const updateThread = async(req,res) => {
    const {content} = req.body
    const threadId = req.params.threadId
    const userId = Number(req.params.userId)
    const token = req.headers.token
    // console.log("이것이토큰이다",token)
    const decodedToken = jwt.verify(token,'key')
    const loggedInUserId = await decodedToken.userId
    try{
        if(token){
            if(userId === loggedInUserId){
                await threadService.updateThread(userId,content,threadId)
                // console.log(threadId,userId,content)
                res.status(200).json({message: "threadUpdated"})
            } else{
                // console.log("1",userId,"2",loggedInUserId,'3',threadId)
                res.status(403).json({ message: "Permission denied" })
            }   
        }else{
            res.status(401).json(({message: "fuck"}))
        }
    }catch(err){
        // console.log(threadId,userId,content)
        res.status(404).json({message: "error"})
    }
}
const deleteThread = async(req,res) => {
    const userId = Number(req.params.userId)
    const threadId = req.params.threadId
    const token = req.headers.token
    const decodedToken = jwt.verify(token,'key')
    const loggedInUserId = await decodedToken.userId
    try{
        if(token){
            if(userId === loggedInUserId ){
                await threadService.deleteThread(userId,threadId)
                res.status(200).json({ message: 'Thread deleted' });
            }else{
                console.log(userId,loggedInUserId)
                res.status(403).json({ message: "Permission denied" })
            }
        }
    }catch(err){
        res.status(404).json({message: "error"})
    }
}
module.exports = {
    getThreads,getThread,createThread,updateThread,deleteThread
}