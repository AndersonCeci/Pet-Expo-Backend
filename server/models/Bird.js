import mongoose from 'mongoose';

const birdSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    species: {
        type: String,
    },
    family: {
        type: String,
    },
    habitat: {
        type: String,
    },
    place_of_found: {
        type: String,
    },
    diet: {
        type: String,
    },
    description: {
      type: String,
      
    },
    wingspan_cm: {
        type: String,
    },
    weight_kg: {
        type: String,
    },
    image: {
      type: String,
      
    },
  });
  
  const Bird = mongoose.model('Bird', birdSchema);

  export default Bird;