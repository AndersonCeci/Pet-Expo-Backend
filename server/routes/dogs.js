import { Router } from "express";
import axios from "axios";
import Dog from '../models/Dog.js';
import requireLogin from '../middleware/requireLogin.js';

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { id: _id } = req.params;
    const existingDogs = await Dog.find().sort({ _id: -1 });

    if (existingDogs.length > 0) {
      return res.json(existingDogs);

    }

    const response = await axios("https://freetestapi.com/api/v1/dogs");
    let dogs = response.data.map(({ name, breed_group, size, lifespan, origin, temperament, colors, description, image }) => ({   
      name,
      breed_group,
      size,
      lifespan,
      origin,
      temperament,
      colors,
      description,
      image
    }));

    await Dog.insertMany(dogs)
    dogs = await Dog.find().sort({_id: -1});

    res.render('dogs', { dogs });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred");
  }

});

router.get('/new', (req, res) => {

})

router.post('/', async (req, res) => {
  const { id: _id } = req.params;
  try{
    const {_id,name, breed_group, size, lifespan, origin, temperament, colors, description, image} = req.body;
    const newDog = new Dog({
      _id,
      name, 
      breed_group, 
      size, 
      lifespan, 
      origin, 
      temperament, 
      colors, 
      description, 
      image
    })

    await newDog.save();
    res.status(200).json({ message: 'Dog added successfully' });

  } catch(err){
    console.log(err);
    res.status(500).send("An error occurred while saving the dog");
}
})

router.get('/:id', async (req, res) => {
  try{
    const { id: _id } = req.params;
    const dog = await Dog.findById(_id);

    if(!dog){
      return res.status(404).res("Dog not found");
    }
    res.json(dog);

  } catch(err) {
    console.error(err);
        res.status(500).send("An error occurred while fetching the dog details");
  }
})

router.get('/:id/edit', async (req, res) => {
  try{
    const { id: _id } = req.params;
    const dog = await Dog.findById(_id);

    if(!dog){
      return res.status(4040).send("Dog Not Found");
    }
    res.json(dog)

  } catch(err) {
    console.log(err)
        res.send("Error Fetching Details")
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const { id: _id } = req.params;
    const { name, breed_group, size, lifespan, origin, temperament, colors, description, image } = req.body;

    const updatedDog = await Dog.findByIdAndUpdate(_id, {
      name, 
      breed_group, 
      size, 
      lifespan, 
      origin, 
      temperament, 
      colors, 
      description, 
      image
    }, {new: true});

    if(!updatedDog){
      return res.status(404).send("Dog Not Found")
    }

    res.status(200).json({ message: 'Dog Edited successfully' });

  } catch(err){
    console.log(err);
    console.log("Failed to update");
    res.status(500).send("Failed to update");
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id: _id } = req.params;
    await Dog.findByIdAndDelete(_id);
    res.status(200).json({ message: 'Dog deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while deleting the dog");
  }
});
export { router as dogsRouter };
