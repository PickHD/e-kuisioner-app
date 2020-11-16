const nodeGeocoder = require("node-geocoder");

let options = {
  provider: "openstreetmap"
};

const geoCoder = nodeGeocoder(options);
module.exports = {
  geoCoder
};
