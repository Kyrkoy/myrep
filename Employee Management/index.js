require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');

let db = require('./models/db');
const mainController = require('./controllers/mainController');

var app = express();
app.use(bodyparser.urlencoded({
    extended: true
}));



const hbs = exphbs.create({
    extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/', 
    helpers: {
        select:function(value){ 
            return value +7; 
        }
    }
});

app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.listen(3000, () => {
    console.log('Express server started at port : 3000');
});

app.use('/', mainController);