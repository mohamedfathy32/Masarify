import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const defaultCategories = [
  "أكل وشرب",
  "مواصلات", 
  "تسوق",
  "إيجار/سكن",
  "صحة",
  "ترفيه",
  "تعليم"
];

export async function getCategories(userId) {
  const q = query(collection(db, "users", userId, "categories"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.data().name);
}

export async function addCategory(userId, name) {
  return addDoc(collection(db, "users", userId, "categories"), { name });
}

export async function initializeDefaultCategories(userId) {
  const existingCategories = await getCategories(userId);
  
  // إضافة التصنيفات الافتراضية إذا لم تكن موجودة
  for (const category of defaultCategories) {
    if (!existingCategories.includes(category)) {
      await addCategory(userId, category);
    }
  }
} 