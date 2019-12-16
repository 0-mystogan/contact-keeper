//this is common JS, is used to bring in modules
//we cant use import without using Bablle
const express = require('express');

const app = express();

app.get('/', (req, res) =>
	res.json({ msg: 'Welcome to the ContactKeeper API...' })
);

//Define Rutes

app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
