import mongoose from 'mongoose';

const catSchema = new mongoose.Schema({
    id: {
      type: Number,
      unique: true,
    },
    name: {
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
  
  const Cat = mongoose.model('Cat', catSchema);

  export default Cat;