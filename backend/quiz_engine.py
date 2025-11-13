"""
Simplified Quiz Engine for Athlete Personality Quiz
Backend API integration version
"""

from typing import Dict, List, Any


class AthleteQuizEngine:
    """Core engine for athlete personality quiz."""
    
    def __init__(self):
        self.athlete_profiles = self._initialize_profiles()
    
    def _initialize_profiles(self) -> Dict[str, Dict[str, Any]]:
        """Initialize athlete personality profiles."""
        return {
            "Endurance": {
                "name": "🏃‍♂️ The Endurance Runner",
                "description": "You excel at long-term challenges and have exceptional mental stamina. Patient and methodical, you thrive on consistency and gradual progress toward ambitious goals.",
                "traits": ["Patient", "Consistent", "Goal-oriented", "Mentally Resilient"],
                "athletes": ["Eliud Kipchoge", "Kilian Jornet", "Courtney Dauwalter"],
                "icon": "🏃‍♂️",
                "color": "#4CAF50",
                "strengths": [
                    "Long-term planning and execution",
                    "Mental toughness and resilience",
                    "Consistency under pressure",
                    "Steady improvement over time"
                ],
                "recommendations": [
                    "Set long-term goals with milestone markers",
                    "Focus on building endurance through consistency",
                    "Practice patience with your progress",
                    "Balance training with adequate recovery"
                ]
            },
            "Strength": {
                "name": "🏋️‍♂️ The Strength Trainer",
                "description": "You're all about power and progressive growth. Disciplined and focused, you excel when pushing your physical limits and building strength through structured training.",
                "traits": ["Disciplined", "Powerful", "Methodical", "Focused"],
                "athletes": ["Eddie Hall", "Hafthor Bjornsson", "Jessica Buettner"],
                "icon": "🏋️‍♂️",
                "color": "#F44336",
                "strengths": [
                    "Progressive overload mastery",
                    "Disciplined training approach",
                    "Strong mind-muscle connection",
                    "Goal-oriented mindset"
                ],
                "recommendations": [
                    "Follow structured strength programs",
                    "Track your lifts and celebrate PRs",
                    "Prioritize recovery and nutrition",
                    "Consider powerlifting or Olympic lifting"
                ]
            },
            "TeamPlayer": {
                "name": "⚽ The Team Player",
                "description": "You thrive in collaborative environments and find motivation through teamwork. Your strengths shine when supporting others and working toward collective success.",
                "traits": ["Collaborative", "Supportive", "Communicative", "Team-oriented"],
                "athletes": ["Tom Brady", "Megan Rapinoe", "Stephen Curry"],
                "icon": "⚽",
                "color": "#2196F3",
                "strengths": [
                    "Building team cohesion",
                    "Motivating and supporting others",
                    "Communication and coordination",
                    "Selfless play for team success"
                ],
                "recommendations": [
                    "Join team sports or group fitness classes",
                    "Take on leadership roles in team settings",
                    "Practice active communication skills",
                    "Focus on collective goals over individual stats"
                ]
            },
            "Competitor": {
                "name": "🏆 The Competitor",
                "description": "You're driven by the pursuit of victory and excel under pressure. Highly motivated and results-focused, you push yourself to be the best in everything you do.",
                "traits": ["Competitive", "Driven", "Results-focused", "Determined"],
                "athletes": ["Michael Jordan", "Serena Williams", "Cristiano Ronaldo"],
                "icon": "🏆",
                "color": "#FF9800",
                "strengths": [
                    "Peak performance under pressure",
                    "Strong competitive drive",
                    "Results-oriented mindset",
                    "Mental fortitude in competition"
                ],
                "recommendations": [
                    "Enter competitions and track events",
                    "Set measurable performance goals",
                    "Study competitors and learn from them",
                    "Channel competitive energy constructively"
                ]
            },
            "Mindful": {
                "name": "🧘‍♀️ The Mindful Athlete",
                "description": "You prioritize balance, self-awareness, and holistic wellness. Your strength lies in mental preparation, stress management, and maintaining harmony between body and mind.",
                "traits": ["Balanced", "Self-aware", "Holistic", "Centered"],
                "athletes": ["LeBron James", "Novak Djokovic", "Naomi Osaka"],
                "icon": "🧘‍♀️",
                "color": "#9C27B0",
                "strengths": [
                    "Stress management and recovery",
                    "Mind-body connection",
                    "Injury prevention awareness",
                    "Holistic approach to fitness"
                ],
                "recommendations": [
                    "Incorporate yoga or tai chi",
                    "Practice meditation and breathing exercises",
                    "Focus on functional movement patterns",
                    "Balance intensity with recovery practices"
                ]
            },
            "Adrenaline": {
                "name": "🚀 The Adrenaline Seeker",
                "description": "You crave excitement and thrive on high-intensity challenges. Bold and spontaneous, you're energized by pushing limits and taking calculated risks.",
                "traits": ["Bold", "Spontaneous", "Thrill-seeking", "Adventurous"],
                "athletes": ["Shaun White", "Alex Honnold", "Travis Pastrana"],
                "icon": "🚀",
                "color": "#E91E63",
                "strengths": [
                    "Quick decision-making under pressure",
                    "Embracing new challenges",
                    "High-intensity performance",
                    "Pushing beyond comfort zones"
                ],
                "recommendations": [
                    "Try extreme sports or adventure activities",
                    "Incorporate HIIT and explosive training",
                    "Set bold, challenging goals",
                    "Balance thrill-seeking with safety awareness"
                ]
            },
            "Precision": {
                "name": "🎯 The Precision Performer",
                "description": "You excel through attention to detail and technical mastery. Consistent and methodical, you believe perfect technique is the foundation of peak performance.",
                "traits": ["Detail-oriented", "Technical", "Consistent", "Perfectionist"],
                "athletes": ["Simone Biles", "Tiger Woods", "Roger Federer"],
                "icon": "🎯",
                "color": "#00BCD4",
                "strengths": [
                    "Technical skill mastery",
                    "Attention to form and detail",
                    "Consistent performance",
                    "Quality over quantity mindset"
                ],
                "recommendations": [
                    "Work with coaches on technique refinement",
                    "Film and analyze your form regularly",
                    "Practice deliberate, focused training",
                    "Consider sports requiring precision (golf, archery, gymnastics)"
                ]
            }
        }
    
    def calculate_result(self, answers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculate quiz result based on user answers.
        
        Args:
            answers: List of answer dictionaries with 'type' field
            
        Returns:
            Dict containing the dominant athlete type and profile
        """
        # Count occurrences of each type
        type_counts = {}
        for answer in answers:
            answer_type = answer.get('type')
            if answer_type:
                type_counts[answer_type] = type_counts.get(answer_type, 0) + 1
        
        # Find dominant type
        if not type_counts:
            # Default to Endurance if no valid answers
            dominant_type = "Endurance"
        else:
            dominant_type = max(type_counts, key=type_counts.get)
        
        # Calculate consistency score (percentage of answers matching dominant type)
        total_answers = len(answers)
        consistency = (type_counts.get(dominant_type, 0) / total_answers * 100) if total_answers > 0 else 0
        
        # Get profile
        profile = self.athlete_profiles.get(dominant_type, self.athlete_profiles["Endurance"])
        
        return {
            "athlete_type": dominant_type,
            "profile": profile,
            "consistency_score": round(consistency, 1),
            "type_distribution": type_counts,
            "score": round(consistency)  # For leaderboard purposes
        }
    
    def get_profile(self, athlete_type: str) -> Dict[str, Any]:
        """Get profile for a specific athlete type."""
        return self.athlete_profiles.get(athlete_type, self.athlete_profiles["Endurance"])
    
    def get_all_profiles(self) -> Dict[str, Dict[str, Any]]:
        """Get all athlete profiles."""
        return self.athlete_profiles
