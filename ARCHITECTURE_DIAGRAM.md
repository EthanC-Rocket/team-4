# GameHub - Architecture Diagram

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                  FRONTEND                                 │
│                         React Application (Port 3000)                     │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   App.js    │  │   Hub.js     │  │  Login.js   │  │  Register.js    │  │
│  │  (Router)   │  │ (Dashboard)  │  │             │  │                 │  │
│  └─────────────┘  └──────────────┘  └─────────────┘  └─────────────────┘  │
│                                                                           │
│  ┌───────────────────────────── GAME COMPONENTS ─────────────────────────┐│
│  │                                                                       ││
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────┐  ┌────────────┐    ││
│  │  │  Sudoku    │  │ RocketMans  │  │   Dungeon    │  │ Personality│    ││
│  │  │            │  │             │  │   Crawler    │  │    Quiz    │    ││
│  │  └────────────┘  └─────────────┘  └──────────────┘  └────────────┘    ││
│  │                                                                       ││
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────┐  ┌────────────┐    ││
│  │  │   Zork     │  │ One Night   │  │    Rocxs     │  │   Would    │    ││
│  │  │            │  │ At Rocket   │  │              │  │ You Rather │    ││
│  │  └────────────┘  └─────────────┘  └──────────────┘  └────────────┘    ││
│  │                                                                       ││
│  └───────────────────────────────────────────────────────────────────────┘│
│                                                                           │
└───────────────────────────────────┬─────────────────────────────────────┬─┘
                                    │                                     │
                    Proxy: localhost:5000                  Direct: localhost:8000
                                    │                                     │
                                    ▼                                     ▼
┌───────────────────────────────────────────────┐  ┌────────────────────────────┐
│           BACKEND API #1                      │  │    BACKEND API #2          │
│      Flask Server (Port 5000)                 │  │  Flask Server (Port 8000)  │
├───────────────────────────────────────────────┤  ├────────────────────────────┤
│                                               │  │                            │
│  ┌──────────────────────────────────────┐     │  │  ┌───────────────────────┐ │
│  │         app.py (Main API)            │     │  │  │  questions_flask_api  │ │
│  │  ┌────────────────────────────────┐  │     │  │  │         .py           │ │
│  │  │  • User Authentication (JWT)   │  │     │  │  └───────────────────────┘ │
│  │  │  • User Registration/Login     │  │     │  │                            │
│  │  │  • Session Management          │  │     │  │  ┌───────────────────────┐ │
│  │  │  • Score Tracking & Storage    │  │     │  │  │  questions_dao.py     │ │
│  │  │  • Game Progress Persistence   │  │     │  │  │  (Data Access Layer)  │ │
│  │  └────────────────────────────────┘  │     │  │  └───────────────────────┘ │
│  │                                      │     │  │                            │
│  │  ┌────────────────────────────────┐  │     │  │  ┌───────────────────────┐ │
│  │  │      quiz_engine.py            │  │     │  │  │ question_validator.py │ │
│  │  │  (Personality Quiz Logic)      │  │     │  │  │  (Validation Logic)   │ │
│  │  └────────────────────────────────┘  │     │  │  └───────────────────────┘ │
│  └──────────────────────────────────────┘     │  │                            │
│                                               │  └─────────────┬──────────────┘
│  ┌──────────────────────────────────────┐     │                │
│  │       Flask-SQLAlchemy ORM           │     │                │
│  │       Flask-CORS                     │     │                │
│  │       Flask-JWT-Extended             │     │                │
│  │       bcrypt (Password Hashing)      │     │                │
│  └──────────────────────────────────────┘     │                │
│                                               │                │
└───────────────────┬───────────────────────────┘                │
                    │                                            │
                    ▼                                            ▼
