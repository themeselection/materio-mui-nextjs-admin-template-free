# Parse command-line arguments
ENVIRONMENT=$1

# Default to "dev" if no environment is specified
if [ -z "$ENVIRONMENT" ]; then
  ENVIRONMENT="dev"
if [ "$ENVIRONMENT" = "local" ] then ENVIRONMENT="dev"
if [ "$ENVIRONMENT" = "dev" ]; then
    sleep 10
fi

echo "Environment: $ENVIRONMENT"
# Open a new terminal window and run npm run dev
[ "$ENVIRONMENT" = "dev" ]; then
  echo "Opening a new terminal window and serving the app locally..."
  open -a Terminal.app ``next dev 
 
 
  # Tell user the app is running
  echo "App is running at http://localhost:3000"
else
  echo "Building and exporting the app..."
  npm run build
#   push the app to vercel and deploy it
  vercel --prod
fi

# Open the functions in the default browser
if [ "$ENVIRONMENT" = "local" ]; then
  echo "Functions are running at http://localhost:5001/$PROJECT_ID/$REGION/$FUNCTION_NAME"
fi

# Open the app in the default browser
open "http://localhost:3000"    
fi
