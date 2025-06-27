import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function saveUserProfile(uid, data) {
  return setDoc(doc(db, "users", uid), data, { merge: true });
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : {};
} 