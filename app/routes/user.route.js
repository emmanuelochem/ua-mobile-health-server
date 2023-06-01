const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');


router.route('/students')
        .get(userController.getAllStudents)
router.route('/doctors')
        .get(userController.getAllDoctors)
router.route('/profile/:id')
        .get(userController.getUser)
router.route('/data')
        .get(userController.getUserData)
router.route('/profile/update')
        .patch(userController.updateUser)
router.route('/profile/update/picture')
        .post(userController.updateProfile)
router.route('/profile/delete')
        .delete(userController.deleteUser)

module.exports = router;