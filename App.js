const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const twig = require('twig');

const app = express();

const MONGODB_URL = 'mongodb+srv://test:123@cluster01.zv9fx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// lets import our model
const Post = require('./models/post');

app.set('view engine', 'html');
app.engine('html', twig.__express);
app.set('views', 'views');

app.use(express.static(__dirname + '/public'));

// Use body parser
app.use(bodyParser.urlencoded({
    extended: false
}));

mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true
    })
    .then(result => {
        app.listen(3000);
        console.log('database is connected');

    }).catch(err => {
        if (err) throw err;
    });




app.post('/', (req, res) => {
    new Post({
            title:req.body.title,
            content:req.body.content,
            author:req.body.author,
            image:req.body.image
        })
        .save()
        .then(result => {
            console.log(result);
            res.redirect('/');
        })
        .catch(err => {
            if (err) throw err;
        });
});

app.get('/', (req, res) => {
    // Fetch the posts from the database
    Post.find()
        .sort({
            createdAt: 'descending'
        })
        .then(result => {
            if (result) {
                res.render('home', {
                    allpost: result
                });
            }
        })
        .catch(err => {
            if (err) throw err;
        });
});

// delete function
app.get('/delete/:id', (req, res) => {
    Post.findByIdAndDelete(req.params.id)
    .then(result => {
        res.redirect('/');
        
    })
    .catch(err => {
        console.log(err);
        res.redirect('/');
    })
});

// EDIT POST
app.get('/edit/:id', (req, res) => {

    Post.findById(req.params.id)
    .then(result => {
        if(result){
            res.render('edit',{
                post:result
            });
        }
        else{
            res.redirect('/');
        }
    })
    .catch(err => {
        res.redirect('/');
    });
});

// UPDATE POST
app.post('/edit/:id', (req, res) => {
    Post.findById(req.params.id)
    .then(result => {
        if(result){
            result.title = req.body.title;
            result.content = req.body.content;
            result.author_name = req.body.author;
            return result.save();
        }
        else{
            console.log(err);
            res.redirect('/');
        }
    })
    .then(update => {
        res.redirect('/');
    })
    .catch(err => {
        res.redirect('/');
    });
});