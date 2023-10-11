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
const thread = async(req,res) =>{
    const {user_id, content} = req.body
    
    await myDataSource.query(`
    INSERT INTO threads(
        user_id,
        content
        ) VALUES ('${user_id}','${content}')`)
        res.status(200).json({message: "postCreated"})
    }


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
const getThread = async(req,res) =>{
    const userId = req.params.userId
    console.log("aa",userId)
    const threads = await myDataSource.query(`
    SELECT * FROM threads WHERE user_id = ?
    `,[userId])
    res.status(200).json(threads)
}

app.post("/users/sign-up", signUp)
app.post("/threads/thread",thread)
app.get("/threads",getThreads)
app.get("/thread/:userId",getThread)
const server = http.createServer(app)

myDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
server.listen(8000,() =>{
    console.log('서버 시작')
})