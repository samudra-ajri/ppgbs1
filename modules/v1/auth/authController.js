const asyncHandler = require('express-async-handler')
const authService = require('./authService')
const eventConstant = require('../../../constants/eventConstant')
const { logger } = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')

const authController = {}

// @desc    register
// @route   POST /auths/register
// @access  Public
authController.register = asyncHandler(async (req, res) => {
    req.event = eventConstant.auth.register.event
    await authService.createUser(req.body)
    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    login
// @route   POST /auths/login
// @access  Public
authController.login = asyncHandler(async (req, res) => {
    req.event = eventConstant.auth.login.event
    const data = await authService.getUser(req.body)
    res.json({ data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    my profile
// @route   POST /auths/me
// @access  Protect
authController.me = asyncHandler(async (req, res) => {
    req.event = eventConstant.auth.me.event
    const payload = {
        userId: req.auth.data.id,
        positionId: req.auth.data.position.positionId
    }
    const data = await authService.getUserProfile(payload)
    res.json({ data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    forgot password
// @route   PUT /auths/forgot-password
// @access  Public
authController.forgotPassword = asyncHandler(async (req, res) => {
    req.event = eventConstant.auth.forgotPassword.event
    await authService.forgotPassword(req.body)
    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    reset user password
// @route   PUT /auths/reset-password/:token
// @access  Protect, Admin
authController.resetPassword = asyncHandler(async (req, res) => {
    req.event = eventConstant.auth.resetPassword.event
    const data = {
        token: req.params.token,
        tempPassword: req.body.tempPassword,
        updatedBy: req.auth.data.id
    }
    await authService.resetPasswordUser(data)
    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    update user password
// @route   POST /auths/update-password
// @access  Protect
authController.updatePassword = asyncHandler(async (req, res) => {
    req.event = eventConstant.auth.updatePassword.event
    const { newPassword, confirmNewPassword } = req.body
    const data = {
        userId: req.auth.data.id,
        newPassword,
        confirmNewPassword,
    }
    await authService.updatePassword(data)
    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

module.exports = authController