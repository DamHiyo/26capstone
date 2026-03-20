let drawCount = 0;
let isDrawing = false;

function getBallClass(num) {
  if (num <= 10) return 'range-1';
  if (num <= 20) return 'range-2';
  if (num <= 30) return 'range-3';
  if (num <= 40) return 'range-4';
  return 'range-5';
}

function pickNumbers() {
  const pool = Array.from({ length: 45 }, (_, i) => i + 1);
  const picked = [];
  while (picked.length < 7) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  const main = picked.slice(0, 6).sort((a, b) => a - b);
  const bonus = picked[6];
  return { main, bonus };
}

function drawLotto() {
  if (isDrawing) return;
  isDrawing = true;

  const btn = document.getElementById('drawBtn');
  btn.disabled = true;
  btn.textContent = '추첨 중...';

  // 슬롯 초기화
  for (let i = 0; i < 6; i++) {
    const slot = document.getElementById(`slot${i}`);
    slot.className = 'ball-slot';
    slot.textContent = '';
  }
  const bonusSlot = document.getElementById('slotBonus');
  bonusSlot.className = 'ball-slot bonus';
  bonusSlot.textContent = '';

  const { main, bonus } = pickNumbers();

  // 번호를 하나씩 순서대로 표시
  main.forEach((num, idx) => {
    setTimeout(() => {
      const slot = document.getElementById(`slot${idx}`);
      slot.textContent = num;
      slot.className = `ball-slot filled ${getBallClass(num)}`;

      if (idx === 5) {
        // 보너스 번호
        setTimeout(() => {
          bonusSlot.textContent = bonus;
          bonusSlot.className = `ball-slot bonus filled ${getBallClass(bonus)}`;

          // 추첨 완료 후 기록 추가
          setTimeout(() => {
            addHistory(main, bonus);
            btn.disabled = false;
            btn.textContent = '다시 추첨!';
            isDrawing = false;
          }, 400);
        }, 500);
      }
    }, idx * 500);
  });
}

function addHistory(main, bonus) {
  drawCount++;
  const list = document.getElementById('historyList');

  // 빈 메시지 제거
  const emptyMsg = list.querySelector('.empty-msg');
  if (emptyMsg) emptyMsg.remove();

  const li = document.createElement('li');
  li.className = 'history-item';

  const countSpan = document.createElement('span');
  countSpan.className = 'history-count';
  countSpan.textContent = `#${drawCount}`;
  li.appendChild(countSpan);

  main.forEach(num => {
    const ball = document.createElement('div');
    ball.className = `history-ball ${getBallClass(num)}`;
    ball.textContent = num;
    li.appendChild(ball);
  });

  const plus = document.createElement('span');
  plus.className = 'history-plus';
  plus.textContent = '+';
  li.appendChild(plus);

  const bonusBall = document.createElement('div');
  bonusBall.className = `history-ball bonus-ball ${getBallClass(bonus)}`;
  bonusBall.textContent = bonus;
  li.appendChild(bonusBall);

  list.insertBefore(li, list.firstChild);
}

// 초기 빈 메시지
document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('historyList');
  const msg = document.createElement('p');
  msg.className = 'empty-msg';
  msg.textContent = '추첨 기록이 없습니다.';
  list.appendChild(msg);
});
