import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCQ9dSQV6lMQe0rqPbdtjMg8QoBA7iWtuA",
  authDomain: "pixtone-2f21f.firebaseapp.com",
  projectId: "pixtone-2f21f",
  appId: "1:522885778713:web:5e0ee7a18eaa844bc94988",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()