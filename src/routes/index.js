var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.render("index"); // como definido no template engine de views, (EJS), vai rendereizar do "src/views"
});

module.exports = router;