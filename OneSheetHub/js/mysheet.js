
import firebaseConfig from './firebaseConfig.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  const userEmailSpan = document.getElementById('userEmail');
  const mysheetList = document.getElementById('mysheetList');
  const noSheetMsg = document.getElementById('noSheetMsg');
  const sheetLoading = document.getElementById('sheetLoading');

  onAuthStateChanged(auth, async (user) => {
    if (user && user.email) {
      userEmailSpan.textContent = user.email;
      userEmailSpan.style.display = 'inline';

      // ดึงชีทที่ user เคยอัปโหลด
      const q = query(collection(db, 'sheets'), where('user', '==', user.email));
      const querySnapshot = await getDocs(q);
      mysheetList.innerHTML = '';
      if (querySnapshot.empty) {
        mysheetList.style.display = 'none';
        noSheetMsg.style.display = 'block';
      } else {
        mysheetList.style.display = 'grid';
        noSheetMsg.style.display = 'none';
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const card = document.createElement('div');
          card.className = 'sheet-card';
          card.innerHTML = `
            <img class="cover" src="${data.coverBase64 || '../pic/placeholder.png'}" alt="cover">
            <div class="info"><b>${data.sheetName || ''}</b></div>
            <div class="info">ราคา: ${data.price || ''} บาท</div>
            <div class="info">วิชา: ${data.subjectCode || ''}</div>
            <div class="info">สาขา: ${data.major || ''}</div>
            <div class="info">คณะ: ${data.faculty || ''}</div>
          `;
          mysheetList.appendChild(card);
        });
      }
      // ซ่อน loading หลังข้อมูลโชว์
      if (sheetLoading) sheetLoading.style.display = 'none';
    } else {
      userEmailSpan.textContent = '-';
      window.location.href = 'login.html';
    }
  });
});
