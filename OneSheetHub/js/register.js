import firebaseConfig from './firebaseConfig.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const registerForm = document.querySelector('.register-form');
const errorMsg = document.createElement('p');
errorMsg.style.color = 'red';
errorMsg.style.textAlign = 'center';
registerForm.appendChild(errorMsg);

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = registerForm.querySelector('input[type=email]').value;
  const password = registerForm.querySelectorAll('input[type=password]')[0].value;
  const confirmPassword = registerForm.querySelectorAll('input[type=password]')[1].value;

  if (password !== confirmPassword) {
    errorMsg.textContent = 'รหัสผ่านไม่ตรงกัน';
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    errorMsg.style.color = 'green';
    errorMsg.textContent = 'สมัครสมาชิกสำเร็จ!';
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  } catch (error) {
    errorMsg.textContent = error.message;
  }
});
