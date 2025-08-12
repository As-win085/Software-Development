# Twitter Clone Backend

A Node.js + Express backend API that replicates core Twitter functionalities, including user registration, login, following system, tweets, likes, and replies. Uses **SQLite** for the database and **JWT** for authentication.

## 📂 Project Structure

```
twitter-clone-backend/
│
├── app.js                  # Main server file
├── database/
│   └── twitterClone.db     # SQLite database
├── routes/
│   ├── authRoutes.js       # Authentication APIs
│   ├── userRoutes.js       # User profile, following, followers
│   ├── tweetRoutes.js      # Tweet actions (CRUD, likes, replies)
├── middlewares/
│   └── authenticateToken.js  # JWT authentication middleware
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## 🚀 Features

* **User Registration** with validation
* **User Login** with JWT token generation
* **Follow/Unfollow** functionality
* **Create, Read, Delete Tweets**
* **Like & Reply** system
* **View Tweets Feed** from followed users
* SQLite database for persistence

## 🛠️ Technologies Used

* Node.js
* Express.js
* SQLite3
* JWT (jsonwebtoken)
* bcrypt (password hashing)

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/twitter-clone-backend.git
   cd twitter-clone-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Place the database file:

   * Put `twitterClone.db` in the `database` folder.

4. Start the server:

   ```bash
   node app.js
   ```

## 🔑 API Endpoints

### Authentication

* **POST** `/register/` → Register new user
* **POST** `/login/` → Login & receive JWT token

### User

* **GET** `/user/tweets/feed/` → Get tweets from people you follow
* **GET** `/user/following/` → List of people you follow
* **GET** `/user/followers/` → List of people following you

### Tweets

* **GET** `/tweets/:tweetId/` → Tweet details (likes, replies)
* **GET** `/tweets/:tweetId/likes/` → Users who liked the tweet
* **GET** `/tweets/:tweetId/replies/` → Replies on the tweet
* **POST** `/user/tweets/` → Create a new tweet
* **DELETE** `/tweets/:tweetId/` → Delete your tweet


