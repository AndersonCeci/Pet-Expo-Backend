import { Router } from "express";
import axios from "axios";
import Cat from '../models/Cat.js'
import requireLogin from '../middleware/requireLogin.js';

const router = Router();

router.get('/', async (req,res) => {
    try{
        const existingCats = await Cat.find().sort({ _id: -1 });

    if(existingCats.length > 0){
        return res.json(existingCats)
    }

    const response = await axios('https://freetestapi.com/api/v1/cats')
    let cats = response.data.map(({ name, origin, temperament, colors, description, image}) =>({

        name,
        origin,
        temperament,
        colors,
        description,
        image
    }));

    await Cat.insertMany(cats)
    cats = await Cat.find().sort({ _id: -1 });
    res.render('cats', {cats})

    }catch(err){
        console.log(err)
        res.status(500).send("An error occurred");
    }
});


router.get('/new', (req, res) =>{

})

router.post('/', async (req, res) => {
    const { id: _id } = req.params;
    try{
        const {_id, name, origin, temperament, colors, description, image} = req.body
        const newCat = new Cat({
            _id,
            name,
            origin,
            temperament,
            colors,
            description,
            image
        });

        await newCat.save();
        res.status(200).json({ message: 'Cat added successfully' });

    } catch(err){
        console.log(err);
        res.status(500).send("An error occurred while saving the cat");
    }
})


router.get('/:id', async (req,res) => {
    try {
        const { id: _id } = req.params;
        const cat = await Cat.findById(_id);

        if(!cat){
            return res.status(404).send("Cat not found");
        }

        res.json(cat);


    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while fetching the cat details");
    }
})

router.get('/:id/edit', async (req, res) => {
    try{
        const { id: _id} = req.params;
        const cat = await Cat.findById(_id);

        if(!cat){
            return res.status(4040).send("Cat Not Found");
        }
        res.json(cat)

    } catch(err) {
        console.log(err)
        res.send("Error Fetching Details")
    }
})


router.patch('/:id', async (req, res) => {
    try {
        const { id: _id } = req.params;
        const {name, origin, temperament, colors, description, image} = req.body

        const updatedCat = await Cat.findByIdAndUpdate(_id, {
            name, 
            origin,
            temperament, 
            colors, 
            description, 
            image
        }, {new: true});

        if(!updatedCat){
            return res.status(404).send("Cat Not Found")
        }
        res.status(200).json({ message: 'Cat Edited successfully' });

    } catch (err) {
        console.log(err);
        console.log("Failed to update");
        res.status(500).send("Failed to update");
    }
})


router.delete('/:id', async (req, res) =>{
    try{
        const { id: _id } = req.params;
        await Cat.findByIdAndDelete(_id);
        res.status(200).json({ message: 'Dog deleted successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while deleting the cat");
    }
})
export { router as catsRouter };