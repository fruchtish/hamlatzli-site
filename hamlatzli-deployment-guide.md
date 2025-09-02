# המלצלי (Hamlatzli) Deployment Guide

This guide will help you deploy your recommendation website with almost no intervention required.

## Option 1: Render.com (Recommended - Easiest)

1. Create an account at [Render.com](https://render.com/)
2. Create a new Web Service
   - Choose "Build and deploy from a Git repository"
   - Connect your GitHub account and select your repository (or upload the files first)
   - Choose "Node" for the environment
   - Build command: `npm install`
   - Start command: `node server.js`
   - Select free plan
   
3. Add these environment variables:
   - `MONGODB_URI`: (Your MongoDB connection string - see database setup below)
   - `JWT_SECRET`: Any random string for security (e.g., "hamlatzli-secret-key-2025")
   - `PORT`: 10000

4. Click "Create Web Service" and wait for deployment (2-5 minutes)

## Option 2: Netlify + MongoDB Atlas

1. Create accounts at:
   - [Netlify](https://www.netlify.com/)
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. Set up MongoDB Atlas:
   - Create a free cluster
   - Create a database user with password
   - Under "Network Access" allow connections from anywhere (IP: 0.0.0.0)
   - Get your connection string (looks like: `mongodb+srv://username:password@cluster0.mongodb.net/hamlatzli`)
   
3. Deploy to Netlify:
   - Upload your zip file or connect to GitHub
   - Build command: `npm install`
   - Publish directory: `public`
   - Add environment variables (same as Render option)

## Option 3: Traditional Hosting (Ionos, Bluehosting)

1. Log in to your hosting control panel
2. Look for Node.js hosting options
3. Upload the zip file and extract it
4. Set up MongoDB (either use MongoDB Atlas or a local MongoDB if your host supports it)
5. Configure environment variables in the hosting control panel

## After Deployment

1. Access your site using the provided URL
2. Register at `/register.html`
3. To make yourself an admin, you'll need to manually update the database:
   ```
   db.users.updateOne({email: "your-email@example.com"}, {$set: {isAdmin: true}})
   ```

## Custom Domain Setup

1. Purchase a domain from any provider
2. In your hosting dashboard (Render, Netlify, etc.), add your custom domain
3. Update DNS settings at your domain provider to point to your hosting service

## Need Help?

The complete setup should take 15-30 minutes. If you encounter any issues, most hosting providers offer excellent documentation and support.
