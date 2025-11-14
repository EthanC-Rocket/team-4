# GameHub - Complete Codebase Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Backend Documentation](#backend-documentation)
4. [Frontend Documentation](#frontend-documentation)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Component Reference](#component-reference)
8. [Game Mechanics](#game-mechanics)
9. [Security & Authentication](#security--authentication)
10. [Development Workflow](#development-workflow)

---

## Project Overview

GameHub is a full-stack web application that provides a centralized platform for playing multiple mini-games with user authentication and score tracking capabilities.

### Key Features
- **Multi-game Platform**: 6 different games in one hub
- **User Authentication**: JWT-based secure authentication
- **Score Tracking**: Persistent score storage and retrieval
- **Responsive Design**: Works across different screen sizes
- **Real-time Gameplay**: Interactive games with immediate feedback

### Tech Stack

**Frontend:**
- React 18.2.0
- React Router DOM 6.20.0
- Axios 1.6.2
- Loglevel 1.9.2 (logging utility)

**Backend:**
- Flask 3.0.0 (Python web framework)
- Flask-CORS 4.0.0 (Cross-Origin Resource Sharing)
- Flask-SQLAlchemy 3.1.1 (ORM)
- Flask-JWT-Extended 4.6.0 (JWT authentication)
- bcrypt 4.1.2 (password hashing)
- python-dotenv 1.0.0 (environment variables)
- OpenAI API (for Zork game)

**Database:**
- SQLite (development)
- Easily portable to PostgreSQL/MySQL for production

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│                     (React Application)                      │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP/HTTPS
                 │ JSON API Requests
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    Flask Backend Server                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Routes & Controllers                 │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          JWT Authentication Middleware                │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              SQLAlchemy ORM Layer                     │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   SQLite Database                            │
│              (Users & Scores Tables)                         │
└─────────────────────────────────────────────────────────────┘
```

### Application Flow

1. **User Access**: User visits the React frontend
2. **Authentication**: User registers/logs in via API calls
3. **Token Storage**: JWT token stored in localStorage
4. **Game Selection**: User navigates to game from Hub
5. **Gameplay**: User plays game (client-side logic)
6. **Score Submission**: Game sends score to backend API
7. **Data Persistence**: Backend stores score in database
8. **Score Display**: Scores fetched and displayed in sidebar

---

## Backend Documentation

### File: `backend/app.py`

The main Flask application file containing all API routes, database models, and business logic.

#### Configuration

```python
app.config['SECRET_KEY']                    # Flask secret key for sessions
app.config['JWT_SECRET_KEY']                # JWT signing key
app.config['SQLALCHEMY_DATABASE_URI']       # Database connection string
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] # Disable modification tracking
app.config['JWT_ACCESS_TOKEN_EXPIRES']      # Token expiration (1 day)
```

#### Database Models

##### User Model
```python
class User(db.Model):
    id: Integer (Primary Key)
    username: String(80) - Unique, not null
    email: String(120) - Unique, not null
    password_hash: String(255) - bcrypt hashed password
    created_at: DateTime - Account creation timestamp
    scores: Relationship - One-to-many with Score model
```

**Purpose**: Stores user account information with secure password hashing.

**Relationships**: One user can have many scores.

##### Score Model
```python
class Score(db.Model):
    id: Integer (Primary Key)
    user_id: Integer (Foreign Key -> User.id)
    game_name: String(50) - Name of the game
    score: Integer - Numeric score value
    score_metadata: String(500) - JSON string for extra data
    created_at: DateTime - Score submission timestamp
```

**Purpose**: Stores game scores linked to users.

**Relationships**: Many scores belong to one user.

#### API Endpoints

##### 1. User Registration
**Endpoint**: `POST /api/register`

**Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201 Created)**:
```json
{
  "message": "User created successfully",
  "access_token": "jwt_token_string",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Error Responses**:
- `400`: Missing required fields
- `400`: Username already exists
- `400`: Email already exists

**Logic**:
1. Validates input fields
2. Checks for existing username/email
3. Hashes password using bcrypt
4. Creates new user in database
5. Generates JWT token
6. Returns token and user data

##### 2. User Login
**Endpoint**: `POST /api/login`

**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200 OK)**:
```json
{
  "access_token": "jwt_token_string",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Error Responses**:
- `400`: Missing credentials
- `401`: Invalid credentials

**Logic**:
1. Validates credentials provided
2. Queries user by username
3. Verifies password using bcrypt
4. Generates JWT token
5. Returns token and user data

##### 3. Get User Info
**Endpoint**: `GET /api/user`

**Authentication**: Required (JWT)

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK)**:
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

**Error Responses**:
- `401`: Unauthorized (missing/invalid token)
- `404`: User not found

**Logic**:
1. Extracts user ID from JWT token
2. Queries database for user
3. Returns user information

##### 4. Get User Scores
**Endpoint**: `GET /api/scores`

**Authentication**: Required (JWT)

**Response (200 OK)**:
```json
[
  {
    "game_name": "Sudoku",
    "score": 850,
    "score_metadata": "Completed in 120 seconds",
    "created_at": "2025-11-13T10:30:00"
  },
  {
    "game_name": "RocketMans",
    "score": 340,
    "score_metadata": "",
    "created_at": "2025-11-13T11:15:00"
  }
]
```

**Logic**:
1. Extracts user ID from JWT token
2. Queries all scores for user
3. Groups by game name
4. Returns only the best score per game
5. Sorted by creation date (descending)

##### 5. Submit Score
**Endpoint**: `POST /api/scores`

**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "game_name": "string",
  "score": 100,
  "score_metadata": "string (optional)"
}
```

**Response (201 Created)**:
```json
{
  "message": "Score added successfully",
  "score": {
    "id": 15,
    "game_name": "Sudoku",
    "score": 850,
    "score_metadata": "Completed in 120 seconds",
    "created_at": "2025-11-13T10:30:00"
  }
}
```

**Error Responses**:
- `400`: Missing required fields
- `401`: Unauthorized

**Logic**:
1. Extracts user ID from JWT token
2. Validates game name and score
3. Creates new score record
4. Saves to database
5. Returns created score

##### 6. Zork Game API
**Endpoint**: `POST /api/zork`

**Authentication**: Not required

**Request Body**:
```json
{
  "input": "go north"
}
```

**Response (200 OK)**:
```json
{
  "response": "You move north into a dark room. You can barely see anything."
}
```

**Error Responses**:
- `500`: OpenAI API error

**Logic**:
1. Receives user input command
2. Sends to OpenAI GPT-4o-mini model
3. Model acts as Zork game master
4. Returns game response

**Note**: Requires `OPENAI_API_KEY` environment variable.

#### Security Features

1. **Password Hashing**: 
   - Uses bcrypt with automatic salt generation
   - Passwords never stored in plain text
   - One-way hashing (cannot be reversed)

2. **JWT Authentication**:
   - Stateless authentication
   - 1-day token expiration
   - Tokens signed with secret key
   - Tokens validated on protected routes

3. **CORS Protection**:
   - Configured to allow frontend origin
   - Prevents unauthorized cross-origin requests

4. **Input Validation**:
   - Checks for required fields
   - Validates unique constraints
   - Prevents duplicate accounts

---

## Frontend Documentation

### Application Structure

```
frontend/src/
├── components/
│   ├── Hub.js                    # Main game selection hub
│   ├── Login.js                  # Login form component
│   ├── Register.js               # Registration form component
│   └── games/
│       ├── Sudoku.js             # Sudoku game
│       ├── Sudoku.css
│       ├── RocketMans.js         # Flappy Bird-style game
│       ├── RocketMans.css
│       ├── DungeonCrawler.js     # RPG dungeon game
│       ├── DungeonCrawler.css
│       ├── PersonalityQuiz.js    # Personality assessment
│       ├── PersonalityQuiz.css
│       ├── WouldYouRather.js     # Choice-based game
│       ├── WouldYouRather.css
│       ├── Zork.js               # AI-powered text adventure
│       └── Zork.css
├── utils/
│   └── logger.js                 # Logging utility
├── App.js                        # Main app component & routing
├── App.css                       # Global styles
├── index.js                      # React entry point
└── index.css                     # Base styles
```

### Core Components

#### App.js
**Purpose**: Root component managing routing and authentication state.

**State Management**:
```javascript
const [user, setUser] = useState(null)           // Current user object
const [token, setToken] = useState(localStorage.getItem('token'))  // JWT token
```

**Key Functions**:

1. `useEffect()` - Token Validation
   - Runs on component mount and when token changes
   - Validates token by calling `/api/user`
   - Sets user data if valid
   - Removes invalid tokens

2. `handleLogin(token, userData)`
   - Stores token in localStorage
   - Updates state with token and user data
   - Called after successful login/registration

3. `handleLogout()`
   - Removes token from localStorage
   - Clears user and token state
   - Effectively logs user out

**Routing Structure**:
```javascript
/login              -> Login component (redirect if authenticated)
/register           -> Register component (redirect if authenticated)
/                   -> Hub component (main page)
/game/sudoku        -> Sudoku game
/game/rocketmans    -> RocketMans game
/game/dungeon       -> DungeonCrawler game
/game/personality-quiz -> PersonalityQuiz game
/game/would-you-rather -> WouldYouRather game
/game/zork          -> Zork game
```

**Protected Routes**: All game routes and Hub receive user and token as props for conditional features.

---

#### Login.js
**Purpose**: User login form component.

**State**:
```javascript
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
```

**Functions**:

`handleSubmit(e)` - Form submission handler
- Prevents default form behavior
- Validates input (browser native validation)
- Sends POST request to `/api/login`
- Calls `onLogin` callback on success
- Navigates to home page
- Displays errors if login fails

**UI Elements**:
- Username input field
- Password input field
- Submit button
- Link to registration page
- Error message display

---

#### Register.js
**Purpose**: User registration form component.

**State**:
```javascript
const [username, setUsername] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
```

**Functions**:

`handleSubmit(e)` - Form submission handler
- Validates all required fields
- Ensures password minimum length (6 characters)
- Sends POST request to `/api/register`
- Automatically logs in user on success
- Displays specific error messages

**Validation**:
- Username: Required
- Email: Required, must be valid email format
- Password: Required, minimum 6 characters

---

#### Hub.js
**Purpose**: Main game selection interface with score sidebar.

**State**:
```javascript
const [scores, setScores] = useState([])  // User's best scores
```

**Functions**:

1. `useEffect()` - Fetch scores on mount
   - Runs when user or token changes
   - Calls `fetchScores()` if authenticated

2. `fetchScores()` - Retrieve user scores
   - Makes authenticated GET request to `/api/scores`
   - Updates scores state
   - Handles errors silently (logs to console)

**Game Configuration**:
```javascript
const games = [
  { name, path, icon, description },
  // ... 6 games total
]
```

**Layout**:
- **Sidebar** (conditional - only for logged-in users):
  - Displays "Your Scores" heading
  - Shows best score for each game played
  - Empty state message if no scores

- **Main Content**:
  - GameHub title and emoji
  - User info (username) or login/register buttons
  - Logout button (if authenticated)
  - Grid of game cards (6 games)
  - Each card shows: icon, name, description
  - Cards are clickable and navigate to game

---

### Game Components

#### 1. Sudoku.js

**Game Type**: Logic puzzle

**Description**: Classic 9x9 Sudoku with three difficulty levels.

**State Management**:
```javascript
const [board, setBoard] = useState([])              // Current board state (9x9)
const [initialBoard, setInitialBoard] = useState([]) // Starting configuration
const [selectedCell, setSelectedCell] = useState(null) // Currently selected cell
const [timeElapsed, setTimeElapsed] = useState(0)   // Timer in seconds
const [gameWon, setGameWon] = useState(false)       // Win condition flag
const [difficulty, setDifficulty] = useState('medium') // easy/medium/hard
```

**Key Functions**:

1. `generateSolvedBoard()` - Creates valid solved Sudoku
   - Initializes 9x9 array with zeros
   - Uses backtracking algorithm
   - Randomizes number placement for variety
   - Returns completed valid board

2. `isValid(board, row, col, num)` - Validation helper
   - Checks if number can be placed in position
   - Validates row (no duplicates)
   - Validates column (no duplicates)
   - Validates 3x3 box (no duplicates)

3. `generateNewGame(difficulty)` - Creates playable puzzle
   - Generates solved board
   - Removes cells based on difficulty:
     - Easy: 30 cells removed
     - Medium: 40 cells removed
     - Hard: 50 cells removed
   - Sets initial and current board states
   - Resets timer and win state

4. `handleCellClick(row, col)` - Cell selection
   - Only allows selection of non-fixed cells
   - Updates selectedCell state

5. `handleNumberInput(num)` - Number placement
   - Places number in selected cell
   - Only modifies non-initial cells
   - Checks for win condition after placement

6. `checkWin(currentBoard)` - Victory validation
   - Ensures all cells filled
   - Validates all rows (9 unique numbers)
   - Validates all columns (9 unique numbers)
   - Validates all 3x3 boxes (9 unique numbers)
   - Calls `submitScore()` on win

7. `submitScore()` - Score submission
   - Calculates score: `max(1000 - timeElapsed * 10, 100)`
   - Faster completion = higher score
   - Minimum score: 100 points
   - Sends to backend API with metadata

**UI Components**:
- Back button (navigates to hub)
- Game title
- Timer display (MM:SS format)
- Difficulty selector (dropdown)
- New Game button
- 9x9 Sudoku grid
  - Fixed cells (gray background, unclickable)
  - Empty cells (white, clickable)
  - Selected cell (blue highlight)
- Number pad (1-9 buttons, Clear button)
- Win message overlay (appears on completion)

**Timer Mechanism**:
- Uses `setInterval` to increment every second
- Stops when game is won
- Cleanup on component unmount

**Styling**: Sudoku.css
- Grid layout with proper borders
- 3x3 box borders thicker than cell borders
- Color-coded cells (fixed vs editable)
- Hover effects
- Responsive design

---

#### 2. RocketMans.js

**Game Type**: Arcade (Flappy Bird clone)

**Description**: Navigate a rocket through obstacles by controlling altitude.

**State Management**:
```javascript
const [gameStarted, setGameStarted] = useState(false)
const [gameOver, setGameOver] = useState(false)
const [score, setScore] = useState(0)
const [highScore, setHighScore] = useState(0)

// Game state ref (for performance)
const gameStateRef = useRef({
  rocket: { x: 100, y: 200, velocity: 0, rotation: 0 },
  obstacles: [],
  score: 0,
  frameCount: 0
})
```

**Why useRef for game state?**
- Avoids re-renders on every frame (60 FPS)
- Direct mutation for performance
- React state only for UI updates

**Key Functions**:

1. `startGame()` - Initialize game
   - Resets rocket position and velocity
   - Clears obstacles array
   - Resets score and frame count
   - Sets game flags

2. `updateGame()` - Main game loop (60 FPS)
   - **Rocket Physics**:
     - Applies gravity (velocity += 0.5)
     - Updates position (y += velocity)
     - Calculates rotation based on velocity
   
   - **Obstacle Generation**:
     - Every 90 frames (1.5 seconds)
     - Random gap position
     - Gap size: 150 pixels
     - Top and bottom obstacles
   
   - **Obstacle Movement**:
     - Move left 3 pixels per frame
     - Remove off-screen obstacles
     - Check if rocket passed (scoring)
   
   - **Collision Detection**:
     - Check ceiling/floor collision
     - Check obstacle collision (rectangle-circle collision)
     - End game on collision

3. `drawGame(ctx, canvas)` - Rendering
   - Clear canvas (dark background)
   - Draw animated starfield
   - Draw obstacles (red rectangles)
   - Draw rocket (triangle shape with rotation)
   - Draw flame trail (when moving up)
   - Draw score on canvas

4. `endGame()` - Game over handler
   - Sets gameOver flag
   - Updates high score if beaten
   - Submits score to backend (if authenticated)

**Controls**:
- SPACE or ↑ Arrow: Apply upward velocity (-8 pixels)

**Game Loop**:
```javascript
useEffect(() => {
  if (gameStarted && !gameOver) {
    const gameLoop = setInterval(() => {
      updateGame()
      drawGame(ctx, canvas)
    }, 1000 / 60)  // 60 FPS
    
    return () => clearInterval(gameLoop)
  }
}, [gameStarted, gameOver])
```

**Canvas Rendering**:
- Canvas size: 800x400 pixels
- Coordinate system: (0,0) at top-left
- Rocket: Blue triangle with rotation
- Obstacles: Red vertical bars
- Stars: White dots with parallax scrolling

**Scoring**:
- +10 points per obstacle passed
- Score displayed in real-time
- High score tracked in session

---

#### 3. DungeonCrawler.js

**Game Type**: Roguelike RPG

**Description**: Explore procedurally generated dungeons, fight monsters, collect items, level up.

**State Management**:
```javascript
const [gameStarted, setGameStarted] = useState(false)
const [player, setPlayer] = useState({
  x: 1, y: 1,
  hp: 100, maxHp: 100,
  attack: 10,
  level: 1, exp: 0
})
const [dungeon, setDungeon] = useState([])  // 2D array (15x15)
const [enemies, setEnemies] = useState([])   // Array of enemy objects
const [items, setItems] = useState([])       // Array of item objects
const [message, setMessage] = useState('')   // Game message log
const [score, setScore] = useState(0)        // Player score
```

**Dungeon Size**: 15x15 grid

**Key Functions**:

1. `startGame()` - Initialize new dungeon
   - Generates new dungeon layout
   - Places player at starting position
   - Spawns 10 enemies at random floor positions
   - Spawns 5 items at random floor positions
   - Resets all game state

2. `generateDungeon(callback)` - Procedural generation
   - **Algorithm**:
     - Start with all walls
     - Create 8 random rooms (3-6 tiles in size)
     - Connect rooms with corridors
     - Mark paths as 'floor', rest as 'wall'
   
   - **Room Generation**:
     - Random width and height (3-6 tiles)
     - Random position within bounds
     - Carve out rectangular rooms
   
   - **Corridor Generation**:
     - Connect each room to next room center
     - Create L-shaped corridors (horizontal then vertical)

3. `getShuffledFloorPositions(dungeon)` - Helper
   - Finds all floor tiles
   - Shuffles array randomly
   - Used for non-overlapping entity placement

4. `handleKeyPress(e)` - Movement and combat
   - **Arrow Keys**: Move player in direction
   - **Movement Logic**:
     - Calculate new position
     - Check if wall (blocked)
     - Check if enemy (attack)
     - Check if item (collect)
     - Update player position if valid

5. `movePlayer(dx, dy)` - Position update
   - Calculates new coordinates
   - Validates move (within bounds, not wall)
   - Checks for enemy collision -> triggers attack
   - Checks for item collision -> collects item
   - Updates player state

6. `attackEnemy(enemy)` - Combat system
   - **Player Attack**:
     - Damage = player.attack
     - Enemy HP -= damage
     - Enemy dies if HP <= 0
   
   - **Enemy Counter-Attack** (if survives):
     - Damage = enemy.attack
     - Player HP -= damage
     - Game over if player HP <= 0
   
   - **Experience and Leveling**:
     - Gain EXP on enemy kill
     - Level up at 100 EXP
     - On level up:
       - Increase max HP by 20
       - Increase attack by 5
       - Fully heal player
       - Reset EXP to 0

7. `collectItem(item)` - Item collection
   - **Health Potion**:
     - Heal 30 HP
     - Cannot exceed maxHp
   
   - **Weapon Upgrade**:
     - Increase attack by 5

**Enemy Types**:
```javascript
{ 
  type: 'goblin' | 'skeleton' | 'orc',
  hp: 20 + (index * 5),      // Progressive difficulty
  maxHp: 20 + (index * 5),
  attack: 5 + (index * 2),   // Stronger enemies later
  x, y
}
```

**Item Types**:
```javascript
{
  type: 'health' | 'weapon',
  x, y
}
```

**Rendering**:
- Grid-based display (CSS Grid)
- Each cell renders as:
  - Wall: gray background
  - Floor: white background
  - Player: 🧙 (wizard emoji) - blue
  - Goblins: 👹 (green)
  - Skeletons: 💀 (white)
  - Orcs: 👺 (red)
  - Health potions: ❤️ (red heart)
  - Weapons: ⚔️ (crossed swords)

**HUD (Heads-Up Display)**:
- HP bar (visual + numeric)
- Level indicator
- Experience progress
- Attack power
- Current score
- Message log (recent action feedback)

**Game Over Condition**:
- Player HP reaches 0
- Displays final score
- Offers restart option
- Submits score to backend

**Scoring System**:
- Kill enemy: +10 points
- Collect health potion: +5 points
- Collect weapon: +10 points
- Level up: +50 points

---

#### 4. PersonalityQuiz.js

**Game Type**: Interactive quiz

**Description**: 8-question personality assessment that categorizes users into 4 personality types.

**State Management**:
```javascript
const [currentQuestion, setCurrentQuestion] = useState(0)
const [answers, setAnswers] = useState({})
const [result, setResult] = useState(null)
const [quizStarted, setQuizStarted] = useState(false)
```

**Questions Structure**:
```javascript
{
  id: number,
  question: "string",
  options: [
    { text: "string", type: "Intellectual|Social|Creative|Active" },
    // ... 4 options per question
  ]
}
```

**Personality Types**:

1. **The Thinker (Intellectual)**
   - Traits: Analytical, Curious, Logical, Knowledge-seeking
   - Characteristics: Loves learning, systematic problem-solving

2. **The Connector (Social)**
   - Traits: Empathetic, Communicative, Collaborative, People-oriented
   - Characteristics: Values relationships, team player

3. **The Creator (Creative)**
   - Traits: Imaginative, Artistic, Original, Innovative
   - Characteristics: Thinks outside the box, values self-expression

4. **The Achiever (Active)**
   - Traits: Determined, Energetic, Goal-oriented, Results-driven
   - Characteristics: Action-focused, competitive

**Key Functions**:

1. `startQuiz()` - Initialize quiz
   - Sets quizStarted flag
   - Resets to first question
   - Clears previous answers and results

2. `handleAnswer(option)` - Record answer
   - Stores answer with type (personality category)
   - Increments question counter
   - Shows results if last question
   - Updates answers state

3. `calculateResult()` - Determine personality
   - Counts answers by type
   - Finds most common type
   - Retrieves personality data
   - Sets result state
   - Submits score to backend

4. `submitScore()` - Score submission
   - Fixed score: 100 points (completion-based)
   - Includes personality type in metadata

**UI Flow**:
1. Start screen with instructions
2. Question display (1 of 8)
3. Four answer options
4. Progress indicator
5. Results screen showing:
   - Personality type name
   - Description
   - Key traits (badges)
   - Restart button

**Styling**: PersonalityQuiz.css
- Card-based design
- Animated transitions between questions
- Color-coded personality types
- Responsive button grid

---

#### 5. WouldYouRather.js

**Game Type**: Decision-making game

**Description**: 10 "Would You Rather" scenarios with personality insights at the end.

**State Management**:
```javascript
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
const [gameStarted, setGameStarted] = useState(false)
const [answers, setAnswers] = useState([])
const [showResults, setShowResults] = useState(false)
```

**Questions Structure**:
```javascript
{
  id: number,
  optionA: "string",
  optionB: "string"
}
```

**Sample Questions**:
- "Have the ability to fly" vs "Have the ability to become invisible"
- "Always be 10 minutes late" vs "Always be 20 minutes early"
- "Have unlimited money" vs "Have unlimited time"

**Key Functions**:

1. `startGame()` - Initialize game
   - Sets gameStarted flag
   - Resets question index
   - Clears previous answers and results

2. `handleChoice(choice)` - Record choice
   - Stores choice ('A' or 'B')
   - Stores question ID
   - Advances to next question
   - Shows results after question 10

3. `finishGame(finalAnswers)` - Complete game
   - Sets showResults flag
   - Calculates score (10 points per answer = 100 max)
   - Submits score to backend

4. `getPersonalityInsight(answers)` - Analysis
   - Counts A vs B choices
   - Generates personality insight:
     - More A's: "Risk-taker and dreamer"
     - More B's: "Practical and grounded"
     - Balanced: "Balanced decision-maker"

**UI Components**:
- Start screen
- Progress bar (X of 10 questions)
- Two large choice buttons (A and B)
- Results screen:
  - Completion message
  - Total score
  - Personality insight
  - Choice summary
  - Restart button

**Scoring**:
- 10 points per question completed
- Maximum score: 100 points

---

#### 6. Zork.js

**Game Type**: Text adventure (AI-powered)

**Description**: Interactive fiction game powered by OpenAI's GPT-4o-mini model.

**State Management**:
```javascript
const [history, setHistory] = useState([
  "You are standing in an open field west of a white house, with a boarded front door."
])
const [input, setInput] = useState('')
const [loading, setLoading] = useState(false)
```

**Key Functions**:

1. `handleInput(e)` - Track user input
   - Updates input state as user types

2. `handleCommand(e)` - Submit command
   - Prevents form default behavior
   - Validates command (not empty)
   - Sets loading state
   - Sends command to backend API
   - Appends command and response to history
   - Clears input field
   - Handles network errors

**Backend Integration**:
- Endpoint: `POST /api/zork`
- Sends: `{ input: "command" }`
- Receives: `{ response: "game response" }`

**AI Model Behavior**:
- System prompt: "You are playing the game Zork. Respond only with game actions and descriptions."
- Model: GPT-4o-mini
- Maintains context through conversation history
- Generates dynamic responses

**UI Components**:
- Back button (top-left corner)
- Game title
- History display (scrollable)
  - Shows all commands and responses
  - User commands prefixed with ">"
  - AI responses in standard text
- Command input form
  - Text input field
  - "Go" submit button
  - Disabled during API calls

**Example Interaction**:
```
> go north
You move northward through the dense forest. The trees tower above you.

> look around
You see a rusty sword lying on the ground and a narrow path to the east.

> take sword
You pick up the sword. It feels heavy but well-balanced.
```

**Styling**:
- Dark terminal aesthetic (#222 background)
- Green/white text (classic adventure game look)
- Monospace font option
- Command history scrolls automatically

**Note**: Does not save scores (pure narrative experience).

---

### Utility Files

#### utils/logger.js

**Purpose**: Centralized logging configuration using loglevel library.

**Configuration**:
```javascript
import log from 'loglevel';

log.setLevel('info');  // Log levels: trace, debug, info, warn, error

export default log;
```

**Usage**:
```javascript
import log from '../../utils/logger';

log.info('Game started');
log.warn('Low health warning');
log.error('Failed to fetch scores', error);
```

**Log Levels**:
- **trace**: Detailed debugging (not used in production)
- **debug**: Debugging information
- **info**: General information (default)
- **warn**: Warning messages
- **error**: Error messages

**Benefits**:
- Consistent logging across application
- Easy to change log level globally
- Can be configured differently for dev/prod
- Better than console.log for production apps

---

### Styling Files

#### App.css

**Purpose**: Global styles and common component styles.

**Key Style Classes**:

1. **Layout Containers**:
```css
.App                    /* Min-height 100vh */
.hub-container          /* Flexbox layout for sidebar + main */
.sidebar                /* Fixed width 280px, scrollable */
.main-content           /* Flex-grow content area */
```

2. **Hub Components**:
```css
.hub-header             /* Centered header with title */
.user-info              /* User welcome message and logout */
.logout-btn             /* Semi-transparent white button */
.games-grid             /* Responsive grid for game cards */
.game-card              /* Individual game card with hover */
.game-icon              /* Large emoji display */
```

3. **Scores Sidebar**:
```css
.score-item             /* Individual score card */
                        /* Gray background, purple left border */
```

4. **Authentication Pages**:
```css
.auth-container         /* Centered form container */
.auth-form              /* Form styling with shadow */
.form-group             /* Input field container */
.submit-btn             /* Primary action button */
.error-message          /* Red error alert box */
.auth-link              /* Link to other auth page */
```

5. **Game Common Styles**:
```css
.back-btn               /* Back to hub button */
                        /* Semi-transparent white, top position */
.game-header            /* Game title area */
.game-content           /* White content box for games */
```

**Color Scheme**:
- Primary: `#667eea` (purple-blue)
- Background: Gradient (purple to teal)
- Cards: White with shadows
- Text: Dark gray (#333) on light, white on dark

**Responsive Design**:
- Mobile-first approach
- Flexible grid layouts
- Breakpoints for tablets and desktops
- Touch-friendly button sizes

---

### Individual Game CSS Files

Each game has its own CSS file for specific styling:

- **Sudoku.css**: Grid layouts, cell borders, number pad
- **RocketMans.css**: Canvas container, overlay messages
- **DungeonCrawler.css**: Grid-based dungeon, HUD styling
- **PersonalityQuiz.css**: Question cards, option buttons
- **WouldYouRather.css**: Choice buttons, results display
- **Zork.css**: Terminal-style text adventure interface

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────────────┐
│        User             │
├─────────────────────────┤
│ id (PK)                 │
│ username (UNIQUE)       │
│ email (UNIQUE)          │
│ password_hash           │
│ created_at              │
└───────────┬─────────────┘
            │
            │ 1:N (One user has many scores)
            │
            ▼
┌─────────────────────────┐
│        Score            │
├─────────────────────────┤
│ id (PK)                 │
│ user_id (FK)            │
│ game_name               │
│ score                   │
│ score_metadata          │
│ created_at              │
└─────────────────────────┘
```

### Table Schemas

#### User Table
```sql
CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes**:
- Primary key on `id`
- Unique index on `username`
- Unique index on `email`

**Constraints**:
- Username must be unique
- Email must be unique
- All fields except `created_at` are required

#### Score Table
```sql
CREATE TABLE score (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    game_name VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    score_metadata VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);
```

**Indexes**:
- Primary key on `id`
- Foreign key on `user_id` references `user(id)`
- Composite index on `(user_id, game_name)` for efficient queries

**Constraints**:
- user_id must reference valid user
- game_name and score are required
- score_metadata is optional

### Sample Data

**Users**:
```sql
INSERT INTO user (username, email, password_hash) VALUES
('john_doe', 'john@example.com', '$2b$12$hashed_password_here'),
('jane_smith', 'jane@example.com', '$2b$12$another_hashed_password');
```

**Scores**:
```sql
INSERT INTO score (user_id, game_name, score, score_metadata) VALUES
(1, 'Sudoku', 850, 'Completed in 120 seconds'),
(1, 'RocketMans', 340, ''),
(2, 'Dungeon Crawler', 275, 'Level 3, 10 enemies defeated');
```

---

## Security & Authentication

### Password Security

**Hashing Algorithm**: bcrypt

**Process**:
1. User provides password during registration
2. Backend generates salt using `bcrypt.gensalt()`
3. Password hashed with salt: `bcrypt.hashpw(password, salt)`
4. Hash stored in database (original password discarded)
5. On login, provided password hashed and compared with stored hash

**Benefits**:
- One-way hashing (cannot reverse)
- Unique salt per password
- Computationally expensive (prevents brute force)
- Industry-standard algorithm

**Example**:
```python
# Registration
password_hash = bcrypt.hashpw('mypassword'.encode('utf-8'), bcrypt.gensalt())
# Stores: $2b$12$randomsalthere$hashedpasswordhere

# Login verification
is_valid = bcrypt.checkpw('mypassword'.encode('utf-8'), stored_hash)
```

### JWT Authentication

**Token Structure**:
```
Header.Payload.Signature
```

**Header**:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload**:
```json
{
  "sub": 123,          // User ID
  "iat": 1699900000,   // Issued at timestamp
  "exp": 1699986400,   // Expiration timestamp (24 hours)
  "type": "access"
}
```

**Signature**:
- HMAC-SHA256 hash of header + payload
- Signed with `JWT_SECRET_KEY`
- Ensures token integrity

**Token Flow**:
1. User logs in with credentials
2. Backend validates credentials
3. Backend generates JWT token with user ID in payload
4. Frontend stores token in localStorage
5. Frontend includes token in Authorization header for protected routes
6. Backend validates token signature and expiration
7. Backend extracts user ID from token payload
8. Backend processes request with authenticated user context

**Token Storage**:
- **Frontend**: localStorage
- **Key**: 'token'
- **Format**: Bearer token

**Protected Routes**:
- `/api/user` (GET)
- `/api/scores` (GET, POST)

**Security Considerations**:
- Tokens expire after 24 hours
- HTTPS recommended in production
- Tokens should be revoked on logout (frontend clears localStorage)
- Secret keys should be strong and kept confidential

---

## Development Workflow

### Local Development Setup

#### Prerequisites
- Python 3.8+ installed
- Node.js 14+ and npm installed
- Git for version control
- Code editor (VS Code recommended)

#### Backend Setup
```powershell
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1  # Windows PowerShell
# OR
source venv/bin/activate      # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
# Add the following variables:
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
DATABASE_URL=sqlite:///gamehub.db
OPENAI_API_KEY=your-openai-api-key  # For Zork game

# Run Flask server
python app.py

# Server runs on http://localhost:5000
```

#### Frontend Setup
```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Server runs on http://localhost:3000
# Automatically opens in browser
```

### Development Workflow

1. **Start Both Servers**:
   - Terminal 1: Backend (Flask on port 5000)
   - Terminal 2: Frontend (React on port 3000)

2. **Make Changes**:
   - Backend: Modify Python files (auto-reload disabled by default)
   - Frontend: Modify JS/CSS files (hot reload enabled)

3. **Test Changes**:
   - Open browser to http://localhost:3000
   - Use browser DevTools for debugging
   - Check Network tab for API calls
   - Check Console for React errors

4. **Database Changes**:
   - Modify models in `app.py`
   - Delete `gamehub.db` to reset database
   - Restart backend (tables auto-created)

### Building for Production

#### Backend
```powershell
# Use production WSGI server (gunicorn)
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Set environment variables for production
export FLASK_ENV=production
export DATABASE_URL=postgresql://...  # Use PostgreSQL in production
```

#### Frontend
```powershell
# Create production build
npm run build

# Builds to /build directory
# Optimized, minified, ready for deployment

# Serve with static file server
npm install -g serve
serve -s build -p 3000
```

### Deployment Options

#### Option 1: Heroku
- Backend: Deploy as Python app
- Frontend: Deploy as static site or Node app
- Database: Heroku Postgres addon

#### Option 2: AWS
- Backend: AWS Elastic Beanstalk or EC2
- Frontend: S3 + CloudFront
- Database: RDS (PostgreSQL)

#### Option 3: DigitalOcean
- Backend: Droplet with Flask app
- Frontend: App Platform or Droplet
- Database: Managed PostgreSQL

### Environment Variables

**Backend (.env)**:
```
SECRET_KEY=<random-string-min-32-chars>
JWT_SECRET_KEY=<random-string-min-32-chars>
DATABASE_URL=sqlite:///gamehub.db
OPENAI_API_KEY=<your-openai-key>
```

**Frontend**:
- No environment variables needed for development
- Proxy to backend configured in package.json
- Production: Set API base URL

### Testing

**Backend Testing** (future enhancement):
```python
# Unit tests for API endpoints
# Example: pytest tests/

import pytest
from app import app, db

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_register(client):
    response = client.post('/api/register', json={
        'username': 'test',
        'email': 'test@test.com',
        'password': 'password123'
    })
    assert response.status_code == 201
```

**Frontend Testing** (future enhancement):
```javascript
// React Testing Library
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders game hub title', () => {
  render(<App />);
  const titleElement = screen.getByText(/GameHub/i);
  expect(titleElement).toBeInTheDocument();
});
```

---

## API Reference

### Base URL
- Development: `http://localhost:5000`
- Production: `https://your-domain.com`

### Authentication
Most endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/register | No | Register new user |
| POST | /api/login | No | Login user |
| GET | /api/user | Yes | Get current user info |
| GET | /api/scores | Yes | Get user's best scores |
| POST | /api/scores | Yes | Submit new score |
| POST | /api/zork | No | Play Zork text adventure |

### Detailed Endpoint Documentation

#### POST /api/register
Create a new user account.

**Request**:
```json
{
  "username": "string (required, unique)",
  "email": "string (required, unique, valid email)",
  "password": "string (required, min 6 chars)"
}
```

**Response 201**:
```json
{
  "message": "User created successfully",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Errors**:
- 400: Missing required fields
- 400: Username already exists
- 400: Email already exists

---

#### POST /api/login
Authenticate existing user.

**Request**:
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response 200**:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Errors**:
- 400: Missing credentials
- 401: Invalid credentials

---

#### GET /api/user
Get authenticated user information.

**Headers**:
```
Authorization: Bearer <token>
```

**Response 200**:
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

**Errors**:
- 401: Unauthorized (missing/invalid token)
- 404: User not found

---

#### GET /api/scores
Get user's best score for each game.

**Headers**:
```
Authorization: Bearer <token>
```

**Response 200**:
```json
[
  {
    "game_name": "Sudoku",
    "score": 850,
    "score_metadata": "Completed in 120 seconds",
    "created_at": "2025-11-13T10:30:00"
  },
  {
    "game_name": "RocketMans",
    "score": 340,
    "score_metadata": "",
    "created_at": "2025-11-13T11:15:00"
  }
]
```

**Errors**:
- 401: Unauthorized

**Notes**:
- Returns only best score per game
- Sorted by creation date (newest first)
- Empty array if no scores

---

#### POST /api/scores
Submit a new game score.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request**:
```json
{
  "game_name": "string (required)",
  "score": 100 (required, integer),
  "score_metadata": "string (optional)"
}
```

**Response 201**:
```json
{
  "message": "Score added successfully",
  "score": {
    "id": 15,
    "game_name": "Sudoku",
    "score": 850,
    "score_metadata": "Completed in 120 seconds",
    "created_at": "2025-11-13T10:30:00"
  }
}
```

**Errors**:
- 400: Missing required fields
- 401: Unauthorized

**Notes**:
- All scores are saved (not just high scores)
- GET /api/scores returns only best per game
- score_metadata can contain any relevant info

---

#### POST /api/zork
Interact with AI-powered text adventure game.

**Request**:
```json
{
  "input": "string (required)"
}
```

**Response 200**:
```json
{
  "response": "You move north into a dark room. You can barely see anything."
}
```

**Errors**:
- 500: OpenAI API error

**Notes**:
- No authentication required
- Powered by OpenAI GPT-4o-mini
- Each request is independent (no state persistence)
- Requires OPENAI_API_KEY environment variable

---

## Troubleshooting Guide

### Common Issues

#### Backend won't start
**Error**: `ModuleNotFoundError: No module named 'flask'`
**Solution**: 
```powershell
pip install -r requirements.txt
```

#### Database errors
**Error**: `sqlite3.OperationalError: no such table: user`
**Solution**: Delete `gamehub.db` and restart backend to recreate tables.

#### CORS errors
**Error**: `Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy`
**Solution**: Ensure Flask-CORS is installed and configured in `app.py`.

#### Frontend won't connect to backend
**Error**: Network errors or 404s
**Solution**: 
- Check backend is running on port 5000
- Check `package.json` has `"proxy": "http://localhost:5000"`
- Restart frontend dev server

#### JWT token errors
**Error**: `401 Unauthorized` on protected routes
**Solution**:
- Check token is stored in localStorage
- Check token hasn't expired (24 hour limit)
- Log out and log back in to get fresh token

#### Zork game not working
**Error**: 500 error or no response
**Solution**:
- Check `OPENAI_API_KEY` is set in `.env`
- Verify API key is valid and has credits
- Check OpenAI API status

---

## Future Enhancements

### Planned Features

1. **Leaderboards**
   - Global leaderboards for each game
   - Friends leaderboards
   - Time-based leaderboards (daily, weekly, monthly)

2. **Social Features**
   - Friend system
   - Challenge friends to beat scores
   - Share achievements on social media

3. **User Profiles**
   - Profile pictures/avatars
   - Customizable themes
   - Achievement badges
   - Statistics and progress tracking

4. **More Games**
   - Chess
   - Tic-Tac-Toe (multiplayer)
   - Memory card game
   - Trivia quiz

5. **Progressive Web App (PWA)**
   - Offline support
   - Install as mobile app
   - Push notifications for challenges

6. **Enhanced Analytics**
   - Detailed gameplay statistics
   - Performance graphs over time
   - Personalized recommendations

7. **Multiplayer Support**
   - Real-time multiplayer games
   - WebSocket integration
   - Turn-based game modes

8. **Mobile App**
   - React Native version
   - iOS and Android support
   - Native game controls

### Technical Improvements

1. **Testing**
   - Unit tests for backend API
   - Integration tests
   - End-to-end testing with Cypress
   - Test coverage > 80%

2. **Performance**
   - Database indexing optimization
   - Redis caching for leaderboards
   - CDN for static assets
   - Code splitting for React app

3. **Security**
   - Rate limiting on API endpoints
   - Input sanitization
   - CSRF protection
   - Security headers (helmet.js)

4. **DevOps**
   - CI/CD pipeline (GitHub Actions)
   - Automated testing
   - Automated deployment
   - Docker containerization

5. **Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring
   - User analytics
   - Server health checks

---

## License

This project is proprietary software developed for Team-4.

## Contributors

- Development Team: Team-4
- Documentation: AI Assistant

## Contact

For questions or support, contact the development team.

---

**Last Updated**: November 14, 2025
**Version**: 1.0.0
**Status**: Active Development
