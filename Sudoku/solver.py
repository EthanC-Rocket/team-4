"""
Sudoku Solver Module
Implements backtracking algorithm to solve Sudoku puzzles.
"""

from Sudoku.validator import is_valid_number, find_empty_cell
import copy


def solve_sudoku(board):
    """
    Solve a Sudoku puzzle using backtracking algorithm.
    
    Backtracking is a recursive approach that:
    1. Finds an empty cell
    2. Tries numbers 1-9 in that cell
    3. For each valid number, recursively tries to solve the rest
    4. If a dead-end is reached, backtracks and tries the next number
    
    Args:
        board (list): 9x9 2D list representing the board (will be modified)
    
    Returns:
        bool: True if puzzle is solved, False if no solution exists
    """
    # Find the next empty cell
    empty = find_empty_cell(board)
    
    # If no empty cell is found, the puzzle is solved
    if empty is None:
        return True
    
    row, col = empty
    
    # Try numbers 1-9 in the empty cell
    for num in range(1, 10):
        # Check if placing this number is valid
        if is_valid_number(board, row, col, num):
            # Place the number
            board[row][col] = num
            
            # Recursively try to solve the rest of the puzzle
            if solve_sudoku(board):
                return True
            
            # If recursion didn't lead to a solution, backtrack
            # (undo the placement and try the next number)
            board[row][col] = 0
    
    # If no number worked, return False to trigger backtracking
    return False


def has_unique_solution(board):
    """
    Check if a Sudoku puzzle has exactly one solution.
    
    Args:
        board (list): 9x9 2D list representing the board
    
    Returns:
        bool: True if puzzle has exactly one solution, False otherwise
    """
    board_copy = copy.deepcopy(board)
    solutions = []
    
    def count_solutions(board, max_solutions=2):
        """Helper function to count solutions (stops at max_solutions)."""
        if len(solutions) >= max_solutions:
            return
        
        empty = find_empty_cell(board)
        if empty is None:
            solutions.append(copy.deepcopy(board))
            return
        
        row, col = empty
        for num in range(1, 10):
            if is_valid_number(board, row, col, num):
                board[row][col] = num
                count_solutions(board, max_solutions)
                board[row][col] = 0
    
    count_solutions(board_copy)
    return len(solutions) == 1


def get_solution(board):
    """
    Get the solution to a Sudoku puzzle without modifying the original.
    
    Args:
        board (list): 9x9 2D list representing the board
    
    Returns:
        list: Solved board, or None if no solution exists
    """
    board_copy = copy.deepcopy(board)
    if solve_sudoku(board_copy):
        return board_copy
    return None


def is_solvable(board):
    """
    Check if a Sudoku puzzle is solvable.
    
    Args:
        board (list): 9x9 2D list representing the board
    
    Returns:
        bool: True if puzzle can be solved, False otherwise
    """
    board_copy = copy.deepcopy(board)
    return solve_sudoku(board_copy)
