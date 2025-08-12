const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())
const dbPath = path.join(__dirname, 'twitterClone.db')
let db = null

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

const authenticateToken = (request, response, next) => {
  let jwtToken
  const authHeader = request.headers['authorization']
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }
  if (jwtToken === undefined) {
    response.status(401)
    response.send('Invalid JWT Token')
  } else {
    jwt.verify(jwtToken, 'mySecretCode', async (error, payload) => {
      if (error) {
        response.status(401)
        response.send('Invalid JWT Token')
      } else {
        request.username = payload.username
        next()
      }
    })
  }
}

app.post('/register/', async (request, response) => {
  const {username, password, name, gender} = request.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const selectUsernameQuery = `
    SELECT * FROM user WHERE username = '${username}';`
  const dbUser = await db.get(selectUsernameQuery)

  if (dbUser === undefined) {
    if (password.length < 6) {
      response.status(400)
      response.send('Password is too short')
    } else {
      const createUserQuery = `
            INSERT INTO user (username,password,name,gender)
            VALUES ('${username}','${hashedPassword}','${name}','${gender}');`

      await db.run(createUserQuery)
      response.status(200)
      response.send('User created successfully')
    }
  } else {
    response.status(400)
    response.send('User already exists')
  }
})

app.post('/login/', async (request, response) => {
  const {username, password} = request.body
  const selectUserQuery = `
    SELECT * FROM user 
    WHERE username = '${username}';`

  const dbUser = await db.get(selectUserQuery)

  if (dbUser === undefined) {
    response.status(400)
    response.send('Invalid user')
  } else {
    const isPasswordMatch = await bcrypt.compare(password, dbUser.password)
    if (isPasswordMatch) {
      const payload = {username: username}
      const jwtToken = jwt.sign(payload, 'mySecretCode')
      response.send({jwtToken})
    } else {
      response.status(400)
      response.send('Invalid password')
    }
  }
})

app.get('/user/tweets/feed/', authenticateToken, async (request, response) => {
  const {username} = request
  const selectUsersId = `
  SELECT user_id FROM user WHERE username = '${username}';`

  const dbUser = await db.get(selectUsersId)
  const userId = dbUser.user_id

  const selecttweetQuery = `
  SELECT user.username ,
  tweet.tweet,
  tweet.date_time AS dateTime
  FROM user 
  INNER JOIN tweet ON user.user_id = tweet.user_id
  INNER JOIN follower ON tweet.user_id = follower.following_user_id
  WHERE follower.follower_user_id = ${userId}
  ORDER BY tweet.date_time DESC
  LIMIT 4;`

  const dbResponse = await db.all(selecttweetQuery)
  response.send(dbResponse)
})
app.get('/user/following/', authenticateToken, async (request, response) => {
  const {username} = request
  const selectUsersId = `
  SELECT * FROM user  WHERE username = '${username}';`

  const dbUser = await db.get(selectUsersId)
  const userId = dbUser.user_id

  const selectFollowingList = `
  SELECT name FROM user 
  WHERE user_id IN (
    SELECT following_user_id
    FROM follower 
    WHERE follower_user_id = ${userId}
  );`

  const dbResponse = await db.all(selectFollowingList)
  response.send(dbResponse)
})

app.get('/user/followers/', authenticateToken, async (request, response) => {
  const {username} = request
  const selectUsersId = `
  SELECT * FROM user WHERE username = '${username}';`
  const dbUser = await db.get(selectUsersId)
  const userId = dbUser.user_id

  const getFollwersList = `
  SELECT name FROM user WHERE 
  user_id IN (
    SELECT follower_user_id from 
    follower WHERE 
    following_user_id = ${userId}
  );`

  const dbResponse = await db.all(getFollwersList)
  response.send(dbResponse)
})

app.get('/tweets/:tweetId/', authenticateToken, async (request, response) => {
  const {username} = request
  const {tweetId} = request.params

  const selectUsernameQuery = `
  SELECT * FROM user WHERE username = '${username}';`

  const user = await db.get(selectUsernameQuery)

  const selectTweet = `
  SELECT * FROM tweet WHERE tweet_id = ${tweetId};`
  const tweet = await db.get(selectTweet)
  if (!tweet) {
    return response.status(404).send('Tweet not found')
  }
  const isFollowingQuery = `
    SELECT 1
    FROM follower
    WHERE follower_user_id = ${user.user_id} AND following_user_id = ${tweet.user_id};
  `
  const isFollowing = await db.get(isFollowingQuery)

  if (!isFollowing) {
    return response.status(401).send('Invalid Request')
  }

  const getLikesQuery = `SELECT COUNT(*) AS count FROM like WHERE tweet_id = ${tweetId}`
  const likesCount = await db.get(getLikesQuery)

  const getReplyQuery = `SELECT COUNT(*) AS count FROM reply WHERE tweet_id = ${tweetId}`
  const repliesCount = await db.get(getReplyQuery)

  // Return the tweet with meta
  response.send({
    tweet: tweet.tweet,
    likes: likesCount.count,
    replies: repliesCount.count,
    dateTime: tweet.date_time,
  })
})

