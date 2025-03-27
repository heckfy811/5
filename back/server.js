const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const auth = require('./auth');

const app = express();
const PORT = 3000;

const JWT_SECRET = '4DWW-323DdwREWdfvsdwEL'

const users = [];

app.use(cors());
app.use(bodyParser.json());

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    
    const newUser = { username, password };
    users.push(newUser);
    
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(user => user.username === username && user.password === password);
    
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token });
});

app.get('/protected', auth.authenticateToken(JWT_SECRET), (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    res.json({
         message: 'This is protected data', 
         user: req.user, 
         token: token
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});