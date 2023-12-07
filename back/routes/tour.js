const{Router}=require("express")
const { gettours, gettoursbyid, addtour, edittour, deletetour } = require("../controllers/tourcontroller")
const upload = require("../utils/upload-file")
const tourrouter=Router()


tourrouter.get("/tour", gettours)
tourrouter.get("/tour/:id", gettoursbyid)
tourrouter.post("/tour", upload.single("file"), addtour)
tourrouter.put("/tour/:id", edittour )
tourrouter.delete("/tour/:id", deletetour )

module.exports=tourrouter