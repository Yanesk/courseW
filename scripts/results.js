
  const list = document.getElementById('leadersList');
  const endSound = new Audio('../assets/sounds/start.mp3')


let leaders = JSON.parse(localStorage.getItem('leaders')) || [];

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

if (endSound) {
  endSound.volume = 0.5;
  playSound(endSound);
}

  // по убыванию
  leaders.sort((a, b) => b.score - a.score);
  const topLeaders = leaders.slice(0, 10);

  list.innerHTML = '';

  if (topLeaders.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Нет результатов';
    list.appendChild(li);
  } else {
    topLeaders.forEach(row => {
      const li = document.createElement('li');
      li.textContent = row.name + ': ' + row.score;
      list.appendChild(li);
    });
  }

  document.getElementById('playAgainBtn').onclick = () => {
    window.location.href = '../pages/game.html';
  };

  document.getElementById('changeNameBtn').onclick = () => {
    localStorage.removeItem('playerName');
    window.location.href = '../index.html';
  };

