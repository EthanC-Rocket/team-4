"""
Sudoku Game Module
Main game logic and console interface for the Sudoku game.
"""

from Sudoku.board import SudokuBoard
from Sudoku.generator import generate_puzzle, get_hint
from Sudoku.validator import is_valid_number, validate_board, is_board_solved
from Sudoku.solver import get_solution
import os


class SudokuGame:
    """
    Main Sudoku game class that handles game flow and user interaction.
    
    Attributes:
        board (SudokuBoard): The game board
        solution (list): The solution to the current puzzle
        difficulty (str): Current difficulty level
        hints_used (int): Number of hints used in current game
    """
    
    def __init__(self):
        """Initialize a new Sudoku game."""
        self.board = None
        self.solution = None
        self.difficulty = "medium"
        self.hints_used = 0
    
    def clear_screen(self):
        """Clear the console screen for better display."""
        os.system('cls' if os.name == 'nt' else 'clear')
    
    def show_welcome(self):
        """Display welcome message and game instructions."""
        self.clear_screen()
        print("=" * 60)
        print(" " * 18 + "WELCOME TO SUDOKU!")
        print("=" * 60)
        print("\nHow to play:")
        print("  - Fill the 9x9 grid so each row, column, and 3x3 box")
        print("    contains digits 1-9 without repetition")
        print("  - Use coordinates (row, column) to place numbers")
        print("  - Rows and columns are numbered 1-9")
        print("\nCommands:")
        print("  place <row> <col> <num> - Place a number (e.g., 'place 3 5 7')")
        print("  clear <row> <col>       - Clear a cell (e.g., 'clear 3 5')")
        print("  hint                     - Get a hint (reveals one cell)")
        print("  check                    - Check if your solution is valid")
        print("  solve                    - Show the complete solution")
        print("  new                      - Start a new game")
        print("  quit                     - Exit the game")
        print("=" * 60)
    
    def choose_difficulty(self):
        """
        Let the user choose the difficulty level.
        
        Returns:
            str: Chosen difficulty level
        """
        while True:
            print("\nChoose difficulty:")
            print("  1. Easy")
            print("  2. Medium")
            print("  3. Hard")
            
            choice = input("\nEnter your choice (1-3): ").strip()
            
            if choice == "1":
                return "easy"
            elif choice == "2":
                return "medium"
            elif choice == "3":
                return "hard"
            else:
                print("Invalid choice. Please enter 1, 2, or 3.")
    
    def new_game(self):
        """Start a new Sudoku game."""
        self.difficulty = self.choose_difficulty()
        self.hints_used = 0
        
        print(f"\nGenerating a {self.difficulty} puzzle...")
        
        # Generate a new puzzle
        puzzle = generate_puzzle(self.difficulty)
        self.board = SudokuBoard(puzzle)
        
        # Get and store the solution
        self.solution = get_solution(puzzle)
        
        print("Puzzle generated! Good luck!")
        input("\nPress Enter to start playing...")
    
    def display_game(self):
        """Display the current game state."""
        self.clear_screen()
        print(f"\nDifficulty: {self.difficulty.upper()} | Hints used: {self.hints_used}")
        self.board.display()
    
    def process_command(self, command):
        """
        Process a user command.
        
        Args:
            command (str): User input command
        
        Returns:
            bool: True to continue game, False to quit
        """
        parts = command.strip().lower().split()
        
        if not parts:
            return True
        
        cmd = parts[0]
        
        # Quit command
        if cmd in ["quit", "exit", "q"]:
            return False
        
        # New game command
        elif cmd == "new":
            confirm = input("Start a new game? Current progress will be lost (y/n): ")
            if confirm.lower() == 'y':
                self.new_game()
            return True
        
        # Place number command
        elif cmd == "place" or cmd == "p":
            if len(parts) != 4:
                print("Usage: place <row> <col> <number>")
                input("Press Enter to continue...")
                return True
            
            try:
                row = int(parts[1]) - 1  # Convert to 0-indexed
                col = int(parts[2]) - 1
                num = int(parts[3])
                
                # Validate coordinates
                if not (0 <= row <= 8 and 0 <= col <= 8):
                    print("Row and column must be between 1 and 9!")
                    input("Press Enter to continue...")
                    return True
                
                # Check if cell is fixed
                if self.board.is_cell_fixed(row, col):
                    print("Cannot modify this cell - it's part of the original puzzle!")
                    input("Press Enter to continue...")
                    return True
                
                # Validate the number
                if not is_valid_number(self.board.grid, row, col, num):
                    print(f"Cannot place {num} at ({row+1}, {col+1}) - violates Sudoku rules!")
                    input("Press Enter to continue...")
                    return True
                
                # Place the number
                self.board.set_cell(row, col, num)
                
                # Check if puzzle is solved
                if self.board.is_complete():
                    if is_board_solved(self.board.grid):
                        self.display_game()
                        print("\n" + "=" * 60)
                        print("🎉 CONGRATULATIONS! You solved the puzzle! 🎉")
                        print("=" * 60)
                        print(f"Hints used: {self.hints_used}")
                        input("\nPress Enter to continue...")
                        return False
                    else:
                        print("Puzzle is complete but has errors. Check your solution!")
                        input("Press Enter to continue...")
                
            except ValueError:
                print("Invalid input! Use numbers only.")
                input("Press Enter to continue...")
            
            return True
        
        # Clear cell command
        elif cmd == "clear" or cmd == "c":
            if len(parts) != 3:
                print("Usage: clear <row> <col>")
                input("Press Enter to continue...")
                return True
            
            try:
                row = int(parts[1]) - 1
                col = int(parts[2]) - 1
                
                if not (0 <= row <= 8 and 0 <= col <= 8):
                    print("Row and column must be between 1 and 9!")
                    input("Press Enter to continue...")
                    return True
                
                if self.board.clear_cell(row, col):
                    print(f"Cleared cell ({row+1}, {col+1})")
                else:
                    print("Cannot clear this cell - it's part of the original puzzle!")
                
                input("Press Enter to continue...")
            
            except ValueError:
                print("Invalid input! Use numbers only.")
                input("Press Enter to continue...")
            
            return True
        
        # Hint command
        elif cmd == "hint" or cmd == "h":
            hint = get_hint(self.board.grid, self.solution)
            if hint:
                row, col, value = hint
                self.board.set_cell(row, col, value)
                self.hints_used += 1
                print(f"Hint: Placed {value} at ({row+1}, {col+1})")
            else:
                print("No hints available - puzzle is complete!")
            
            input("Press Enter to continue...")
            return True
        
        # Check solution command
        elif cmd == "check":
            is_valid, message = validate_board(self.board.grid)
            if is_valid:
                print("✓ Your current solution is valid so far!")
            else:
                print(f"✗ Error: {message}")
            
            input("Press Enter to continue...")
            return True
        
        # Show solution command
        elif cmd == "solve":
            confirm = input("Show solution? This will end the current game (y/n): ")
            if confirm.lower() == 'y':
                self.board.grid = self.solution
                self.display_game()
                print("\nHere's the solution!")
                input("Press Enter to continue...")
                return False
            return True
        
        # Help command
        elif cmd == "help":
            self.show_welcome()
            input("\nPress Enter to continue...")
            return True
        
        # Unknown command
        else:
            print(f"Unknown command: {cmd}")
            print("Type 'help' to see available commands.")
            input("Press Enter to continue...")
            return True
    
    def play(self):
        """Main game loop."""
        self.show_welcome()
        self.new_game()
        
        playing = True
        while playing:
            self.display_game()
            print("\nEnter command (or 'help' for instructions):")
            command = input("> ")
            playing = self.process_command(command)
        
        print("\nThanks for playing Sudoku! Goodbye!")


def main():
    """Entry point for the Sudoku game."""
    game = SudokuGame()
    game.play()


if __name__ == "__main__":
    main()
