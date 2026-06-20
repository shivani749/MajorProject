const mongoose = require("mongoose");
const axios = require("axios");
const Listing = require("../models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then(() => {
    console.log("Database connected");
    updateCoordinates();
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

async function updateCoordinates() {
  let listings = await Listing.find({});

  for (let listing of listings) {
    if (!listing.geometry || !listing.geometry.coordinates.length) {
      try {
        let response = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: `${listing.location}, ${listing.country}`,
              format: "json",
              limit: 1,
            },
            headers: {
              "User-Agent": "WonderlustApp/1.0",
            },
          }
        );

        if (response.data.length > 0) {
          listing.geometry = {
            type: "Point",
            coordinates: [
              response.data[0].lon,
              response.data[0].lat,
            ],
          };

          await listing.save();

          console.log(`Updated: ${listing.title}`);
        }
      } catch (err) {
        console.log(`Error in ${listing.title}`, err.message);
      }
    }
  }

  console.log("All listings updated");
  mongoose.connection.close();
}