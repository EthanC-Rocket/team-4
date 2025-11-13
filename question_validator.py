from typing import Dict, List, Optional


class QuestionEntity:
    """
    Entity class for Would You Rather questions, with validation logic.
    """
    REQUIRED_FIELDS = ["option1", "option2", "category"]
    DEFAULT_CATEGORIES = [
        "Superpowers", "Entertainment", "Lifestyle", "Time Travel", "Skills",
        "Technology", "Resources", "Food", "Living Arrangements", "Social Skills",
        "Life Control", "Personal Traits", "Basic Needs"
    ]

    def __init__(self, option1: str, option2: str, category: str, option1Votes: int = 0, option2Votes: int = 0, valid_categories: Optional[List[str]] = None):
        self.option1 = option1
        self.option2 = option2
        self.category = category
        self.option1Votes = option1Votes
        self.option2Votes = option2Votes
        self.valid_categories = valid_categories if valid_categories else self.DEFAULT_CATEGORIES
        self.errors = self._validate()

    def _validate(self) -> List[str]:
        errors = []
        # Required fields
        if not str(self.option1).strip():
            errors.append("Missing or empty required field: option1")
        if not str(self.option2).strip():
            errors.append("Missing or empty required field: option2")
        if not str(self.category).strip():
            errors.append("Missing or empty required field: category")
        # Options must be different
        if str(self.option1).strip().lower() == str(self.option2).strip().lower():
            errors.append("Option 1 and Option 2 must be different.")
        # Allow any category (no validity check)
        return errors

    def is_valid(self) -> bool:
        return len(self.errors) == 0

    def to_dict(self) -> Dict:
        return {
            "option1": self.option1,
            "option2": self.option2,
            "category": self.category,
            "option1Votes": self.option1Votes,
            "option2Votes": self.option2Votes
        }

# Example usage
if __name__ == "__main__":
    question = QuestionEntity(
        option1="Eat only pizza for a year",
        option2="Eat only burgers for a year",
        category="Food"
    )
    if question.is_valid():
        print("Question is valid!")
        print(question.to_dict())
    else:
        print("Validation errors:")
        for err in question.errors:
            print(f"  - {err}")