┌───────────────────────────────────────────────┐  ┌─────────────────────────────┐
│          DATABASE #1                          │  │      DATABASE #2            │
│              SQLite                           │  │    JSON File Storage        │
├───────────────────────────────────────────────┤  ├─────────────────────────────┤
│                                               │  │                             │
│  ┌─────────────────────────────────────┐      │  │  ┌───────────────────────┐  │
│  │         users TABLE                 │      │  │  │  would-you-rather-    │  │
│  │  • id (Primary Key)                 │      │  │  │  questions.json       │  │
│  │  • username (Unique)                │      │  │  │                       │  │
│  │  • email                            │      │  │  │  {                    │  │
│  │  • password_hash                    │      │  │  │    "questions": [     │  │
│  │  • created_at                       │      │  │  │      {                │  │
│  └─────────────────────────────────────┘      │  │  │        "id": int,     │  │
│                                               │  │  │        "option1": str,│  │
│  ┌─────────────────────────────────────┐      │  │  │        "option2": str,│  │
│  │         scores TABLE                │      │  │  │        "category": str│  │
│  │  • id (Primary Key)                 │      │  │  │        "votes1": int, │  │
│  │  • user_id (Foreign Key)            │      │  │  │        "votes2": int  │  │
│  │  • game_name                        │      │  │  │      }                │  │
│  │  • score                            │      │  │  │    ]                  │  │
│  │  • achieved_at                      │      │  │  │  }                    │  │
│  └─────────────────────────────────────┘      │  │  └───────────────────────┘  │
│                                               │  │                             │
│  Location: backend/instance/database.db       │  │  Location: Root directory   │
└───────────────────────────────────────────────┘  └─────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                              DATA FLOW & INTERACTIONS
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│  USER AUTHENTICATION FLOW (API #1)                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. User enters credentials in Login.js                                     │
│  2. POST /api/login → app.py (Port 5000)                                    │
│  3. app.py validates against users TABLE (Database #1)                      │
│  4. JWT token generated and returned to frontend                            │
│  5. Token stored in localStorage, included in subsequent requests           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  SCORE TRACKING FLOW (API #1)                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. User plays a game (e.g., Sudoku, RocketMans)                            │
│  2. Game component sends score: POST /api/scores (with JWT token)           │
│  3. app.py validates token and saves to scores TABLE (Database #1)          │
│  4. Hub.js fetches scores: GET /api/scores → displays in sidebar            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  WOULD YOU RATHER FLOW (API #2)                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. WouldYouRather.js component loads                                       │
│  2. GET http://127.0.0.1:8000/questions/random                              │
│  3. questions_flask_api.py → questions_dao.py                               │
│  4. Read from would-you-rather-questions.json (Database #2)                 │
│  5. Return random question with vote counts                                 │
│  6. User votes: POST /questions/{id}/upvote?option=1                        │
│  7. DAO updates JSON file, increments vote counter                          │
│  8. Updated question returned to display results                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                          KEY ARCHITECTURAL DECISIONS
═══════════════════════════════════════════════════════════════════════════════

✓ SEPARATION OF CONCERNS
  • Two independent backend APIs with distinct responsibilities
  • API #1: User management, authentication, and cross-game features
  • API #2: Dedicated to "Would You Rather" game logic and data

✓ DATABASE INDEPENDENCE
  • SQLite/MySQL for relational data (users, scores) - structured, queryable
  • JSON for game-specific data - flexible, version-controlled, easy to edit

✓ AUTHENTICATION STRATEGY
  • JWT tokens for stateless authentication
  • Token stored client-side, included in Authorization headers
  • Password hashing with bcrypt for security

✓ PROXY CONFIGURATION
  • React dev server proxies /api/* requests to localhost:5000
  • Would You Rather makes direct requests to localhost:8000
  • Allows independent deployment and scaling of services

✓ COMPONENT ARCHITECTURE
  • Each game is an independent React component
  • Shared routing through App.js
  • Centralized user state management
  • Hub serves as game launcher and score dashboard

✓ EXTENSIBILITY
  • Easy to add new games as React components
  • Score tracking automatically available for all games
  • Can add more independent APIs for complex game logic
  • Modular structure supports team collaboration


═══════════════════════════════════════════════════════════════════════════════
                            TECHNOLOGY STACK SUMMARY
═══════════════════════════════════════════════════════════════════════════════

FRONTEND
• React 18.2.0
• React Router DOM 6.20.0
• Axios (HTTP client)
• CSS Modules for styling

BACKEND API #1 (Main)
• Flask 3.0.0
• Flask-SQLAlchemy (ORM)
• Flask-JWT-Extended (Authentication)
• Flask-CORS (Cross-origin requests)
• bcrypt (Password hashing)

BACKEND API #2 (Would You Rather)
• Flask 3.0.0
• Custom DAO pattern
• JSON file-based storage
• Custom validation layer

DATABASES
• SQLite (Development) / MySQL (Production)
• JSON file storage

DEVELOPMENT TOOLS
• pytest (Testing)
• coverage (Code coverage)
• python-dotenv (Environment variables)
• OpenAI API integration

```

## Deployment Considerations

### Development
- Run both Flask servers independently
- React dev server with proxy configuration
- SQLite for local database

### Production
- Deploy React build to static hosting (e.g., Vercel, Netlify)
- Deploy Flask APIs to cloud platform (e.g., AWS, Heroku, Google Cloud)
- Migrate to MySQL/PostgreSQL for production database
- Use environment variables for API endpoints
- Implement proper CORS policies
- Add rate limiting and API security measures

## Future Enhancements
- WebSocket support for real-time multiplayer games
- Redis for session caching
- GraphQL API layer for flexible data queries
- Microservices architecture for game-specific backends
- CDN integration for game assets
- Analytics and telemetry integration
