new MutationObserver((e) => {
  const node = e[0].addedNodes[0];
  if(!node) return;

  const answersContainer = node.querySelector('.user-answers');
  const userAnswersCount = node.querySelector('.user-answers-count');
  const toggleAnswersButton = node.querySelector('.toggle-user-answers');
  const countAnswersButton = node.querySelector('.count-user-answers');
  const deleteUserButton = node.querySelector('.delete-user');
  const answererId = parseInt(node.dataset.id);

  deleteUserButton.onclick = () => node.remove();
  toggleAnswersButton.onclick = () => answersContainer.classList.toggle('hidden');

  countAnswersButton.onclick = async function () {
    showSpinner(this);

    answersContainer.innerHTML = '';
    answersContainer.classList.add('hidden');
    userAnswersCount.innerText = 'counting...';
    toggleAnswersButton.disabled = deleteUserButton.disabled = true;

    const userAnswers = await getUserAnswers({ 
      userId: answererId, 
      fromDate: getOffsetDate(document.querySelector('.from-date').value, 0), 
      toDate: getOffsetDate(document.querySelector('.to-date').value, 1)
    });

    userAnswersCount.innerText = userAnswers.length;
    answersContainer.append(...userAnswers.map(ans => renderAnswer(ans)));

    hideSpinner(this);
    toggleAnswersButton.disabled = deleteUserButton.disabled = false;
  }

  node.querySelector('.count-user-answers-by-questions').onclick = async function () {
    showSpinner(this);

    function getPreviousWeekDay(offset, substrDays) {
      let d = new Date();
      d.setDate(d.getDate() - (d.getDay() + offset) % 7);
      d.setDate(d.getDate() - substrDays);
      console.debug(d);
      return d;
    }

    let previousWeekAns = await getUserAnswers({
      userId: answererId,
      fromDate: getPreviousWeekDay(6, 8),
      toDate: getPreviousWeekDay(-1, 7)
    });
    let questions = await getQuestions(previousWeekAns.map(ans => ans.question_id));

    let questionsFrom = getOffsetDate(document.querySelector('.from-date').value, 0);
    let questionsTo = getOffsetDate(document.querySelector('.to-date').value, 1);

    let filteredQuestions = questions.filter(t => {
      let date = getDate(t.created);
      if(date < questionsFrom || date > questionsTo) return false;
      return true;
    });

    let answers = [];
    for(let q of filteredQuestions) {
      let ans = previousWeekAns.find(x => x.question_id === q.databaseId);
      if(ans) answers.push(ans);
    }

    userAnswersCount.innerText = answers.length;
    answersContainer.innerHTML = '';
    answersContainer.append(...answers.map(answer => renderAnswer(answer)));
    hideSpinner(this);
  }

  countAnswersButton.click();
}).observe(
  document.querySelector('.users-to-check'),
  { childList: true }
)

function renderAnswer(answer) {
  let element = document.createElement('li');
  element.innerHTML = `
    <button class="sg-button sg-button--s thank-answer" title="Thank"><span class="sg-button__icon">
      <div class="sg-icon sg-icon--adaptive sg-icon--x16"><svg class="sg-icon__svg"><use title="Thank" xlink:href="#icon-heart_outlined"></use></svg></div></span>
    <span class="sg-button__text">${answer.thanks_count}</span></button>
    <a ${answer.is_best ? 'data-best' : ''} ${answer.is_confirmed ? 'data-approved' : ''} class="sg-text--link sg-text--bold" href="/task/${answer.question_id}" target="_blank">
      ${answer.attachment_ids.length ? '📎 ' : ''}
      ${answer.content.replace(/<\/?\w+>/g, ' ').trim()}
    </a>
    <span class="sg-text sg-text--small sg-text--bold sg-text--to-center">${new Date(answer.created).toLocaleString('ru-RU')}</span>
  `;

  element.querySelector('.thank-answer').onclick = async function () {
    this.disabled = true;

    thankAnswer(answer.id).then(data => {
      if(!data.success) return flashMessage(data.message);

      this.querySelector('.sg-button__text').innerText = data.data.response.thanks;
      flashMessage('Thank has been saved', 'success');
    })
  }
  return element;
}