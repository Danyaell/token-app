const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hi. I am listening...');
});
app.listen(3000, () => {
    console.log('Server started on localhost:3000 \nHi! i am listening...');
});

app.get('/generateToken', (req, res) => {
    const accessToken = generateAccessToken();
    console.log(`Authenticated, token: ${accessToken}`);
    res.header('authorization', accessToken.json).json({
        message: 'Authenticated',
        token: accessToken
    });
});

app.get('/validated', validateToken, (req, res) => {
    console.log('Authorizated. Welcome!');
});

/** 
 * This function generate the token with 3 parameters; data to encript, a secret word, and the time to expire.
 * The data to encript is empty in this case, and the secret word is saved on the .env generated with a hash.
 */
function generateAccessToken() {
    return jwt.sign({data: ''}, process.env.SECRET_WORD, {expiresIn: '7m'});
}

/**
 * This function search if the headers of the client contains the authorization, the generated token,
 * if it is undefined, it sends an 401 status code. For next, it verify if the token founded is correct, or if it's 
 * expired or incorrect. If its correct, we send a 200 status code.
 */
function validateToken(req, res, next) {
    const accessToken = req.headers['authorization'];
    if(!accessToken) res.sendStatus(401);

    jwt.verify(accessToken, process.env.SECRET_WORD, (err) => {
        if(err) {
            console.log('Access denied, token expired or incorrect.');
        } else res.sendStatus(200);
    });
}