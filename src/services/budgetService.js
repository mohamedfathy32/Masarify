import { db } from "../firebase";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

// إضافة أو تحديث ميزانية شهرية
export const setMonthlyBudget = async (userId, month, year, amount) => {
  try {
    const budgetRef = doc(db, "budgets", `${userId}_${year}_${month}`);
    await setDoc(budgetRef, {
      userId,
      month,
      year,
      amount: Number(amount),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error("خطأ في حفظ الميزانية:", error);
    throw error;
  }
};

// جلب ميزانية شهر معين
export const getMonthlyBudget = async (userId, month, year) => {
  try {
    const budgetRef = doc(db, "budgets", `${userId}_${year}_${month}`);
    const budgetDoc = await getDoc(budgetRef);
    
    if (budgetDoc.exists()) {
      return budgetDoc.data();
    }
    return null;
  } catch (error) {
    console.error("خطأ في جلب الميزانية:", error);
    throw error;
  }
};

// جلب جميع ميزانيات المستخدم
export const getUserBudgets = async (userId) => {
  try {
    const budgetsRef = collection(db, "budgets");
    const q = query(budgetsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const budgets = [];
    querySnapshot.forEach((doc) => {
      budgets.push({ id: doc.id, ...doc.data() });
    });
    
    return budgets.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  } catch (error) {
    console.error("خطأ في جلب ميزانيات المستخدم:", error);
    throw error;
  }
}; 