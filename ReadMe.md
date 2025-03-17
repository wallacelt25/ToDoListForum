# ToDoListForum

A modern web application that combines task management with community discussion features. Built with React, Firebase, and Tailwind CSS, this project provides a seamless experience for managing tasks while engaging with other users.

## Features

- 🔐 User authentication (sign up, login, password reset)
- ✅ Task management (create, update, delete, mark as complete)
- 💬 Forum discussions organized by topics
- 👥 User profiles
- 🌓 Responsive design for all devices

## Tech Stack

- **Frontend**: React.js
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Routing**: React Router
- **Icons**: FontAwesome

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.0.0 or higher)
- npm (v8.0.0 or higher) or [Yarn](https://yarnpkg.com/) (v1.22.0 or higher)
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/wallacelt25/ToDoListForum.git
cd ToDoListForum
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication and set up Email/Password sign-in method
3. Create a Firestore database and set up security rules
4. Create a web app in your Firebase project
5. Create a `.env` file in the root of your project and add your Firebase configuration:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. Create Firebase Configuration File

Create a file named `firebase.js` in the `src` directory:

```javascript
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
const logInWithEmailAndPassword = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const registerWithEmailAndPassword = async (email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    return res.user;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout
};
```

### 5. Start the development server

```bash
npm start
# or
yarn start
```

The application should now be running on [http://localhost:3000](http://localhost:3000).

## Project Structure

```
ToDoListForum/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── Tasks/
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   └── AddTask.jsx
│   │   ├── Forum/
│   │   │   ├── ForumList.jsx
│   │   │   ├── TopicItem.jsx
│   │   │   └── Discussion.jsx
│   │   ├── Profile/
│   │   │   └── UserProfile.jsx
│   │   └── Layout/
│   │       ├── Navbar.jsx
│   │       ├── Footer.jsx
│   │       └── Sidebar.jsx
│   ├── contexts/
│   │   ├── AuthContext.js
│   │   └── TaskContext.js
│   ├── hooks/
│   │   └── useFirestore.js
│   ├── firebase.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── .env                       # Environment variables (not tracked by git)
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
```

## Firestore Database Structure

```
users/
 ├── {userId}/
 │   ├── email: string
 │   ├── displayName: string
 │   └── photoURL: string
 │
tasks/
 ├── {taskId}/
 │   ├── title: string
 │   ├── description: string
 │   ├── completed: boolean
 │   ├── userId: string
 │   ├── createdAt: timestamp
 │   └── updatedAt: timestamp
 │
forum/
 ├── topics/
 │   ├── {topicId}/
 │   │   ├── title: string
 │   │   ├── description: string
 │   │   ├── createdBy: string
 │   │   └── createdAt: timestamp
 │
 ├── posts/
     ├── {postId}/
         ├── topicId: string
         ├── content: string
         ├── userId: string
         ├── createdAt: timestamp
         └── updatedAt: timestamp
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Deployment

To deploy to Firebase Hosting:

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase Hosting:
```bash
firebase init hosting
```

4. Build your project:
```bash
npm run build
```

5. Deploy to Firebase:
```bash
firebase deploy
```

## Git Commands for Project Setup

When setting up your project on a new machine or pushing changes:

```bash
# Clone the repository
git clone https://github.com/wallacelt25/ToDoListForum.git

# Navigate to project directory
cd ToDoListForum

# Install dependencies
npm install

# Make changes to your code...

# Add all changes to staging
git add .

# Commit changes
git commit -m "Describe your changes"

# Pull any remote changes first
git pull origin main

# Push your changes
git push origin main
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [wallacelt25](https://github.com/wallacelt25)

Project Link: [https://github.com/wallacelt25/ToDoListForum](https://github.com/wallacelt25/ToDoListForum)
