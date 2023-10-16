const { myDataSource } = require("./data")

const signUp = async (nickname,email,password) => {
    try{
        return await myDataSource.query(`
        INSERT INTO users(nickname,email,password) VALUES('${nickname}','${email}','${password}')
        `)
    } catch(err){
        const error = new Error('INVALID_DATA_INPUT')
        error.statusCode = 500
        throw error
    }
}
module.exports = {
    signUp
}