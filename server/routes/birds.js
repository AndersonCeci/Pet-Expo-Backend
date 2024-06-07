import { Router } from "express";
import axios from "axios";
import Bird  from "../models/Bird.js";
import requireLogin from '../middleware/requireLogin.js';

const router = Router();


router.get('/', async (req,res) => {
    try{
        const existingBirds = await Bird.find().sort({ _id: -1 });

        if(existingBirds.length > 0){
            return res.json(existingBirds)
        }

        const response = await axios('https://freetestapi.com/api/v1/birds')
        let birds = response.data.map(({name, species, family, habitat, place_of_found, diet, description, wingspan_cm, weight_kg, image }) =>({
            name,
            species,
            family,
            habitat,
            place_of_found,
            diet,
            description,
            wingspan_cm,
            weight_kg,
            image
        }));
       
        await Bird.insertMany(birds)
        birds = await Bird.find().sort({ _id: -1 });
        // res.render('birds', {birds})

    }catch(err){
        console.log(err)
        res.status(500).send("An error occurred");

    }
})



router.get('/new', (req, res) =>{

})



router.post('/', async (req, res) => {
    const { id: _id } = req.params;
    try {
        const { _id,name, species, family, habitat, place_of_found, diet, description, wingspan_cm, weight_kg, image } = req.body;
        const newBird = new Bird({
            _id,
            name,
            species,
            family,
            habitat,
            place_of_found,
            diet,
            description,
            wingspan_cm,
            weight_kg,
            image
        });

        await newBird.save();       
        res.status(200).json({ message: 'Bird added successfully' });
        
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while saving the bird");
    }
});



router.get('/:id', async (req, res) => {
    try {
        const { id: _id } = req.params; 
        const bird = await Bird.findById(_id);
        
        if (!bird) {
            return res.status(404).send('Bird not found');
        }
        
        res.json(bird);

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while fetching the bird details");
    }
});



router.get('/:id/edit', async (req, res) => {
    try{
        const { id: _id } = req.params;
        const bird = await Bird.findById(_id);

        if (!bird) {
            return res.status(404).send('Bird not found');
        }

        res.json(bird)
    }catch(err){
        console.log(err)
        res.send("Error Fetching Details")
    }
})



router.patch('/:id', async (req, res) => {
    try {
        const { id: _id } = req.params;
        const { name, species, family, habitat, place_of_found, diet, description, wingspan_cm, weight_kg } = req.body;

        const updatedBird = await Bird.findByIdAndUpdate(_id, {
            name,
            species,
            family,
            habitat,
            place_of_found,
            diet,
            description,
            wingspan_cm,
            weight_kg
        }, { new: true });

        if (!updatedBird) {
            return res.status(404).send("Bird not found");
        }

        res.status(200).json({ message: 'Bird Edited successfully' });
    } catch (err) {
        console.log(err);
        console.log("Failed to update");
        res.status(500).send("Failed to update");
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const { id: _id } = req.params; 
        await Bird.findByIdAndDelete(_id);
        res.status(200).json({ message: 'Bird deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while deleting the bird");
    }
});


export { router as birdRouter}