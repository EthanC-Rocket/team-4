"""
Sudoku Board Module
Handles the Sudoku board representation and display.
"""

import copy


class SudokuBoard:
    """
    Represents a 9x9 Sudoku board.
    
    Attributes:
        grid (list): 2D list representing the Sudoku board
        initial_grid (list): Copy of the original puzzle (marks which cells are fixed)
    """
    
    def __init__(self, grid=None):
        """
        Initialize a Sudoku board.
        
        Args:
            grid (list, optional): 9x9 2D list. 0 represents empty cells.
                                   If None, creates an empty board.
        """
        if grid is None:
            # Create an empty 9x9 board
            self.grid = [[0 for _ in range(9)] for _ in range(9)]
        else:
            self.grid = copy.deepcopy(grid)
        
        # Store the initial state to know which cells are fixed
        self.initial_grid = copy.deepcopy(self.grid)
    
    def display(self):
        """
        Display the Sudoku board in a formatted console view.
        Shows the grid with visual separators for 3x3 boxes.
        """
        print("\n   " + "  ".join(str(i) for i in range(1, 10)))
        print("  +" + "---+" * 9)
        
        for i in range(9):
            # Print row number
            print(f"{i+1} |", end="")
            
            for j in range(9):
                # Print cell value (or space if empty)
                value = self.grid[i][j]
                cell = str(value) if value != 0 else " "
                print(f" {cell} |", end="")
            
            print()
            print("  +" + "---+" * 9)
    
    def is_cell_fixed(self, row, col):
        """
        Check if a cell is part of the original puzzle (cannot be modified).
        
        Args:
            row (int): Row index (0-8)
            col (int): Column index (0-8)
        
        Returns:
            bool: True if the cell is fixed, False otherwise
        """
        return self.initial_grid[row][col] != 0
    
    def get_cell(self, row, col):
        """
        Get the value at a specific cell.
        
        Args:
            row (int): Row index (0-8)
            col (int): Column index (0-8)
        
        Returns:
            int: Value at the cell (0 if empty)
        """
        return self.grid[row][col]
    
    def set_cell(self, row, col, value):
        """
        Set a value at a specific cell.
        
        Args:
            row (int): Row index (0-8)
            col (int): Column index (0-8)
            value (int): Value to set (0-9)
        
        Returns:
            bool: True if successful, False if cell is fixed
        """
        if self.is_cell_fixed(row, col):
            return False
        
        self.grid[row][col] = value
        return True
    
    def is_complete(self):
        """
        Check if the board is completely filled (no empty cells).
        
        Returns:
            bool: True if board has no empty cells, False otherwise
        """
        for row in self.grid:
            if 0 in row:
                return False
        return True
    
    def clear_cell(self, row, col):
        """
        Clear a cell (set to 0) if it's not fixed.
        
        Args:
            row (int): Row index (0-8)
            col (int): Column index (0-8)
        
        Returns:
            bool: True if successful, False if cell is fixed
        """
        return self.set_cell(row, col, 0)
