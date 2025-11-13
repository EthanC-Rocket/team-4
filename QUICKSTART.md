# Quick Start Guide - Sudoku Game

## Instant Play

1. **Navigate to the project directory:**
   ```bash
   cd "c:\Users\odurosinmi\OneDrive - Rocket Software, Inc\Desktop\AI Adaptation\Sudoku\team-4"
   ```

2. **Run the game:**
   ```bash
   python main.py
   ```

3. **Choose your difficulty** (Easy, Medium, or Hard)

4. **Play using these commands:**
   - `place 3 5 7` - Place number 7 at row 3, column 5
   - `clear 3 5` - Clear the cell at row 3, column 5
   - `hint` - Get a hint
   - `check` - Verify your solution
   - `help` - Show all commands
   - `quit` - Exit game

## Example Game Session

```
> place 1 3 4    # Place 4 at position (1,3)
> place 2 5 7    # Place 7 at position (2,5)
> hint           # Get a hint if stuck
> check          # Check if solution is valid
```

## Testing the Installation

Quick test to verify everything works:

```bash
python -c "from Sudoku.game import SudokuGame; print('✓ Sudoku game ready!')"
```

## Running Tests

If you have pytest installed:

```bash
# Install testing dependencies
pip install -r requirements.txt

# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=Sudoku
```

## Integration Example

To use in your own Python project:

```python
from Sudoku.game import SudokuGame

# Start a game
game = SudokuGame()
game.play()
```

Or generate puzzles programmatically:

```python
from Sudoku.generator import generate_puzzle
from Sudoku.board import SudokuBoard

# Generate an easy puzzle
puzzle = generate_puzzle("easy")
board = SudokuBoard(puzzle)
board.display()
```

## Troubleshooting

**Issue:** `ModuleNotFoundError: No module named 'Sudoku'`
- **Solution:** Make sure you're running from the project root directory

**Issue:** Game doesn't display correctly
- **Solution:** Ensure your terminal supports UTF-8 encoding

**Issue:** Need to clear terminal screen
- **Solution:** The game automatically clears screen between moves

## Next Steps

- Read the full documentation in `README.md`
- Explore the code in the `Sudoku/` directory
- Check out the tests in `tests/` for usage examples
- Try modifying difficulty levels or adding new features

---

**Ready to play? Run `python main.py` now!** 🎮
