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
    const threadUserId = getThread[0].user_id
    if(userId !== threadUserId){
        const err = new Error("삭제할 권한이 없다.")
        err.statusCode = 403;
        throw err
    }
    const thread = await threadDao.deleteThread(userId,threadId)
    return thread
}
// 쓰레드 좋아요
const threadLikes = async(userId,threadId) =>{
    const getThread = await threadDao.existingPost(threadId)
    if(getThread.length === 0){
        const err = new Error('없는 쓰레드')
        err.statusCode = 400
        console.log('1',err)
        throw err;
    }
    const getThreadLike = await threadDao.getThreadLike(userId,threadId)
    if(getThreadLike.length === 0){
        insertLike = await threadDao.insertThreadLike(userId,threadId)
        return insertLike
    }else{
        deleteLike = await threadDao.deleteThreadLike(userId,threadId)
        console.log(getThreadLike.length)
        return deleteLike
    }
}


    module.exports = {
        createThread, getThread, getThreads,updateThread,deleteThread,threadLikes
    }