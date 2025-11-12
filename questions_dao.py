import json
import random
from typing import List, Dict, Optional


class QuestionsDAO:
    """Data Access Object for managing Would You Rather questions."""
    
    def __init__(self, json_file: str = "would-you-rather-questions.json"):
        """
        Initialize the DAO with the path to the JSON file.
        
        Args:
            json_file: Path to the JSON file containing questions
        """
        self.json_file = json_file
        self.questions = self._load_questions()
    
    def _load_questions(self) -> List[Dict]:
        """Load questions from the JSON file."""
        try:
            with open(self.json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('questions', [])
        except FileNotFoundError:
            print(f"File {self.json_file} not found. Starting with empty question list.")
            return []
        except json.JSONDecodeError:
            print(f"Error decoding JSON from {self.json_file}. Starting with empty question list.")
            return []
    
    def _save_questions(self) -> None:
        """Save questions to the JSON file."""
        with open(self.json_file, 'w', encoding='utf-8') as f:
            json.dump({'questions': self.questions}, f, indent=2, ensure_ascii=False)
    
    def _get_next_id(self) -> int:
        """Get the next available ID for a new question."""
        if not self.questions:
            return 1
        return max(q['id'] for q in self.questions) + 1
    
    def create_question(self, option1: str, option2: str, category: str, 
                       option1_votes: int = 0, option2_votes: int = 0) -> Dict:
        """
        Create a new question and add it to the collection.
        
        Args:
            option1: First option text
            option2: Second option text
            category: Question category
            option1_votes: Initial votes for option 1 (default: 0)
            option2_votes: Initial votes for option 2 (default: 0)
        
        Returns:
            The newly created question dictionary
        """
        new_question = {
            'id': self._get_next_id(),
            'option1': option1,
            'option2': option2,
            'category': category,
            'option1Votes': option1_votes,
            'option2Votes': option2_votes
        }
        self.questions.append(new_question)
        self._save_questions()
        return new_question
    
    def get_random_question(self) -> Optional[Dict]:
        """
        Get a random question from the collection.
        
        Returns:
            A random question dictionary, or None if no questions exist
        """
        if not self.questions:
            return None
        return random.choice(self.questions)
    
    def delete_question(self, question_id: int) -> bool:
        """
        Delete a question by its ID.
        
        Args:
            question_id: The ID of the question to delete
        
        Returns:
            True if the question was deleted, False if not found
        """
        for i, question in enumerate(self.questions):
            if question['id'] == question_id:
                self.questions.pop(i)
                self._save_questions()
                return True
        return False
    
    def get_questions_by_category(self, category: str) -> List[Dict]:
        """
        Get all questions in a specific category.
        
        Args:
            category: The category to filter by
        
        Returns:
            List of questions in the specified category
        """
        return [q for q in self.questions if q['category'].lower() == category.lower()]
    
    def get_all_questions(self) -> List[Dict]:
        """
        Get all questions.
        
        Returns:
            List of all questions
        """
        return self.questions.copy()
    
    def get_question_by_id(self, question_id: int) -> Optional[Dict]:
        """
        Get a specific question by its ID.
        
        Args:
            question_id: The ID of the question to retrieve
        
        Returns:
            The question dictionary, or None if not found
        """
        for question in self.questions:
            if question['id'] == question_id:
                return question
        return None
    
    def update_votes(self, question_id: int, option: int) -> bool:
        """
        Increment the vote count for a specific option.
        
        Args:
            question_id: The ID of the question
            option: Which option to vote for (1 or 2)
        
        Returns:
            True if the vote was recorded, False if question not found or invalid option
        """
        question = self.get_question_by_id(question_id)
        if not question:
            return False
        
        if option == 1:
            question['option1Votes'] += 1
        elif option == 2:
            question['option2Votes'] += 1
        else:
            return False
        
        self._save_questions()
        return True
    
    def get_all_categories(self) -> List[str]:
        """
        Get a list of all unique categories.
        
        Returns:
            List of unique category names
        """
        return list(set(q['category'] for q in self.questions))


# Example usage
if __name__ == "__main__":
    # Initialize the DAO
    dao = QuestionsDAO()
    
    # Get a random question
    print("Random question:")
    random_q = dao.get_random_question()
    if random_q:
        print(f"  {random_q['option1']} OR {random_q['option2']}")
        print(f"  Category: {random_q['category']}")
    
    # Get questions by category
    print("\nSuperpowers questions:")
    superpowers = dao.get_questions_by_category("Superpowers")
    for q in superpowers:
        print(f"  ID {q['id']}: {q['option1']} OR {q['option2']}")
    
    # Create a new question
    print("\nCreating a new question...")
    new_q = dao.create_question(
        option1="Always be stuck in traffic",
        option2="Always have a slow internet connection",
        category="Technology"
    )
    print(f"  Created question with ID {new_q['id']}")
    
    # Get all categories
    print("\nAll categories:")
    for cat in dao.get_all_categories():
        print(f"  - {cat}")
