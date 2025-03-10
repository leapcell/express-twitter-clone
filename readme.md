# Twitter Clone (Express + PostgreSQL)

This is a simple Twitter clone built with Express.js and PostgreSQL. The purpose of this project is to educate users on how to deploy database-dependent applications on Leapcell.

## Features

- Express.js backend
- PostgreSQL database integration
- EJS templating for rendering views

## Project Structure

```
.
├── LICENSE            # License file
├── app.js             # Main application entry point
├── package.json       # Project metadata and dependencies
└── views/             # View templates
    └── index.ejs      # Main UI template
```

## Deployment on Leapcell

This guide will walk you through setting up and deploying the project on Leapcell.

### Prerequisites

Ensure you have the following:

- A Leapcell account
- PostgreSQL database instance
- Node.js installed

### Environment Variables

This project requires a PostgreSQL connection string, which should be set using the following environment variable:

```bash
PG_DSN=<your_postgresql_connection_string>
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/leapcell/express-twitter-clone
   cd express-twitter-clone
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the project locally, ensure your PostgreSQL instance is running and execute:

```bash
node app.js
```

The application will be accessible at `http://localhost:8080`.

### Deploying on Leapcell

1. Push your code to a GitHub repository.
2. Log in to Leapcell and connect your repository.
3. Configure the `PG_DSN` environment variable in the Leapcell deployment settings.
4. Deploy your application.

Once deployed, your application will be accessible via the Leapcell-generated domain.

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Feel free to submit issues or pull requests to improve this project.

## Contact

For support, reach out via the Leapcell Discord community or email support@leapcell.io.
