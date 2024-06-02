
# Initialize Firebase
echo Installing dependencies...
npm install --legacy-peer-deps

# Prompt the user to provide Firebase configuration details
echo "Please provide your Firebase configuration details:"
read -p "Firebase API Key: " apiKey
read -p "Auth Domain: " authDomain
read -p "Project ID: " projectId
read -p "Storage Bucket: " storageBucket
read -p "Messaging Sender ID: " messagingSenderId
read -p "App ID: " appId

echo "Please provide your OpenAI configuration details:"
read -p "OpenAI API Key: " openaiKey
read -p "OpenAI Assistant ID: " assistantId

# Create a .env.local file with Firebase 
echo "Creating .env.local file..."
cat <<EOT >> .env.local
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=$apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$authDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$projectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$storageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$messagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=$appId

# OpenAI
NEXT_PUBLIC_OPENAI_API_KEY=$openaiKey
NEXT_PUBLIC_OPENAI_ASSISTANT_ID=$assistantId
EOT

# Install Firebase Tools globally
echo "Installing Firebase Tools globally..."
npm install -g firebase-tools

# Install Firebase Functions dependencies
echo "Installing Firebase Functions dependencies..."
cd functions
npm install
cd ..


