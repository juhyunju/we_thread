const { myDataSource } = require('../models/data')

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
    // await data()

    await myDataSource.query(`
    INSERT INTO users(
        nickname,email,password
    ) VALUES(
        '${nickname}','${email}','${password}'
    )
    `)
    res.status(201).json({message: "userCreated"})
}
module.exports = {
    signUp,checkUser
}