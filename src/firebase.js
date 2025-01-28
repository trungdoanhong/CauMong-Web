import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Thêm cấu hình Firebase của bạn vào đây
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 