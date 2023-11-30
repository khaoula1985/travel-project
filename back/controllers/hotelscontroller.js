
const Hotel = require("../models/hotel"); 

// Retrieve all hotels
module.exports.gethotels = async (req, resp) => {
  try {
    const hotels = await Hotel.find();
    return resp.status(200).json(hotels);
  } catch (error) {
    return resp.status(500).json({ msg: error.message });
  }
};

// Retrieve a hotel by ID
module.exports.gethotelsbyid = async (req, resp) => {
  const { id } = req.params;
  try {
    const hotel = await Hotel.findById(id);
    return resp.status(200).json(hotel);
  } catch (error) {
    return resp.status(500).json({ msg: error.message });
  }
};

// Add a new hotel
module.exports.addhotel = (req, resp) => {
  const {
    name,
    city,
    address,
    rating,
    image,
    description,
    rooms
    } = req.body;
  console.log('Received data:', req.body);
  const hoteladd = new Hotel({
    name,
    city,
    address,
    rating,
    image,
    description,
    rooms
  });
  hoteladd
    .save()
    .then(() => {
      return resp.status(200).json({ msg: "Hotel added" });
    })
    .catch((e) => {
      return resp.status(500).json({ msg: e.message });
    });
};

// Edit an existing hotel
module.exports.edithotel = (req, resp) => {
  const {
    name,
    city,
    address,
    rating,
    image,
    description,
    rooms,
  } = req.body;

  const { id } = req.params;

  Hotel.findByIdAndUpdate(id, {
    name,
    city,
    address,
    rating,
    image,
    description,
    rooms,
  })
    .then(() => {
      return resp.status(200).json({ msg: "Hotel updated" });
    })
    .catch((e) => {
      return resp.status(500).json({ msg: e.message });
    });
};

// Delete a hotel by ID
module.exports.deletehotel = (req, resp) => {
  const { id } = req.params;

  Hotel.findByIdAndDelete(id)
    .then(() => {
      return resp.status(200).json({ msg: "Hotel deleted" });
    })
    .catch((e) => {
      return resp.status(500).json({ msg: e.message });
    });
};
