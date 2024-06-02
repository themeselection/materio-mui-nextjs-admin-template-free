# Parse command-line arguments
ENVIRONMENT=$1

# Default to "local" if no environment is specified
if [ -z "$ENVIRONMENT" ]; then
  ENVIRONMENT="local"
fi

# Build the functions using Vite
echo "Building functions..."
npm --prefix functions run build

# Start the local Firebase emulators
if [ "$ENVIRONMENT" = "local" ]; then
  echo "Starting local Firebase emulators..."
  firebase emulators:start --only functions &
else
  echo "Deploying functions to production..."
  firebase deploy --only functions
  # wait unrtill the functions are deployed

fi