app.get(
  '/tweets/:tweetId/likes/',
  authenticateToken,
  async (request, response) => {
    const {tweetId} = request.params
    const {username} = request
    const getUsernameQuery = `SELECT * FROM user WHERE username = '${username}';`
    const user = await db.get(getUsernameQuery)

    const getTweetQuery = `SELECT * FROM tweet WHERE tweet_id = ${tweetId};`
    const tweet = await db.get(getTweetQuery)
    if (!tweet) {
      return response.status(404).send('Tweet not found')
    }

    const checkFollowingQuery = `SELECT 1 FROM follower WHERE follower_user_id = ${user.user_id} AND following_user_id = ${tweet.user_id};`
    const isFollowing = await db.get(checkFollowingQuery)

    if (!isFollowing) {
      return response.status(401).send('Invalid Request')
    }

    const getLikedUsersQuery = `
    SELECT u.username
    FROM like l
    JOIN user u ON l.user_id = u.user_id
    WHERE l.tweet_id = ${tweetId};
  `
    const likedUsers = await db.all(getLikedUsersQuery)

    const likes = likedUsers.map(each => each.username)
    response.send({likes})
  },
)

app.get(
  '/tweets/:tweetId/replies/',
  authenticateToken,
  async (request, response) => {
    const {tweetId} = request.params
    const {username} = request

    const getUsernameQuery = `SELECT * FROM user WHERE username = '${username}';`
    const user = await db.get(getUsernameQuery)
    const userId = user.user_id

    const selectTweetQuery = `SELECT * FROM tweet WHERE tweet_id = ${tweetId};`
    const tweet = await db.get(selectTweetQuery)
    const checkFollowingQuery = `
    SELECT 1 FROM follower
    WHERE follower_user_id = ${userId} AND following_user_id = ${tweet.user_id};
    `
    const isFollowing = await db.get(checkFollowingQuery)
    if (!tweet) {
      response.status(404)
      response.send('Tweet not found')
    } else if (!isFollowing) {
      response.status(401)
      response.send('Invalid Request')
    } else {
      const getReplyQuery = `
    SELECT user.name, reply.reply
    FROM reply
    JOIN user ON reply.user_id = user.user_id
    WHERE reply.tweet_id = ${tweetId};
    `
      const replies = await db.all(getReplyQuery)

      response.send({replies})
    }
  },
)

app.get('/user/tweets/', authenticateToken, async (request, response) => {
  const {username} = request
  const getUsernameQuery = `SELECT * FROM user WHERE username = '${username}';`
  const user = await db.get(getUsernameQuery)
  const userId = user.user_id

  const selectTweetQuery = `
    SELECT 
      t.tweet,
      t.date_time AS dateTime,
      (SELECT COUNT(*) FROM like WHERE tweet_id = t.tweet_id) AS likes,
      (SELECT COUNT(*) FROM reply WHERE tweet_id = t.tweet_id) AS replies
    FROM tweet t
    WHERE t.user_id = ${userId}
    ORDER BY t.date_time DESC;
    `
  const tweets = await db.all(selectTweetQuery)

  response.send(tweets)
})

app.post('/user/tweets/', authenticateToken, async (request, response) => {
  const {username} = request
  const {tweet} = request.body

  const selectUserId = `
  SELECT * FROM user WHERE username = '${username}';`
  const dbUser = await db.get(selectUserId)

  const userId = dbUser.user_id
  const dateTime = new Date()

  const createTweetQuery = `
  INSERT INTO tweet (tweet,user_id,date_time)
  VALUES ('${tweet}',${userId},'${dateTime}');`

  await db.run(createTweetQuery)
  response.send('Created a Tweet')
})

app.delete(
  '/tweets/:tweetId/',
  authenticateToken,
  async (request, response) => {
    const {tweetId} = request.params
    const {username} = request

    const getUsernameQuery = `SELECT * FROM user WHERE username = '${username}';`
    const user = await db.get(getUsernameQuery)

    const getTweetQuery = `SELECT * FROM tweet WHERE tweet_id = ${tweetId};`
    const tweet = await db.get(getTweetQuery)

    if (!tweet) {
      response.status(404)
      response.send('Invalid Request')
    } else if (tweet.user_id !== user.user_id) {
      response.status(401)
      response.send('Invalid Request')
    } else {
      await db.run(`DELETE FROM tweet WHERE tweet_id = ${tweetId};`)

      response.send('Tweet Removed')
    }
  },
)

module.exports = app
