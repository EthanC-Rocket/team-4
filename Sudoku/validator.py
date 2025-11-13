"""
Sudoku Validator Module
Handles validation of Sudoku board states and moves.
"""


def is_valid_number(board, row, col, num):
    """
    Check if placing a number at a position is valid according to Sudoku rules.
    
    Sudoku rules:
    - Each row must contain unique numbers 1-9
    - Each column must contain unique numbers 1-9
    - Each 3x3 box must contain unique numbers 1-9
    
    Args:
        board (list): 9x9 2D list representing the board
        row (int): Row index (0-8)
        col (int): Column index (0-8)
        num (int): Number to validate (1-9)
    
    Returns:
        bool: True if the number can be placed, False otherwise
    """
    # Check if the number is valid (1-9)
    if num < 1 or num > 9:
        return False
    
    # Check row - ensure num doesn't already exist in this row
    for j in range(9):
        if board[row][j] == num:
            return False
    
    # Check column - ensure num doesn't already exist in this column
    for i in range(9):
        if board[i][col] == num:
            return False
    
    # Check 3x3 box - ensure num doesn't already exist in the box
    # Calculate the top-left corner of the 3x3 box
    box_row = (row // 3) * 3
    box_col = (col // 3) * 3
    
    for i in range(box_row, box_row + 3):
        for j in range(box_col, box_col + 3):
            if board[i][j] == num:
                return False
    
    return True


def validate_board(board):
    """
    Validate the entire Sudoku board for rule violations.
    
    Args:
        board (list): 9x9 2D list representing the board
    
    Returns:
        tuple: (is_valid, error_message)
               is_valid (bool): True if board is valid, False otherwise
               error_message (str): Description of the error if invalid
    """
    # Check each row for duplicates
    for i in range(9):
        row_numbers = [board[i][j] for j in range(9) if board[i][j] != 0]
        if len(row_numbers) != len(set(row_numbers)):
            return False, f"Row {i+1} has duplicate numbers"
    
    # Check each column for duplicates
    for j in range(9):
        col_numbers = [board[i][j] for i in range(9) if board[i][j] != 0]
        if len(col_numbers) != len(set(col_numbers)):
            return False, f"Column {j+1} has duplicate numbers"
    
    # Check each 3x3 box for duplicates
    for box_row in range(0, 9, 3):
        for box_col in range(0, 9, 3):
            box_numbers = []
            for i in range(box_row, box_row + 3):
                for j in range(box_col, box_col + 3):
                    if board[i][j] != 0:
                        box_numbers.append(board[i][j])
            
            if len(box_numbers) != len(set(box_numbers)):
                box_num = (box_row // 3) * 3 + (box_col // 3) + 1
                return False, f"Box {box_num} has duplicate numbers"
    
    return True, "Board is valid"


def is_board_solved(board):
    """
    Check if the Sudoku board is completely and correctly solved.
    
    Args:
        board (list): 9x9 2D list representing the board
    
    Returns:
        bool: True if board is fully solved, False otherwise
    """
    # Check if board is complete (no empty cells)
    for row in board:
        if 0 in row:
            return False
    
    # Validate the completed board
    is_valid, _ = validate_board(board)
    return is_valid


def find_empty_cell(board):
    """
    Find the first empty cell (with value 0) in the board.
    
    Args:
        board (list): 9x9 2D list representing the board
    
    Returns:
        tuple: (row, col) of the empty cell, or None if board is full
    """
    for i in range(9):
        for j in range(9):
            if board[i][j] == 0:
                return (i, j)
    return None
