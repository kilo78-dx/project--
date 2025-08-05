import firebaseConfig from './firebaseConfig.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

const userEmailSpan = document.getElementById('userEmail');
onAuthStateChanged(auth, (user) => {
  if (user) {
    userEmailSpan.textContent = user.email;
  } else {
    window.location.href = 'login.html';
  }
});

const uploadForm = document.getElementById('uploadForm');
const previewImg = document.getElementById('previewImg');
const coverFileInput = document.getElementById('coverFile');
const sheetFileInput = document.getElementById('sheetFile');
const uploadMsg = document.getElementById('uploadMsg');

coverFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      previewImg.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    previewImg.src = '../pic/placeholder.png';
  }
});

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  uploadMsg.textContent = '';
  const sheetName = document.getElementById('sheetName').value;
  const subjectCode = document.getElementById('subjectCode').value;
  const author = document.getElementById('author').value;
  const semester = document.getElementById('semester').value;
  const description = document.getElementById('description').value;
  const price = document.getElementById('price').value;
  const faculty = document.getElementById('faculty').value;
  const major = document.getElementById('major').value;
  const year = document.getElementById('year').value;
  const coverFile = coverFileInput.files[0];
  const sheetFile = sheetFileInput.files[0];

  let coverUrl = '';
  let sheetUrl = '';
  let coverBase64 = '';
  let sheetBase64 = '';

  try {
    if (coverFile) {
      coverBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(coverFile);
      });
    }
    if (sheetFile) {
      sheetBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(sheetFile);
      });
    }
    await addDoc(collection(db, 'sheets'), {
      sheetName,
      subjectCode,
      author,
      semester,
      description,
      price,
      faculty,
      major,
      year,
      coverBase64, // เก็บ base64 ของรูปหน้าปก
      sheetBase64, // เก็บ base64 ของไฟล์สรุป
      createdAt: new Date(),
      user: auth.currentUser ? auth.currentUser.email : ''
    });
    uploadMsg.style.color = 'green';
    uploadMsg.textContent = 'อัปโหลดสำเร็จ!';
    uploadForm.reset();
    previewImg.src = '../img/no-image.png';
  } catch (err) {
    uploadMsg.style.color = 'red';
    uploadMsg.textContent = 'เกิดข้อผิดพลาด: ' + err.message;
  }
});
