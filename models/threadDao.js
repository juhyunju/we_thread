const { myDataSource } = require("./data")

// 전체 쓰레드 조회
const getThreads = async() =>{
    try{
        const threads = await myDataSource.query(`
        SELECT * FROM threads JOIN users ON threads.user_id = users.id
        `)
        
    } catch(err){
        const error = new Error('No data')
        error.status.code = 404
        throw error
    }
}

// 유저별 쓰레드 조회
const getThread = async (id) =>{
    try{
        return await myDataSource.query(`
        SELECT * FROM threads JOIN users ON threads.user_id = users.id WHERE user_id = ?
        `,[id])
    }catch(err){
        const error = new Error('NOPE!')
        error.status.code = 404
        throw error
    }
}
const createThread = async(userId,content) =>{
    try{
        return await myDataSource.query(`
        INSERT INTO threads(user_id,content) VALUES ('${userId}','${content}')
        `)
    }catch(err){
        const error = new Error('NOPE!')
        error.status.code = 404
        throw error
    }
}
const updateThread = async(userId,threadId,content) => {
    try{
        return await myDataSource.query(`
        UPDATE threads SET content = '${content}', updated_at = NOW() WHERE id = '${threadId}' AND  user_id = '${userId}'
        `)
    }catch(err){
        const error = new Error("NOPE!")
        error.status.code = 404
        throw error
    }
}
const deleteThread = async(id,threadId) => {
    try{
        return await myDataSource.query(`
        DELETE FROM threads WHERE user_id = ? AND id = '${threadId}'
        `,[id]) 
    }catch(err){
        const error = new Error("NOPE")
        error.status.code = 404
        throw error
    }
}

module.exports = {
    getThreads,getThread,createThread,updateThread,deleteThread
}