const threadDao = require('../models/threadDao') 
const userDao = require('../models/userDao')
const { myDataSource } = require('../models/data')

//전체 쓰레드 조회
const getThreads = async () => {
    const threadAll = await threadDao.getThreads()
    return threadAll
}

// 유저 쓰레드 조회
const getThread = async(id) => {
    const thread = await threadDao.getThread(id)

    return thread
}
// 쓰레드 생성
const createThread = async(userId,content) => {
    const thread = await threadDao.createThread(userId,content)
    return thread
}

// 쓰레드 수정
const updateThread = async(userId,content,threadId) => {
    const getThread = await threadDao.existingPost(threadId)
    if(getThread.length === 0){
        const err = new Error('없는 쓰레드')
        err.statusCode = 400
        throw err;
    }
    const thread = await threadDao.updateThread(userId,content,threadId)
    return thread
}

// 쓰레드 삭제
const deleteThread = async(userId,threadId) => {
    const getThread = await threadDao.existingPost(threadId)
    if(getThread.length === 0){
        const err = new Error('없는 쓰레드')
        err.statusCode = 400
        throw err;
    }
    const thread = await threadDao.deleteThread(userId,threadId)
    return thread
}
// 쓰레드 좋아요
const threadLike = async (req,res) => {
    const { user_id, thread_id } = req.body
        await myDataSource.query(`
        INSERT INTO thread_likes (user_id,thread_id) VALUES('${user_id}','${thread_id}')
        `)
        res.status(200).json({message: "likeCreated"})
    }

    module.exports = {
        createThread, getThread, getThreads,updateThread,deleteThread,threadLike
    }