import firebaseConfig from './firebaseConfig.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const userEmailSpan = document.getElementById('userEmail');
onAuthStateChanged(auth, (user) => {
  if (user) {
    userEmailSpan.textContent = user.email;
  } else {
    window.location.href = 'login.html';
  }
});

const sheetList = document.getElementById('sheetList');

async function loadSheets() {
  const sheetList = document.getElementById('sheetList');
  const sheetLoading = document.getElementById('sheetLoading');
  sheetLoading.style.display = 'flex';

  const querySnapshot = await getDocs(collection(db, 'sheets'));
  const searchText = document.getElementById('searchInput').value.trim().toLowerCase();
  const faculty = document.getElementById('facultySelect').value;
  const major = document.getElementById('majorSelect').value;
  const term = document.getElementById('termSelect').value;
  const year = document.getElementById('yearSelect').value;
  const type = document.getElementById('typeSelect').value;

  sheetList.innerHTML = '';
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    // กรองข้อมูลตาม search/filter
    let match = true;
    if (searchText) {
      const allText = `${data.sheetName || ''} ${data.subjectCode || ''} ${data.author || ''} ${data.description || ''}`.toLowerCase();
      if (!allText.includes(searchText)) match = false;
    }
    if (faculty && faculty !== 'คณะ...') {
      if (data.faculty !== faculty) match = false;
    }
    if (major && major !== 'สาขา...') {
      if (data.major !== major) match = false;
    }
    if (term && term !== 'เทอม') {
      if (data.semester !== term) match = false;
    }
    if (year && year !== 'ปีการศึกษา') {
      if (data.year !== year) match = false;
    }
    if (type && type !== 'ประเภท') {
      if (data.type !== type) match = false;
    }
    if (!match) return;
    const card = document.createElement('div');
    card.className = 'sheet-card';
    card.innerHTML = `
      <div style="width:100%;display:flex;justify-content:center;">
        <img class="cover" src="${data.coverBase64 || '../pic/placeholder.png'}" alt="cover" style="margin-bottom:8px;width:200px;height:200px;object-fit:cover;">
      </div>  
      <div class="code"><strong>รหัสวิชา:</strong> ${data.subjectCode || '-'} </div>
      <div class="info">
        <strong>คณะ:</strong> ${data.faculty || '-'}<br>
        <strong>สาขา:</strong> ${data.major || '-'}<br>
        <strong>เทอม:</strong> ${data.semester || '-'}<br>
        <strong>ปีการศึกษา:</strong> ${data.year || '-'}<br>
        <strong>ชื่อชีท:</strong> ${data.sheetName || '-'}<br>
        <strong>ผู้จัดทำ:</strong> ${data.author || '-'}<br>
        <strong>รายละเอียด:</strong> ${data.description || '-'}<br>
        <strong>ราคา:</strong> ${data.price || '-'}
      </div>
      <div class="actions">
        <button class="detail-btn" data-id="${doc.id}">เพิ่มเติม</button>
        <button>ซื้อชีท</button>
      </div>
      <div style="font-size:13px;color:#6a1b9a;margin-top:4px;">ซื้อแล้ว -</div>
    `;
    sheetList.appendChild(card);
  });
  // เพิ่ม event ให้ปุ่มเพิ่มเติม
  document.querySelectorAll('.detail-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      window.location.href = `sheetdetail.html?id=${id}`;
    });
  });
  // เพิ่มปุ่มย้อนกลับหลัง sheet-list
  let backBtn = document.getElementById('backBtnSheet');
  if (backBtn && backBtn.parentNode) backBtn.parentNode.remove();
  const backDiv = document.createElement('div');
  backDiv.style.textAlign = 'center';
  backDiv.style.marginTop = '24px';
  backDiv.innerHTML = `<button id="backBtnSheet" onclick="window.history.back()" style="background:#fff;color:#7c4dff;border:1px solid #7c4dff;border-radius:8px;padding:8px 24px;font-size:18px;cursor:pointer;">ย้อนกลับ</button>`;
  sheetList.parentNode.insertBefore(backDiv, sheetList.nextSibling);
  sheetLoading.style.display = 'none';
}

document.getElementById('searchBtn').addEventListener('click', () => {
  loadSheets();
});

// โหลดข้อมูลครั้งแรก
loadSheets();
