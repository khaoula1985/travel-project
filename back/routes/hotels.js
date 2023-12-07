const{Router}=require("express")
const { gethotels, gethotelsbyid, addhotel, edithotel, deletehotel } = require("../controllers/hotelscontroller")
const upload = require("../utils/upload-file")
const hotelrouter=Router()


hotelrouter.get("/hotel", gethotels)
hotelrouter.get("/hotel/:id", gethotelsbyid)
hotelrouter.post("/hotel", upload.single("image") , addhotel)
hotelrouter.put("/hotel/:id", edithotel )
hotelrouter.delete("/hotel/:id", deletehotel )

module.exports=hotelrouter