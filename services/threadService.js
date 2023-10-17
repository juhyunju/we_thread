const {checkUser} = require('./userService')
const threadDao = require('../models/threadDao') 
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
const updateThread = async(userId,threadId,content) => {
    const thread = await threadDao.updateThread(userId,threadId,content)
    return thread
}

// 쓰레드 삭제
const deleteThread = async(id,threadId) => {
    const thread = await threadDao.deleteThread(id,threadId)
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