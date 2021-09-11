const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const Thing = require('./models/thing');


mongoose.connect('mongodb+srv://userIkram:15011997@cluster1.3mskb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });



app.use(bodyParser.json());

app.post('/api/products', (req, res, next) => {
  const thing = new Thing({
    ...req.body
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
});

app.put('/api/products/:id' , (req, res, next) => {
  Thing.updateOne({ _id: req.params.id} , {...req.body, _id: req.params.id
  })
  .then(() => res.status(200).json({ message: 'objet modifié !'}))
  .catch(error => res.status(400).json({ error }));
});

app.delete('/api/products/:id' , (req, res , next) => {
  Thing.deleteOne({_id: req.params.id })
  .then(() => res.status(200).json({ message: 'Deleted!' }))
  .catch(error => res.status(400).json({ error }));
})


app.get('/api/products/:id', (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

app.use('/api/products', (req, res, next) => {
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;
