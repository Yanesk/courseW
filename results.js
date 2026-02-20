
  const list = document.getElementById('leadersList');

  let leaders = JSON.parse(localStorage.getItem('leaders')) || [];

  // по убыванию
  leaders.sort((a, b) => b.score - a.score);

  list.innerHTML = '';

  if (leaders.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Нет результатов';
    list.appendChild(li);
  } else {
    leaders.forEach(row => {
      const li = document.createElement('li');
      li.textContent = row.name + ' — ' + row.score;
      list.appendChild(li);
    });
  }

  document.getElementById('playAgainBtn').onclick = () => {
    window.location.href = './game.html';
  };

  document.getElementById('changeNameBtn').onclick = () => {
    localStorage.removeItem('playerName');
    window.location.href = './index.html';
  };

