const {checkUser} = require('./userService')
const { myDataSource } = require('../models/data')

// 쓰레드 생성
const thread = async(req,res) =>{
    const {user_id, content} = req.body
    
    await myDataSource.query(`
    INSERT INTO threads(
        user_id,
        content
        ) VALUES ('${user_id}','${content}')`)
        res.status(200).json({message: "postCreated"})
    }

// 전체 쓰레드 조회
const getThreads = async(req,res) =>{
    const threads = await myDataSource.query(`
    SELECT * FROM threads JOIN users ON threads.user_id = users.id
    `)
    res.status(200).json({threads})
} 

// 유저 쓰레드 조회
const getThread = async(req,res) =>{
    const userId = req.params.userId
    const threads = await myDataSource.query(`
    SELECT * FROM threads JOIN users ON threads.user_id = users.id WHERE user_id = ?
    `,[userId])
    res.status(200).json(threads)
}
// 쓰레드 수정
const updateThread = async(req,res) =>{
    const {content,user_id,thread_id} = req.body
    const user = await checkUser(user_id)
    console.log(user)
    if(user == thread_id){
        await myDataSource.query(`
        UPDATE threads SET content = '${content}', updated_at = NOW() WHERE id = '${thread_id}' AND  user_id = '${user_id}'
        `)
        res.status(200).json({message: "postUpdated"})
    }else{
        res.status(404).json({error: "User not found"})
    }
}
// 쓰레드 삭제
const deleteThread = async (req,res) =>{
    const {user_id, thread_id} = req.body
    const user = await checkUser(user_id)
    if(user == thread_id){
        await myDataSource.query(`
        DELETE FROM threads WHERE user_id = '${user_id}' AND id = '${thread_id}'
        `)
        res.status(200).json({message: "postingDeleted"})
    }
    else {
        res.status(404).json({error: "User not found"})
    }
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
        thread, getThread, getThreads,updateThread,deleteThread,threadLike
    }