const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const userCardSchema = require("../controllers/userCards");

router.get("/", checkAuth, userCardSchema.user_cards_get_all);

router.post("/create", checkAuth, userCardSchema.user_cards_create);

router.patch("/edit", checkAuth, userCardSchema.user_cards_edit);

router.post("/delete", checkAuth, userCardSchema.user_cards_delete);

router.get("/:id", checkAuth, userCardSchema.user_cards_get_one);

module.exports = router;
