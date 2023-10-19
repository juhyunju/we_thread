const { myDataSource } = require("./data")
const bcrypt = require('bcrypt')

const signUp = async (nickname,email,password) => {
    try{
        const profileImage = `https://raw.githubusercontent.com/5yoonl/gitgithub/main/wecode_symbol_b%402x.png`
        const hashedPassword = await bcrypt.hash(password,10)
        console.log(hashedPassword)
        return await myDataSource.query(`
        INSERT INTO users(nickname,email,password,profile_image) VALUES('${nickname}','${email}','${hashedPassword}','${profileImage}')
        `)
    } catch(err){
        const error = new Error('INVALID_DATA_INPUT')
        error.statusCode = 500
        throw error
    }
}
const login = async (email) => {
    try{
        const result = await myDataSource.query(`
        SELECT * FROM users WHERE email = '${email}'
        `)
        return result[0]
    }catch(err){
        throw error
    }
}
const existingUser = async (userId) => {
    try{
        const result = await myDataSource.query(`
        SELECT * FROM users WHERE id = '${userId}'
        `)
        return result
    }catch(err){
        throw(error)
    }
}
module.exports = {
    signUp,login,existingUser
}