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
const userDao = require('../models/userDao')

const signUp = async (nickname, email, password) => {
    // password validation using REGEX
    const pwValidation = new RegExp(
      '^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,20})'
    );
    if (!pwValidation.test(password)) {
      const err = new Error('PASSWORD_IS_NOT_VALID');
      err.statusCode = 409;
      throw err;
    }
      const createUser = await userDao.signUp(
          nickname,
          email,
          password,
        );
        return createUser;
      };


module.exports = {
    signUp,checkUser
}