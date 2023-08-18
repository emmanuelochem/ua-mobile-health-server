const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');


router.route('/students')
        .get(userController.getAllStudents)
router.route('/doctors')
        .get(userController.getAllDoctors)

router.route('/data')
        .get(userController.getUserData)

router.route('/profile/:id')
        .get(userController.getUser)
        
router.route('/profile/update')
        .patch(userController.updateUser)
router.route('/profile/update/picture')
        .post(userController.updateProfile)
router.route('/profile/delete')
        .delete(userController.deleteUser)

router.route('/likeDislike/:id')
        .put(userController.likeUnlike)

router.route('/review/:id')
        .get(userController.getReview)
router.route('/review')
        .put(userController.createReview)
router.route('/review/:id')
        .delete(userController.createReview)

router.route('/record/:id')
        .get(userController.getRecords)
router.route('/record')
        .put(userController.createRecord)
router.route('/record/:id')
        .post(userController.updateRecord)
router.route('/record/:id')
        .delete(userController.deleteRecords)

module.exports = router;