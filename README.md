# 🚀 LeetCode Clone

A modern, full-stack coding platform built with Next.js that allows users to solve algorithmic problems in multiple programming languages. Features AI-powered problem generation, real-time code execution via Judge0, and comprehensive test case validation.

## ✨ Features

- **Multi-Language Support**: Write and execute code in JavaScript, Python, and Java
- **AI-Powered Problem Generation**: Generate coding problems using Google's Gemini AI
- **Real-Time Code Execution**: Powered by Judge0 API for secure code execution
- **Admin Dashboard**: Create, validate, and manage coding problems
- **Automatic Test Validation**: Reference solutions are validated against test cases before publishing
- **User Authentication**: Secure authentication with Clerk
- **Problem Tracking**: Track solved problems and user progress
- **Difficulty Levels**: Problems categorized as Easy, Medium, or Hard
- **Rich Problem Features**: Examples, constraints, hints, and editorial solutions

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React** - UI library
- **Tailwind CSS** - Styling

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Judge0** - Code execution engine

### AI & Integrations
- **Google Gemini AI** - Problem generation
- **Clerk** - User authentication

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- PostgreSQL database
- Judge0 API access (RapidAPI or self-hosted)
- Clerk account for authentication
- Google AI (Gemini) API key

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/leetcode-clone.git
cd leetcode-clone
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/leetcode_clone"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Judge0 API (via RapidAPI)
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=judge0-ce.p.rapidapi.com

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
leetcode-clone/
├── app/
│   ├── api/
│   │   ├── problems/
│   │   │   └── create/
│   │   │       └── route.js       # Problem creation API
│   │   └── auth/
│   ├── (routes)/
│   │   ├── problems/
│   │   ├── admin/
│   │   └── profile/
│   └── layout.js
├── lib/
│   ├── codeWrapper.js             # Code wrapper generation
│   ├── judge0.js                  # Judge0 API integration
│   ├── prisma.js                  # Prisma client
│   └── syncUser.js                # User synchronization
├── prisma/
│   └── schema.prisma              # Database schema
├── components/
│   ├── ui/
│   └── ...
└── public/
```

## 🎯 Key Features Explained

### 1. Code Wrapper System

The platform automatically wraps user code to handle:
- Multi-parameter functions
- Different input formats (single-line, multi-line, comma-separated)
- Type parsing (arrays, numbers, strings)
- Output formatting

**Supported Input Formats:**

```javascript
// Single-line comma-separated
[1, 2, 3, 4, 5], 3

// Multi-line
[1, 2, 3, 4, 5]
3

// With variable assignment
arr = [1, 2, 3]
```

### 2. Problem Creation Workflow

1. **Admin Access Required**: Only users with `ADMIN` role can create problems
2. **AI Generation**: Use Gemini to generate problem descriptions and solutions
3. **Automatic Validation**: Reference solutions are tested against all test cases
4. **Multi-Language Support**: Provide solutions in JavaScript, Python, and Java
5. **Publish**: Once validated, problems are saved to the database

### 3. Test Case Validation

Before a problem is created:
- All reference solutions are executed against test cases
- Output is normalized (whitespace removed)
- Compilation and runtime errors are caught
- Detailed error messages are provided

## 🔧 API Routes

### Create Problem
```http
POST /api/problems/create
```

**Request Body:**
```json
{
  "title": "Two Sum",
  "description": "Find two numbers that add up to target",
  "difficulty": "EASY",
  "tags": ["Array", "Hash Table"],
  "examples": {
    "javascript": {
      "input": "[2, 7, 11, 15], 9",
      "output": "[0, 1]"
    }
  },
  "constraints": "2 <= nums.length <= 10^4",
  "hints": "Try using a hash map",
  "editorial": "Detailed solution explanation",
  "testCases": [
    {
      "input": "[2, 7, 11, 15], 9",
      "output": "[0, 1]"
    }
  ],
  "codeSnippets": {
    "javascript": "function twoSum(nums, target) {\n  // Your code here\n}",
    "python": "def two_sum(nums, target):\n    # Your code here",
    "java": "public int[] twoSum(int[] nums, int target) {\n    // Your code here\n}"
  },
  "referenceSolutions": {
    "javascript": "function twoSum(nums, target) { ... }",
    "python": "def two_sum(nums, target): ...",
    "java": "public int[] twoSum(int[] nums, int target) { ... }"
  },
  "problemType": "NUMBER"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Problem created successfully",
  "data": { /* problem object */ }
}
```

## 🎨 Customization

### Adding New Languages

1. **Update `codeWrapper.js`**:
   - Add language detection in `findFunctionName()`
   - Add parameter counting in `countFunctionParams()`
   - Add wrapper generation in `generateWrapper()`

2. **Update `judge0.js`**:
   - Add language ID mapping in `getJudge0LanguageId()`

3. **Update UI**:
   - Add language option in problem creation form
   - Add syntax highlighting support

### Custom Test Case Format

Modify the wrapper functions in `codeWrapper.js` to handle your specific input/output format.

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- codeWrapper.test.js
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
# Build image
docker build -t leetcode-clone .

# Run container
docker run -p 3000:3000 leetcode-clone
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Common Issues & Solutions

### Judge0 API Errors
- Verify your RapidAPI key is correct
- Check if you've exceeded rate limits
- Ensure network connectivity to Judge0 servers

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Run `npx prisma migrate reset` if migrations are out of sync

### Compilation Errors (Java)
- Ensure no multiple public classes in generated code
- Check that class names match expectations
- Verify Java version compatibility with Judge0

### Test Case Validation Failures
- Check input/output format matches expected format
- Verify whitespace handling in comparisons
- Test reference solutions manually

## 📚 Resources

- [Judge0 Documentation](https://judge0.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Google AI Documentation](https://ai.google.dev/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [LeetCode](https://leetcode.com) for inspiration
- [Judge0](https://judge0.com) for code execution API
- [Google](https://ai.google.dev) for Gemini AI
- All contributors and supporters

## 📧 Contact

For questions or support, please open an issue or contact [your-email@example.com](mailto:your-email@example.com)

---

**Built with ❤️ using Next.js**
