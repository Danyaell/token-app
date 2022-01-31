const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
    res.send('Hi. I am listening...');
});
app.listen(3030, () => {
    console.log('Server started on localhost:3030 \nHi! i am listening...');
});

app.get('/generateToken', (req, res) => {
    const accessToken = generateAccessToken();
    console.log(`Authenticated with token: ${accessToken}`);
    res.send(accessToken);
});

app.get('/validated', validateToken, (req, res) => {
    console.log('Authorizated. Welcome!');
});

/** 
 * This function generate the token with 3 parameters; data to encript, a secret word, and the time to expire.
 * The data to encript is empty in this case, and the secret word is saved on the .env generated with a hash.
 */
function generateAccessToken() {
    return jwt.sign({data: ''}, process.env.SECRET_WORD);
}

/**
 * This function search if the cookies of the client contains the authorization, the generated token,
 * if it is undefined, it sends an 401 status code. For next, it verify if the token founded is correct, or if it's 
 * expired or incorrect. If its correct, we send a 200 status code and clear the cookie.
 */
function validateToken(req, res) {
    const accessToken = req.query.accessToken;

    jwt.verify(accessToken, process.env.SECRET_WORD, (err) => {
        if(err || !accessToken) {
            console.log('Access denied, token expired or incorrect.');
            res.send(401);
        } else {
            console.log('Validated!');
            res.clearCookie('authorization').send('Validated!');
        }
    });
}