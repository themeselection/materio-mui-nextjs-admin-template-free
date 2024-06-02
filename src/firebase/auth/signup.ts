
import {createUserWithEmailAndPassword} from "firebase/auth";
import addData from "../firestore/addData";
import { getAuth } from "firebase/auth";

// Get the authentication instance using the Firebase app
// Get the Firestore instance using the Firebase app
const auth = getAuth();
 //TODO move to common file
type user = {
  email: string;
  uid: string;
}
// Function to sign up a user with email and password
export default async function signUp(email: string, password: string) {
  let result = null, // Variable to store the sign-up result
    userDoc = null, // Variable to store the user profile document  
    error = null; // Variable to store any error that occurs
  try {
    result = await createUserWithEmailAndPassword(auth, email, password); // Create a new user with email and password
    if (result.user) {
      // Update the user profile with the display name
      userDoc = createNewUser(result.user); // Create a new user profile document
    }
  }
  catch (e) {
    error = e; // Catch and store any error that occurs during sign-up 
  }
  
  return { result, userDoc, error }; // Return the sign-up result and error (if any)
  }
 //TODO move to common file
  async function createNewUser(userData: any, ): Promise<any> {
    // create a user profile
    const user: user = {
      email: userData.email!,
      uid: userData.uid
    }
   const userDoc = await addData('users', user.uid, user ); //
    return userDoc;
  }

