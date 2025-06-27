import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION = "transactions";

export async function addTransaction(data) {
  // data: { userId, amount, type, category, date, note }
  return addDoc(collection(db, COLLECTION), data);
}

export async function getTransactionsByUser(userId) {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
} 