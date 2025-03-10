// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

// Create an Express application
const app = express();
// Set the port, use environment variable PORT or default to 8080
const port = process.env.PORT || 8080;

// Configure PostgreSQL connection pool using DSN from environment variable
const pool = new Pool({
    connectionString: process.env.PG_DSN,
});

// Middleware setup
// Use body-parser to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from the '../public' directory
app.use(express.static(path.join(__dirname, '../public')));
// Set EJS as the view engine
app.set('view engine', 'ejs');
// Set the directory for views
app.set('views', path.join(__dirname, 'views'));

// Function to check if a table exists and create it if not
const checkAndCreateTable = async (tableName, createQuery) => {
    try {
        // SQL query to check if the table exists in the 'public' schema
        // $1 is a placeholder for the table name
        const result = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = $1
            );
        `, [tableName]);
        // If the table does not exist, create it
        if (!result.rows[0].exists) {
            await pool.query(createQuery);
            console.log(`${tableName} table has been created.`);
        }
    } catch (error) {
        console.error(`Error creating ${tableName} table:`, error);
    }
};

// Define table creation queries
// SQL query to create the 'twitters' table
const twittersTableQuery = `
    CREATE TABLE twitters (
        id SERIAL PRIMARY KEY, -- Auto - incrementing primary key
        content TEXT NOT NULL, -- Content of the twitter
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Creation time
    );
`;

const checkPoolConnection = async () => {
    if (process.env.PG_DSN === undefined) {
        console.error('Please set the environment variable PG_DSN with the PostgreSQL connection string');
        return false;
    }
    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL');
        client.release();
        return true;
    } catch (error) {
        console.error('Error connecting to PostgreSQL:', error);
    }
    return false;
}



// Route to display the list of twitters
app.get('/', async (req, res) => {
    try {
        if (!await checkPoolConnection()) {
            console.error('PostgreSQL connection failed, please check your connection string in the environment variable PG_DSN');
            return res.render('missing-pg')
        }

        // Check and create tables on application startup
        checkAndCreateTable('twitters', twittersTableQuery);

        // SQL query to select all twitters ordered by creation time in descending order
        const { rows } = await pool.query('SELECT * FROM twitters ORDER BY created_at DESC');
        const twitters = [];
        for (const row of rows) {
            twitters.push({
                id: row.id,
                content: row.content,
                created_at: row.created_at || new Date(),
            });
        }
        // Render the 'index' view with the twitters data
        res.render('index', { twitters: twitters });
    } catch (error) {
        console.error('Error fetching twitters:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to add a new twitter
app.post('/new', async (req, res) => {
    const { content } = req.body;
    try {
        // SQL query to insert a new twitter into the 'twitters' table
        await pool.query('INSERT INTO twitters (content, created_at) VALUES ($1, CURRENT_TIMESTAMP)', [content]);
        res.redirect('/');
    } catch (error) {
        console.error('Error adding twitter:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});