<<<<<<< HEAD
# Sudoku Game

A beginner-friendly console-based Sudoku game written in Python. This implementation features clean, modular code with comprehensive comments, making it perfect for learning and easy to integrate into larger game hub projects.

## Features

- **Console-based gameplay** - No GUI required, runs entirely in the terminal
- **Three difficulty levels** - Easy, Medium, and Hard
- **Intelligent puzzle generation** - Creates valid, solvable Sudoku puzzles
- **Backtracking solver** - Ensures all generated puzzles have unique solutions
- **Input validation** - Prevents invalid moves according to Sudoku rules
- **Hint system** - Get help when you're stuck
- **Clean, modular code** - Well-organized modules for easy maintenance and integration
- **Comprehensive comments** - Every function is documented for beginners

## Installation

### Prerequisites
- Python 3.7 or higher

### Setup
1. Clone or download this repository
2. Navigate to the project directory:
```bash
cd team-4
```

3. (Optional) Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

4. No additional dependencies required - uses only Python standard library!

## How to Run

Run the game using:
```bash
python main.py
```

Or directly from the Sudoku package:
```bash
python -m Sudoku.game
```

## How to Play

### Game Rules
- Fill the 9x9 grid so that each row, column, and 3x3 box contains digits 1-9
- Each number can appear only once in each row, column, and 3x3 box
- Some cells are pre-filled and cannot be modified

### Commands

| Command | Description | Example |
|---------|-------------|---------|
| `place <row> <col> <num>` | Place a number at coordinates | `place 3 5 7` |
| `clear <row> <col>` | Clear a cell you filled | `clear 3 5` |
| `hint` | Get a hint (reveals one cell) | `hint` |
| `check` | Validate your current progress | `check` |
| `solve` | Show the complete solution | `solve` |
| `new` | Start a new game | `new` |
| `help` | Show help information | `help` |
| `quit` | Exit the game | `quit` |

### Coordinates
- Rows are numbered 1-9 (top to bottom)
- Columns are numbered 1-9 (left to right)
- Example: `place 1 1 5` places the number 5 in the top-left corner
=======
# GameHub - Multi-Game Platform

A web application featuring a collection of mini-games with user authentication and score tracking. Built with React.js frontend and Python Flask backend.

## Features

- **User Authentication**: Register and login to track your scores
- **Score Tracking**: Your best scores are saved and displayed in the sidebar
- **5 Mini-Games**:
  - 🔢 **Sudoku**: Classic number puzzle game with difficulty levels
  - 🚀 **RocketMans**: Navigate your rocket through obstacles
  - ⚔️ **Dungeon Crawler**: Explore dungeons, fight monsters, and level up
  - 🧠 **Personality Quiz**: Discover your personality type
  - 🤔 **Would You Rather**: Make choices and get personality insights

## Setup Instructions

### Backend Setup (Python Flask)

1. Navigate to the backend directory:
```powershell
cd GameHub\backend
```

2. Create a virtual environment (optional but recommended):
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

3. Install dependencies:
```powershell
pip install -r requirements.txt
```

4. Run the Flask server:
```powershell
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup (React)

1. Navigate to the frontend directory:
```powershell
cd GameHub\frontend
```

2. Install dependencies:
```powershell
npm install
```

3. Install loglevel for logging:
```powershell
npm install loglevel
```

4. Start the React development server:
```powershell
npm start
```

The frontend will run on `http://localhost:3000`

## How to Use

1. **Start both servers** (backend and frontend)
2. **Open your browser** to `http://localhost:3000`
3. **Register an account** or continue as a guest
4. **Click on any game** to start playing
5. **Your scores will be saved** if you're logged in and displayed in the left sidebar

## Game Controls

- **Sudoku**: Click cells to select, use number pad to fill
- **RocketMans**: Press SPACE or ↑ to fly
- **Dungeon Crawler**: Use arrow keys to move and attack
- **Personality Quiz**: Click your preferred answers
- **Would You Rather**: Choose between two options

## Technologies Used

### Frontend
- React 18
- React Router for navigation
- CSS for styling
- Axios for API calls

### Backend
- Flask (Python web framework)
- SQLAlchemy (Database ORM)
- Flask-JWT-Extended (Authentication)
- bcrypt (Password hashing)
- SQLite (Database)
>>>>>>> 1cea002c6abf7ee262d6be7f31dee3301445ad17

## Project Structure

