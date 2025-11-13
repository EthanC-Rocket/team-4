"""
Sudoku Generator Module
Creates valid Sudoku puzzles with different difficulty levels.
"""

import random
import copy
from Sudoku.solver import solve_sudoku, has_unique_solution
from Sudoku.validator import is_valid_number


def generate_complete_board():
    """
    Generate a completely filled valid Sudoku board.
    
    Uses a randomized approach:
    1. Start with an empty board
    2. Fill cells with random valid numbers
    3. Use backtracking to complete the board
    
    Returns:
        list: A complete valid 9x9 Sudoku board
    """
    # Create an empty board
    board = [[0 for _ in range(9)] for _ in range(9)]
    
    # Fill the board using a modified solving algorithm with randomization
    fill_board(board)
    
    return board


def fill_board(board):
    """
    Fill an empty board with valid numbers using randomized backtracking.
    
    Args:
        board (list): 9x9 2D list to fill
    
    Returns:
        bool: True if board was filled successfully
    """
    # Find an empty cell
    for i in range(9):
        for j in range(9):
            if board[i][j] == 0:
                # Try numbers in random order to create variety
                numbers = list(range(1, 10))
                random.shuffle(numbers)
                
                for num in numbers:
                    if is_valid_number(board, i, j, num):
                        board[i][j] = num
                        
                        if fill_board(board):
                            return True
                        
                        # Backtrack if needed
                        board[i][j] = 0
                
                return False
    
    # All cells filled successfully
    return True


def create_puzzle(difficulty="medium"):
    """
    Create a Sudoku puzzle by removing numbers from a complete board.
    
    Difficulty levels determine how many cells are removed:
    - Easy: 30-35 cells removed (46-51 filled)
    - Medium: 40-45 cells removed (36-41 filled)
    - Hard: 50-55 cells removed (26-31 filled)
    
    Args:
        difficulty (str): Difficulty level - "easy", "medium", or "hard"
    
    Returns:
        list: A 9x9 Sudoku puzzle board with empty cells (marked as 0)
    """
    # Generate a complete board
    board = generate_complete_board()
    
    # Determine how many cells to remove based on difficulty
    if difficulty.lower() == "easy":
        cells_to_remove = random.randint(30, 35)
    elif difficulty.lower() == "hard":
        cells_to_remove = random.randint(50, 55)
    else:  # medium
        cells_to_remove = random.randint(40, 45)
    
    # Create a copy to work with
    puzzle = copy.deepcopy(board)
    
    # Remove cells while ensuring unique solution
    removed = 0
    attempts = 0
    max_attempts = cells_to_remove * 10
    
    while removed < cells_to_remove and attempts < max_attempts:
        # Pick a random cell
        row = random.randint(0, 8)
        col = random.randint(0, 8)
        
        # If cell is not already empty
        if puzzle[row][col] != 0:
            # Store the value temporarily
            backup = puzzle[row][col]
            puzzle[row][col] = 0
            
            # Check if puzzle still has a unique solution
            # (for harder puzzles, we skip this check to save time)
            if difficulty.lower() == "hard" or has_unique_solution(puzzle):
                removed += 1
            else:
                # Restore the value if it leads to multiple solutions
                puzzle[row][col] = backup
        
        attempts += 1
    
    return puzzle


def generate_puzzle(difficulty="medium"):
    """
    Public function to generate a Sudoku puzzle.
    
    Args:
        difficulty (str): Difficulty level - "easy", "medium", or "hard"
    
    Returns:
        list: A 9x9 Sudoku puzzle board
    """
    return create_puzzle(difficulty)


def get_hint(board, solution):
    """
    Get a hint by revealing one empty cell from the solution.
    
    Args:
        board (list): Current puzzle board
        solution (list): Solved board
    
    Returns:
        tuple: (row, col, value) for the hint, or None if board is complete
    """
    empty_cells = []
    
    # Find all empty cells
    for i in range(9):
        for j in range(9):
            if board[i][j] == 0:
                empty_cells.append((i, j))
    
    if not empty_cells:
        return None
    
    # Pick a random empty cell
    row, col = random.choice(empty_cells)
    value = solution[row][col]
    
    return (row, col, value)
