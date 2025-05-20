# 🧠 IQ Test App - Frontend

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=IQ+Test+App+Screenshot" alt="IQ Test App Screenshot" width="800"/>
  
  <p>
    <strong>A modern cognitive assessment platform built with Next.js 15, React 19, and TailwindCSS 4</strong>
  </p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-project-structure">Project Structure</a> •
    <a href="#%EF%B8%8F-environment-variables">Environment Variables</a> •
    <a href="#-deployment">Deployment</a>
  </p>
</div>

## ✨ Features

- **Interactive Cognitive Tests**: Various test types to assess different aspects of intelligence
- **Real-time Scoring**: Immediate test results with detailed analysis
- **User Dashboard**: Track progress and cognitive development over time
- **Global Leaderboard**: Compare scores with test-takers worldwide
- **Responsive Design**: Seamless experience across all devices
- **Light/Dark Mode**: Optimized for different visual preferences
- **Secure Authentication**: JWT-based user management system

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=Interactive+Tests+Screenshot" alt="Interactive Tests" width="800"/>
</div>

## 🛠 Tech Stack

- **Framework**: [Next.js 15.3.1](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion 12](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Deployment**: [Vercel](https://vercel.com/)

### Key Frontend Features

- **Server Components**: Leveraging Next.js 15's improved React Server Components
- **Streaming & Progressive Rendering**: Optimized loading states for better UX
- **Edge Runtime**: Faster global performance with edge computing
- **API Routes**: Secure backend communication via Next.js API routes
- **Image Optimization**: Automatic image optimization for better performance
- **Static & Dynamic Rendering**: Hybrid approach for optimal performance

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/iqtest.git
cd iqtest/iqtest

# Install dependencies
npm install
# or
yarn install

# Run the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
iqtest/                  # Frontend root directory
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js 15 App Router pages
│   │   ├── auth/        # Authentication pages
│   │   ├── profile/     # User profile pages
│   │   ├── tests/       # Test selection and execution pages
│   │   ├── leaderboard/ # Global rankings pages
│   │   └── layout.js    # Root layout
│   ├── components/      # React components
│   │   ├── auth/        # Authentication components
│   │   ├── begin/       # Test initialization components
│   │   ├── home/        # Homepage components
│   │   ├── leaderboard/ # Leaderboard display components
│   │   ├── profile/     # User profile components
│   │   ├── shared/      # Shared UI components
│   │   ├── start/       # Test progress components
│   │   └── tests/       # Test selection components
│   ├── fetch/           # API client functions
│   │   ├── api.js       # Base API configuration
│   │   ├── auth.js      # Authentication endpoints
│   │   ├── leaderboard.js # Leaderboard data fetching
│   │   ├── profile.js   # User profile operations
│   │   ├── questions.js # Test questions retrieval
│   │   ├── results.js   # Test results submission
│   │   └── tests.js     # Test management functions
│   ├── middleware.js    # Next.js request middleware
│   └── utils/           # Utility functions
├── .eslintrc.js         # ESLint configuration
├── next.config.mjs      # Next.js configuration
├── package.json         # Project dependencies
├── postcss.config.mjs   # PostCSS configuration
└── tailwind.config.mjs  # Tailwind CSS configuration
```

## 🔐 Authentication Flow

The app implements a secure authentication system:

1. **Registration/Login**: Users provide credentials via `/auth` page
2. **JWT Tokens**: Secured in HTTP-only cookies with short expiration
3. **API Authentication**: All private endpoints require valid JWT
4. **Auto-redirect**: Unauthorized users are redirected to login
5. **Token Refresh**: Silent token refresh for continuous sessions

<div align="center">
  <img src="https://via.placeholder.com/700x300?text=Authentication+Flow+Diagram" alt="Authentication Flow" width="700"/>
</div>

## 🧪 Test Types

The platform offers four distinct cognitive assessment tests:

| Test Type | Description | Questions | Time Limit |
|-----------|-------------|-----------|------------|
| **Numerical Reasoning** | Mathematical and logical puzzles | 20 | 25 minutes |
| **Verbal Intelligence** | Language comprehension and reasoning | 20 | 30 minutes |
| **Memory & Recall** | Pattern recognition and memory tests | 15 | 22 minutes |
| **Comprehensive IQ** | Mixed questions across all domains | 16 | 45 minutes |

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with these variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=/api
NEXT_SERVER_API_URL=http://backend:5164

# Authentication (development only)
NEXTAUTH_SECRET=your-development-secret
```

## 📊 API Integration

The frontend communicates with the backend through a centralized API client:

```javascript
// Example API call using the client
import { getTestQuestions } from '@/fetch/questions';

// In a component
const questions = await getTestQuestions(testTypeId);
```

## 🚢 Deployment

This application is configured for deployment on [Vercel](https://vercel.com/):

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

### Deployment Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Development Command**: `npm run dev`
- **Install Command**: `npm install`
- **Environment Variables**: Configure the same env variables in Vercel project settings

## 🔍 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## 📝 License

This project is [MIT](LICENSE) licensed.

---

<div align="center">
  <p>Made with ❤️ for cognitive assessment</p>
</div>