```
<<<<<<< HEAD
team-4/
├── Sudoku/                 # Main package directory
│   ├── __init__.py        # Package initializer
│   ├── board.py           # Board representation and display
│   ├── validator.py       # Sudoku rule validation
│   ├── solver.py          # Backtracking puzzle solver
│   ├── generator.py       # Puzzle generation logic
│   └── game.py            # Main game loop and user interface
├── tests/                 # Test directory
│   ├── __init__.py
│   ├── test_validator.py
│   ├── test_solver.py
│   └── test_generator.py
├── main.py               # Entry point to run the game
├── requirements.txt      # Python dependencies (none for basic version)
└── README.md            # This file
```

## Module Overview

### `board.py`
- `SudokuBoard` class: Manages the game board state
- Handles cell display, modification, and tracking fixed cells

### `validator.py`
- `is_valid_number()`: Checks if a move is legal
- `validate_board()`: Validates entire board for rule violations
- `is_board_solved()`: Checks if puzzle is completely solved

### `solver.py`
- `solve_sudoku()`: Backtracking algorithm to solve puzzles
- `has_unique_solution()`: Ensures puzzle has exactly one solution
- `get_solution()`: Returns solved board without modifying original

### `generator.py`
- `generate_complete_board()`: Creates a filled valid Sudoku board
- `create_puzzle()`: Removes cells to create a puzzle with difficulty levels
- `get_hint()`: Provides hints by revealing solution cells

### `game.py`
- `SudokuGame` class: Main game controller
- Handles user input, game flow, and console interface
- Implements all game commands

## Integration with Game Hub

This Sudoku game is designed to be easily integrated into a larger game hub:

1. **Modular design** - Each module has a single responsibility
2. **Clean API** - Main game logic is encapsulated in the `SudokuGame` class
3. **No global state** - Game state is managed within class instances
4. **Minimal dependencies** - Uses only Python standard library

### Integration Example

```python
from Sudoku.game import SudokuGame

# Create and start a game
game = SudokuGame()
game.play()

# Or use individual components
from Sudoku.generator import generate_puzzle
from Sudoku.board import SudokuBoard

puzzle = generate_puzzle("easy")
board = SudokuBoard(puzzle)
board.display()
```

## Testing

Run the test suite using pytest:

```bash
pytest tests/
```

Run tests with coverage:

```bash
pytest tests/ --cov=Sudoku --cov-report=html
```

## Algorithm Details

### Puzzle Generation
1. Start with an empty 9x9 grid
2. Fill the grid randomly using backtracking
3. Remove cells based on difficulty level
4. Verify the puzzle has a unique solution

### Backtracking Solver
1. Find an empty cell
2. Try numbers 1-9 in that cell
3. Check if the number is valid (doesn't violate rules)
4. Recursively solve the rest of the puzzle
5. If stuck, backtrack and try the next number

### Validation
- Row check: Ensure no duplicates in each row
- Column check: Ensure no duplicates in each column
- Box check: Ensure no duplicates in each 3x3 box

## Difficulty Levels

- **Easy**: 30-35 cells removed (46-51 cells filled)
- **Medium**: 40-45 cells removed (36-41 cells filled)
- **Hard**: 50-55 cells removed (26-31 cells filled)

## Future Enhancements

Potential features for future versions:
- Save/load game progress
- Timer and scoring system
- Leaderboard
- Additional puzzle strategies (beyond backtracking)
- Web interface using Flask/FastAPI
- Multiplayer mode
- Daily challenges

## Contributing

Contributions are welcome! Please ensure:
- Code follows the existing style and structure
- All functions have docstrings
- Tests are included for new features
- README is updated for new functionality

## License

This project is provided as-is for educational and entertainment purposes.

## Acknowledgments

- Inspired by the classic Sudoku puzzle game
- Uses backtracking algorithm for puzzle solving
- Designed for integration with game hub architectures

---

**Enjoy playing Sudoku!** 🎮
=======
GameHub/
├── backend/
│   ├── app.py              # Flask application and API routes
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Environment variables
│   └── gamehub.db         # SQLite database (created automatically)
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Hub.js           # Main game hub
    │   │   ├── Login.js         # Login form
    │   │   ├── Register.js      # Registration form
    │   │   └── games/
    │   │       ├── Sudoku.js
    │   │       ├── RocketMans.js
    │   │       ├── DungeonCrawler.js
    │   │       ├── PersonalityQuiz.js
    │   │       └── WouldYouRather.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `GET /api/user` - Get current user info
- `GET /api/scores` - Get user's scores
- `POST /api/scores` - Submit a new score

## Notes

- The database is created automatically on first run
- Scores are saved only for registered users
- Guest users can play all games but scores won't be saved
- The app uses JWT tokens for authentication

## Future Enhancements

- Leaderboards for each game
- Multiplayer support
- More games
- User profiles and avatars
- Social features (friends, challenges)

Enjoy playing! 🎮
>>>>>>> 1cea002c6abf7ee262d6be7f31dee3301445ad17
