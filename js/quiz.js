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
      const correct = i === q.answer;
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
    });
    options.append(button);
  });
  area.append(options);
}

// ビルドでまとめた問題を読み込む。
fetch('questions.json')
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
