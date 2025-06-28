import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const defaultExpenseCategories = [
  "أكل وشرب",
  "مواصلات", 
  "تسوق",
  "إيجار/سكن",
  "صحة",
  "ترفيه",
  "تعليم"
];

const defaultIncomeCategories = [
  "راتب",
  "عمل إضافي",
  "استثمارات",
  "هدايا",
  "أخرى"
];

// دوال تصنيفات المصروفات
export async function getExpenseCategories(userId) {
  const q = query(collection(db, "users", userId, "expenseCategories"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.data().name);
}

export async function addExpenseCategory(userId, name) {
  return addDoc(collection(db, "users", userId, "expenseCategories"), { name });
}

export async function initializeDefaultExpenseCategories(userId) {
  const existingCategories = await getExpenseCategories(userId);
  
  // إضافة التصنيفات الافتراضية إذا لم تكن موجودة
  for (const category of defaultExpenseCategories) {
    if (!existingCategories.includes(category)) {
      await addExpenseCategory(userId, category);
    }
  }
}

// دوال تصنيفات الدخل
export async function getIncomeCategories(userId) {
  const q = query(collection(db, "users", userId, "incomeCategories"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.data().name);
}

export async function addIncomeCategory(userId, name) {
  return addDoc(collection(db, "users", userId, "incomeCategories"), { name });
}

export async function initializeDefaultIncomeCategories(userId) {
  const existingCategories = await getIncomeCategories(userId);
  
  // إضافة التصنيفات الافتراضية إذا لم تكن موجودة
  for (const category of defaultIncomeCategories) {
    if (!existingCategories.includes(category)) {
      await addIncomeCategory(userId, category);
    }
  }
}

// دوال للتوافق مع الكود القديم
export async function getCategories(userId) {
  return getExpenseCategories(userId);
}

export async function addCategory(userId, name) {
  return addExpenseCategory(userId, name);
}

export async function initializeDefaultCategories(userId) {
  await initializeDefaultExpenseCategories(userId);
  await initializeDefaultIncomeCategories(userId);
} 