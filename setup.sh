#!/bin/bash

echo "🚀 DevFlow Setup Script"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi

echo "✅ Node.js and npm detected"

# Create project directory
mkdir -p devflow
cd devflow

# Initialize Next.js
echo "📦 Initializing Next.js project..."
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --no-eslint \
  --src-dir \
  --import-alias "@/*" \
  --no-git \
  --yes

# Install dependencies
echo "📦 Installing dependencies..."
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @hookform/resolvers @supabase/ssr @supabase/supabase-js @tanstack/react-query ai clsx date-fns lucide-react openai react-hook-form recharts sonner tailwind-merge zod zustand

# Install dev dependencies
npm install -D @types/node @types/react @types/react-dom @types/uuid typescript vitest

# Create folder structure
echo "📁 Creating folder structure..."
mkdir -p src/{app/{api/{ai,projects,tasks,upload},(auth),dashboard,projects,tasks,client},components/{ui,dashboard,kanban,ai},lib/{supabase,ai,utils},store,types,tests/{unit,e2e}}
mkdir -p supabase/migrations

# Copy environment template
echo "⚙️  Setting up environment variables..."
cat > .env.example << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

cp .env.example .env.local

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env.local with your actual values"
echo "2. Set up Supabase project at https://supabase.com"
echo "3. Run the SQL migration from supabase/migrations/"
echo "4. Generate types: npm run supabase:types"
echo "5. Start dev server: npm run dev"
echo ""
echo "🎉 Happy coding!"

chmod +x setup.sh