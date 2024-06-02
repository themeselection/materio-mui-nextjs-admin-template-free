import firebase_app from "../../configs/firebaseConfig";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import getDocument from "../firestore/getData";
import addData from "../firestore/addData";
import { type } from "os";

// Get the authentication instance using the Firebase app
const auth = getAuth(firebase_app);
//TODO move to common file
type User = {
  email: string;
  uid: string;
}
// Function to sign in with email and password
export default async function signIn(email: string, password: string) {
  let result = null, // Variable to store the sign-in result
    error = null,
    userDoc; // Variable to store any error that occurs

  try {
    result = await signInWithEmailAndPassword(auth, email, password)
    if (result.user) {
      // Update the user profile with the display name
      //check if user exists in the database
      //
      userDoc = await getDocument('users', result.user.uid); // Get the user profile document
      if (!userDoc.result?.exists())
        userDoc = await createNewUser(result.user); // Create a new user profile document
    }
  } catch (e) {
    error = e; // Catch and store any error that occurs during sign-in
  }

  return { result, userDoc, error }; // Return the sign-in result and error (if any)
}
//TODO move to common file
async function createNewUser(userData: any,): Promise<any> {
  // create a user profile
  // loop thoruhg all user type attributes and add them to the user object but make it so when you add new attributes to the user object it will automatically add them to the user type
  const user: User = {
    email: userData.email!,
    uid: userData.uid
  }

  const userDoc = await addData('users', user.uid, user); //
  return userDoc;
}
