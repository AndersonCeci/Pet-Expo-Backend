import mongoose from 'mongoose';

const dogSchema = new mongoose.Schema({
    id: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
    },
    breed_group: {
      type: String,
    },
    size: {
      type: String,
    },
    lifespan: {
      type: String,
    },
    origin: {
      type: String,
    },
    temperament: {
      type: [String],
    },
    colors: {
      type: [String],
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
  });
  
  const Dog = mongoose.model('Dog', dogSchema);

  export default Dog;