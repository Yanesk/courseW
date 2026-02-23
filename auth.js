
const nameInput = document.getElementById('nameInput');
const loginBtn = document.getElementById('loginBtn');
const avatar = document.querySelector('.avatar');
const avatars = document.querySelectorAll('.avatar');

const startSound = new Audio('./assets/sounds/start.mp3')



let sound = startSound;

let selectedAvatar = localStorage.getItem('playerAvatar') || '';

avatars.forEach(img => {
  img.addEventListener('click', () => {
     avatars.forEach(a => a.classList.remove('avatar-click'));

    img.classList.add('avatar-click');
    localStorage.setItem('playerAvatar', img.src);

  });
});

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

// if (sound) {
//   sound.volume = 0.5;
//   playSound(sound);
// }


document.addEventListener('hover', () => {
 sound.volume = 0.5;
  playSound(sound);
}
)




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
  window.location.href = './game.html';
});

nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (!saveName()) return;
    window.location.href = './game.html';
  }
});

// запуск уровня для проверки
function startFrom(level) {
  if (!saveName()) return;

  localStorage.setItem('startLevel', level);
  window.location.href = './game.html';
}

