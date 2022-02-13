const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const auth = require('../middleware/auth');

router.get("",memberController.getMembers);
router.get("/:id",memberController.getMemberById);

router.post("/addmember",memberController.addMember);
router.post("/login",auth,memberController.login);

router.put("/:id",memberController.updateMember);

router.delete("/:id",memberController.deleteMember);

module.exports = router;
