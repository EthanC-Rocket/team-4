# 🚀 QUICK START GUIDE - Athlete Personality Quiz

## Prerequisites Check ✅

First, verify Python is installed:
```powershell
python --version
```
If you see "Python 3.x.x", you're good to go! 

If not, install Python from: https://python.org/downloads/

## Option 1: Automated Setup (Easiest) 🎯

**Windows Batch File:**
```cmd
run.bat
```

**PowerShell Script:**
```powershell
.\run.ps1
```

## Option 2: Manual Setup (Step by Step) 🔧

1. **Create Virtual Environment**
```powershell
python -m venv venv
venv\Scripts\activate
```

2. **Install Dependencies**
```powershell
pip install -r requirements.txt
```

3. **Setup Environment**
```powershell
copy .env.example .env
# Edit .env file if needed
```

4. **Run Application**
```powershell
cd src
python -m web.app
```

## Option 3: Direct Run 🏃‍♂️

If you have Python and want to run immediately:
```powershell
python app.py
```

## Access the Quiz 🌐

Once running, open your browser to:
**http://localhost:5000**

## What You'll See 👀

1. **Landing Page**: Overview of athlete types and features
2. **Quiz Interface**: 5 personality questions
3. **Results Page**: Your athlete type with detailed profile

## Quiz Features 🎮

- **7 Athlete Types**: Team Leader, Individual Competitor, Endurance, Power, Tactical, Creative, Adaptable
- **Smart Scoring**: Algorithm matches your personality to athlete type
- **Detailed Profiles**: Strengths, development areas, famous examples
- **Responsive Design**: Works on desktop and mobile

## Sample Quiz Flow 📋

1. Enter your name (optional)
2. Answer 5 personality questions:
   - Team role preferences
   - Training style
   - Spotlight comfort level
   - Challenge approach
   - Pressure performance
3. Get your athlete type result!

## Troubleshooting 🔧

**Python not found?**
- Install from python.org
- Check "Add Python to PATH" during installation

**Port already in use?**
- Change port in app.py: `app.run(port=5001)`

**Dependencies fail to install?**
- Update pip: `python -m pip install --upgrade pip`
- Try: `pip install -r requirements.txt --user`

## Testing the Application 🧪

Run tests to verify everything works:
```powershell
pytest
```

## Next Steps 🚀

- Customize athlete types in `src/quiz/engine.py`
- Add more questions to the quiz
- Enable OpenAI integration for personalized results
- Deploy to cloud platforms

**Enjoy discovering your athletic personality! 🏆**