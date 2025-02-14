Frontend - To-Do List

Overview

The frontend of the To-Do List application is built using Next.js. It provides a user-friendly interface for managing tasks, including authentication and secure data handling.

Features

✅ User Authentication (JWT-based login and registration)

✅ Task Management (Create, update, delete tasks)

✅ Drag & Drop support for reordering tasks

✅ Responsive UI for seamless experience across devices

✅ Integration with backend API for persistent storage

Tech Stack

Framework: Next.js

State Management: React Context API / Redux (if applicable)

UI Components: Tailwind CSS / Material UI

API Communication: Axios

Installation & Setup

Prerequisites

Node.js (>= 16.x)

npm or yarn

Steps

Clone the repository:





Install dependencies:

npm install
# or
yarn install

Create a .env.local file and configure the environment variables:

 


Start the development server:

npm run dev
# or
yarn dev

Open http://localhost:3080 in your browser.

Deployment

This project is deployed using Railway. To deploy:

Connect the GitHub repository to Railway.

Configure environment variables in the Railway dashboard.

Deploy the application.

API Documentation