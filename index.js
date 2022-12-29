const express = require('express'); 
const {v4:uuid} = require('uuid'); 
const fs = require('fs'); 
const path = require('path'); 

const port = 3000; 
const directory = './data'; 

const app = express();
app.use(express.json());

app.post('/produits', (req, res) => {

    if(!fs.existsSync(directory)){
        fs.mkdirSync(directory);
    }

    const id = uuid(); 
    const produit = req.body;

    fs.writeFileSync(path.join(directory, `${id}.txt`), JSON.stringify(produit)); 
    res.sendStatus(201);
})


app.get('/produits/all', (req, res) => {

    const filesnames = fs.readdirSync(directory); 
    const prods = []; 

    filesnames.forEach(file => {
        const data = fs.readFileSync(path.join(directory, file), 'utf8')
        prods.push({id:file.split('.')[0], ...JSON.parse(data)})
    })

    res.status(202).json(prods);
});

app.get("/produits/id/:id", (req, res) => {

    const id = req.params.id;

    if(!fs.existsSync(path.join(directory, `${id}.txt`))){
        return res.sendStatus(404);
    }

    const data = fs.readFileSync(path.join(directory, `${id}.txt`), 'utf8')
    res.status(202).json({id, ...JSON.parse(data)});
})

app.listen(port, () => {
    console.log('Serveur lance ....');
})


