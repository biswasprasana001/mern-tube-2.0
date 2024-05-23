# MERN Video Sharing Platform

A simple video sharing platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). Users can register, log in, upload videos, delete videos, view videos, comment on videos, and like videos.

## Features
- User authentication (register, login, logout).
- Upload videos to Cloudinary.
- List all videos or only videos uploaded by the logged-in user.
- Comment on videos with the commenter's username displayed.
- Like videos.
- Delete videos (only for videos uploaded by the logged-in user).

## Getting Started 
### Prerequisites
- Node.js
- MongoDB
- Cloudinary account

### Installation
- Clone the repository:
```
git clone https://github.com/biswasprasana001/mern-tube.git
```

- Navigate to the project directory:
```
cd mern-tube
```

- Install dependencies:
```
npm install
```

- Start the backend server:
```
node server.js
```

- Start the frontend development server:
```
npm start
```

- Open a browser and navigate to http://localhost:3000.

## Usage
- Register a new user or log in with an existing account.
- Once logged in, you can upload videos, view videos, comment on videos, and like videos.
- Use the toggle button to switch between viewing all videos and only videos uploaded by you.
- In the section displaying only your videos, you can delete any of your uploaded videos.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
