const area = document.querySelector('#quiz');
let questions = [];
let index = 0;
let score = 0;

// 文字列は HTML として解釈せずに表示する。
function element(tag, text) {
  const el = document.createElement(tag);
  el.textContent = text;
  return el;
}

function showQuestion() {
  area.replaceChildren();
  if (index === questions.length) {
    area.append(
      element('h2', 'おつかれさまでした！'),
      element('p', `${questions.length}問中 ${score}問正解です。`)
    );
    const retry = element('button', 'もう一度');
    retry.addEventListener('click', () => {
      index = 0;
      score = 0;
      showQuestion();
    });
    area.append(retry);
    retry.focus();
    return;
  }

  const q = questions[index];
  area.append(
    element('p', `第${index + 1}問 / ${questions.length}問　作者: ${q.author}`),
    element('h2', q.question)
  );
  const options = element('div', '');
  options.className = 'choices';
  q.choices.forEach((choice, i) => {
    const button = element('button', choice);
    button.addEventListener('click', () => {
      // 回答後は選び直せないようにする。
      options.querySelectorAll('button').forEach(b => {
        b.disabled = true;
      });
      const buttons = options.querySelectorAll('button');
      buttons[q.answer].classList.add('correct');
      buttons[q.answer].textContent = `✓ 正解: ${q.choices[q.answer]}`;
      const correct = i === q.answer;
      if (!correct) {
        button.classList.add('incorrect');
        button.textContent = `✗ あなたの回答: ${choice}`;
      }
      if (correct) score++;
      area.append(
        element('h3', correct ? '正解！' : '不正解'),
        element('p', `答え: ${q.choices[q.answer]}`),
        element('p', q.explanation)
      );
      const next = element('button', index + 1 === questions.length ? '結果を見る' : '次の問題へ');
      next.addEventListener('click', () => {
        index++;
        showQuestion();
      });
      area.append(next);
      next.focus();
    });
    options.append(button);
  });
  area.append(options);
  options.querySelector('button').focus();
}

// ビルドでまとめた問題を読み込む。
fetch('questions.json', { cache: 'no-cache' })
  .then(response => {
    if (!response.ok) throw new Error();
    return response.json();
  })
  .then(data => {
    if (!Array.isArray(data)) throw new Error();
    questions = data;
    if (!questions.length) {
      area.replaceChildren(element('p', 'まだ問題がありません。'));
      return;
    }
    showQuestion();
  })
  .catch(() => {
    area.replaceChildren(element('p', '問題を読み込めませんでした。時間をおいて再度お試しください。'));
  });
