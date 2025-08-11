
# 🏏 Cricket Team REST API

This is a Node.js + Express + SQLite project that manages a cricket team database.  
It provides REST APIs to **add, retrieve, update, and delete** player details.

---

## 📂 Project Structure
```

cricket-team-nodejs/
│── app.js              # Express server and API routes
│── cricketTeam.db      # SQLite database with player data
│── package.json        # Dependencies and scripts
│── .gitignore          # Ignore node\_modules
│── node\_modules/       # Installed packages (ignored in GitHub)

````

---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/cricket-team-nodejs.git
   cd cricket-team-nodejs
````

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the server:**

   ```bash
   npm start
   ```

4. Server runs at:

   ```
   http://localhost:3000
   ```

---

## 📌 API Endpoints

### 1️⃣ Get all players

**GET** `/players/`
*Response:*

```json
[
  {
    "playerId": 1,
    "playerName": "Virat Kohli",
    "jerseyNumber": 18,
    "role": "Batsman"
  }
]
```

---

### 2️⃣ Add a player

**POST** `/players/`
*Request Body:*

```json
{
  "playerName": "Hardik Pandya",
  "jerseyNumber": 33,
  "role": "All-Rounder"
}
```

*Response:*

```
Player Added to Team
```

---

### 3️⃣ Get player by ID

**GET** `/players/:playerId/`

---

### 4️⃣ Update player

**PUT** `/players/:playerId/`
*Request Body:*

```json
{
  "playerName": "Hardik Pandya",
  "jerseyNumber": 33,
  "role": "All-Rounder"
}
```

*Response:*

```
Player Details Updated
```

---

### 5️⃣ Delete player

**DELETE** `/players/:playerId/`
*Response:*

```
Player Removed
```

---

## 🛠 Built With

* Node.js
* Express.js
* SQLite

---

## 📄 License

This project is open-source and free to use.

```


