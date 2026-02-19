
const nameInput = document.getElementById('nameInput');
const loginBtn = document.getElementById('loginBtn');


function saveName() {
  const name = nameInput.value.trim();
  if (name.length < 1) {
    alert("Введите имя");
    return false;
  }
  localStorage.setItem('playerName', name);
  return true;
}

loginBtn.addEventListener('click', () => {
  if (!saveName()) return;
  window.location.href = './index.html';
});

nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (!saveName()) return;
    window.location.href = './index.html';
  }
});

// запуск уровня для проверки
function startFrom(level) {
  if (!saveName()) return;

  localStorage.setItem('startLevel', level);
  window.location.href = './index.html';
}

