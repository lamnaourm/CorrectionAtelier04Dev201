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

app.get("/produits/famille/:famille", (req, res) => {

    const famille = req.params.famille;
    const filesnames = fs.readdirSync(directory); 
    const prods = []; 

    filesnames.forEach(file => {
        const data = fs.readFileSync(path.join(directory, file), 'utf8')
        const produit = JSON.parse(data); 

        if(produit.famille === famille)
            prods.push({id:file.split('.')[0], ...produit})
    })

    res.status(202).json(prods);
});

app.put("/produits/:id", (req, res) => {

    const id = req.params.id;

    if(!fs.existsSync(path.join(directory, `${id}.txt`))){
        return res.sendStatus(404);
    }

    fs.writeFileSync(path.join(directory, `${id}.txt`), JSON.stringify(req.body)); 
    res.sendStatus(202);
});

app.delete("/produits/:id", (req, res) => {

    const id = req.params.id;

    if(!fs.existsSync(path.join(directory, `${id}.txt`))){
        return res.sendStatus(404);
    }

    fs.unlinkSync(path.join(directory, `${id}.txt`));
    res.sendStatus(202)
});

app.listen(port, () => {
    console.log('Serveur lance ....');
})


