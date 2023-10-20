//routes/userRouter.js

const express = require('express');
const threadController = require("../controller/threadController")

const router = express.Router();

router.get('/all',threadController.getThreads)
router.get('/thread/:id',threadController.getThread)
router.post('/postThread',threadController.createThread)
router.put('/updateThread/:threadId/:userId',threadController.updateThread)
router.delete('/deleteThread/:threadId',threadController.deleteThread)
router.post('/threadLike/:threadId',threadController.threadLike)

module.exports = {
	router
}