import { auth } from './firebase';
import { signInAnonymously as firebaseSignInAnonymously } from 'firebase/auth';

export async function signInAnonymously() {
  try {
    const userCredential = await firebaseSignInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    return null;
  }
}