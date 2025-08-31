# AI Prompt Game

A daily puzzle game where players write prompts to recreate target images using AI generation. Features ensemble scoring with CLIP, object detection, color analysis, and pose estimation, plus a complete authentication system.

## Features

- **Daily Puzzles**: New AI image challenges every day
- **User Authentication**: Secure login/signup system with JWT-based session management
- **AI Image Generation**: Powered by Replicate's SDXL model
- **Advanced Scoring**: Multi-factor ensemble scoring system
  - CLIP semantic similarity (40%)
  - YOLOv8 object detection (30%)
  - Color distribution analysis (20%)
  - Pose estimation (10%)
- **Leaderboards**: Daily rankings and competition
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom JWT-based auth with bcrypt password hashing
- **Image Generation**: Replicate API (SDXL)
- **Scoring**: Ensemble method with multiple AI models

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Replicate API account
- Roboflow API account (optional, for production object detection)

### Installation

1. Navigate to the project directory:
```bash
cd ai-prompt-game
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Edit `.env.local` with your credentials:
```
DATABASE_URL="postgresql://user:password@localhost:5432/ai_prompt_game"
JWT_SECRET="your-secure-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
REPLICATE_API_TOKEN="your_replicate_token"
ROBOFLOW_API_KEY="your_roboflow_key"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
ai-prompt-game/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/                # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   │   ├── signup/    # User registration
│   │   │   │   ├── login/     # User login
│   │   │   │   ├── logout/    # User logout
│   │   │   │   └── me/        # Current user info
│   │   │   ├── generate-image/ # Image generation
│   │   │   ├── calculate-score/ # Scoring logic
│   │   │   ├── submit-prompt/  # Save submissions
│   │   │   └── get-daily-puzzle/ # Daily puzzle
│   │   ├── auth/              # Auth pages
│   │   │   ├── login/         # Login page
│   │   │   └── signup/        # Signup page
│   │   └── page.tsx           # Main game page
│   ├── components/            # React components
│   │   ├── auth/              # Auth components
│   │   │   ├── LoginForm.tsx  # Login form
│   │   │   └── SignupForm.tsx # Signup form
│   │   ├── GameInterface.tsx # Main game UI
│   │   ├── ImageDisplay.tsx  # Image viewer
│   │   ├── PromptInput.tsx   # Prompt submission
│   │   └── ScoreDisplay.tsx  # Score visualization
│   ├── lib/                   # Utility functions
│   │   ├── auth.ts           # Auth utilities
│   │   ├── database.ts       # Prisma client
│   │   ├── imageGeneration.ts # Replicate integration
│   │   └── scoring/          # Scoring algorithms
│   │       └── ensembleScorer.ts
│   └── middleware.ts         # Auth middleware
├── prisma/
│   └── schema.prisma         # Database schema
└── package.json
```

## Database Schema

The application uses PostgreSQL with the following main tables:

- **User**: User accounts with email, username, and hashed passwords
- **Session**: Active user sessions with JWT tokens
- **Puzzle**: Daily puzzle challenges
- **Submission**: User submissions with scores
- **DailyLeaderboard**: Daily rankings

## Authentication System

The app includes a complete authentication system with:

- **Signup**: Create new accounts with email and username
- **Login**: Authenticate with email/username and password
- **Sessions**: JWT-based session management with 7-day expiry
- **Middleware**: Route protection for authenticated pages
- **Password Security**: bcrypt hashing with salt rounds

## Scoring System

The ensemble scoring system combines multiple AI models:

1. **CLIP Similarity (40%)**: Semantic understanding of the image
2. **Object Detection (30%)**: Accuracy of detected objects (YOLOv8)
3. **Color Analysis (20%)**: Color distribution similarity
4. **Pose Estimation (10%)**: Composition and structure

Final scores range from 0-100, with adaptive weighting based on image complexity.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Game
- `GET /api/get-daily-puzzle` - Get today's puzzle
- `POST /api/generate-image` - Generate AI image from prompt
- `POST /api/calculate-score` - Calculate ensemble score
- `POST /api/submit-prompt` - Submit prompt and save score
- `GET /api/check-submission` - Check if user already submitted

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
npm start
```

### Database Migrations
```bash
npx prisma migrate dev  # Development
npx prisma migrate deploy  # Production
```

## API Rate Limits & Costs

- Each game submission costs ~$0.15-0.30 in API calls
- Implement rate limiting for production use
- Consider caching for frequently accessed data
- Budget $500-1000/month for 1000 daily active users

## Note on Scoring Implementation

Currently using simplified mock scoring for development. To enable full scoring:

1. Get API keys from Replicate (CLIP) and Roboflow (YOLOv8)
2. Implement actual API calls in `/src/lib/scoring/`
3. Add color histogram analysis using Canvas API
4. Integrate pose detection service (MediaPipe or similar)

## License

MIT
