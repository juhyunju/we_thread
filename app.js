const http = require('http')
const express = require('express')

const app = express()
app.use(express.json())
const dotenv = require("dotenv")
dotenv.config()

const {DataSource} = require('typeorm')
const myDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
})

app.get('/',(req,res) => {
    res.status(200).json({
        message: "hello"
    })
})
// 유저 체크
const checkUser = async (user_id) =>{
    const result = await myDataSource.query(`
    SELECT *
        FROM users u
        LEFT JOIN threads t ON u.id = t.user_id
        WHERE u.id = ?
    `,[user_id])
    if(result.length !==null ){
        console.log("result2222",result)
        return result[0].id
    }else {
        return false
    }
}
// 회원가입
const signUp = async(req,res) =>{
    const {nickname, email, password} = req.body
    await myDataSource.query(`
    INSERT INTO users(
        nickname,email,password
    ) VALUES(
        '${nickname}','${email}','${password}'
    )
    `)
    res.status(201).json({message: "userCreated"})
}
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
    SELECT * FROM threads
    `)
    res.status(200).json(threads)
} 
// app.get('/threads',async(req,res) =>{
//     const threads = await myDataSource.query(`
//     SELECT * FROM threads
//     `)
//     console.log(threads)
//     res.status(200).json([threads])
// })

// 유저 쓰레드 조회
const getThread = async(req,res) =>{
    const userId = req.params.userId

    const threads = await myDataSource.query(`
    SELECT * FROM threads WHERE user_id = ?
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
    console.log("req 하는 threadId",typeof(thread_id))
    console.log("userId에 있는 thread ID",typeof(user))
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

app.post("/users/sign-up", signUp)
app.post("/threads/thread",thread)
app.get("/threads",getThreads)
app.get("/thread/:userId",getThread)
app.put("/thread/update",updateThread)
app.delete("/thread/delete",deleteThread)
app.post("/thread/like",threadLike)
const server = http.createServer(app)

myDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
server.listen(8000,() =>{
    console.log('서버 시작')
})