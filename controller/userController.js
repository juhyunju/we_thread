const userService = require('../services/userService');

const signUp = async (req, res) => {
  try {
    const { nickname, email, password} = req.body;

    if ( !nickname || !email || !password) {
      return res.status(400).json({ message: 'KEY_ERROR' });
    }
    await userService.signUp( nickname, email, password );
    console.log(nickname,email,password)
    return res.status(201).json({
      message: 'SIGNUP_SUCCESS',
    });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = {
	signUp
}