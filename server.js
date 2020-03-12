//this is common JS, is used to bring in modules
//we cant use import without using Bablle
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

//Connect Database
connectDB();

//Init Middleware
//with this we can except data(body)
app.use(express.json({ extended: false }));

/*app.get('/', (req, res) =>
	res.json({ msg: 'Welcome to the ContactKeeper API...' })
);*/

//Define Rutes

app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

//Serve static assets in production

if (process.env.NODE_ENV === 'production') {
	// Set static folder
	app.use(express.static('client/build'));

	app.get('*', (req, res) =>
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// npm run server
