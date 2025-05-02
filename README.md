# המלצלי - Recommendation Sharing Platform

A complete Hebrew language platform for sharing recommendations on restaurants, movies, books, products, and more.

## Features

- User registration and authentication
- Add, view, edit, and delete recommendations
- Rate and like recommendations
- Comment on recommendations
- Admin dashboard for managing content and users
- Mobile responsive design
- RTL support for Hebrew language

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
hamlatzli-site/
│
├── public/                  # Static frontend files
│   ├── css/                 # CSS stylesheets
│   │   └── style.css        # Main stylesheet
│   ├── js/                  # JavaScript files
│   │   ├── main.js          # Main JavaScript
│   │   └── admin.js         # Admin dashboard JavaScript
│   ├── index.html           # Home page
│   ├── admin.html           # Admin dashboard
│   ├── login.html           # Login page
│   ├── register.html        # Registration page
│   └── add-recommendation.html  # Add recommendation page
│
├── models/                  # Database models
│   ├── User.js              # User model
│   └── Recommendation.js    # Recommendation model
│
├── routes/                  # API routes
│   ├── auth.js              # Authentication routes
│   └── recommendations.js   # Recommendation routes
│
├── middleware/              # Custom middleware
│   └── auth.js              # Authentication middleware
│
├── .env                     # Environment variables
├── package.json             # Project dependencies
└── server.js                # Main server file
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/hamlatzli-site.git
   cd hamlatzli-site
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/hamlatzli
   JWT_SECRET=your_secret_key
   ```

4. Start the server:
   ```
   npm start
   ```

5. The application will be available at `http://localhost:3000`

## Deployment

### Setting up MongoDB Atlas

1. Create an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Set up database access with a username and password
4. Set up network access (whitelist your IP or allow access from anywhere)
5. Get your connection string and update your `.env` file

### Deploying to Heroku

1. Create a Heroku account if you don't have one
2. Install the Heroku CLI
3. Login to Heroku CLI:
   ```
   heroku login
   ```
4. Create a new Heroku app:
   ```
   heroku create hamlatzli
   ```
5. Set up environment variables:
   ```
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   heroku config:set JWT_SECRET=your_jwt_secret
   ```
6. Deploy to Heroku:
   ```
   git push heroku main
   ```

## Custom Domain Setup

To connect your own domain to the application:

1. Purchase a domain from a domain registrar
2. In your Heroku dashboard, go to the Settings tab of your application
3. In the "Domains" section, click "Add domain"
4. Enter your custom domain name
5. Update your domain's DNS settings to point to the Heroku app

## License

MIT License

## Contact

For any questions or support, please contact [your-email@example.com](mailto:your-email@example.com)
