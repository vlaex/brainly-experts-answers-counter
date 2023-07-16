const MARKET = 'znanija.com';

async function getUserAnswers({
  userId,
  fromDate,
  toDate
}) {
  let end = false;
  let page = 1;
  let answers = [];
  
  while(!end) {
    let data = await fetch(`https://${MARKET}/api/28/api_responses/get_by_user?userId=${userId}&page=${page}&limit=100`)
      .then(resp => resp.json());

    for(let answer of data.data) {
      const answerDate = getDate(answer.created);

      if(answerDate < fromDate) return answers;
      if (answerDate > toDate) continue;

      answers.push(answer);
    }

    if(!data.pagination.next)
      end = true;

    page = ++page;
  }
  return answers;
}

async function getQuestions(questionsList) {
  let q = [];
  while(questionsList.length) {
    let sliced = questionsList.slice(0, 20);
    questionsList.splice(0, sliced.length);
    q.push(sliced);
  }

  let allQuestions = [];
  for(let list of q) {
    let query = `{ ${list.map(id => `task_${id}: questionById(id: ${id}) { databaseId created }`).join(' ')} }`;
    let req = await fetch(`https://${MARKET}/graphql/ru`, {
      method: 'POST',
      body: JSON.stringify({ query }),
      headers: { 'content-type': 'application/json' }
    }).then(res => res.json());

    allQuestions.push(...Object.keys(req.data).map(k => req.data[k]));
  }

  return allQuestions;
}

async function getUserInfo(userId) {
  let userPage = await fetch(`https://${MARKET}/profil/__nick__-${userId}`).then(res => res.text());
  let doc = new DOMParser().parseFromString(userPage, 'text/html');
  
  let userAvatar = doc.querySelector('.personal_info .avatar img').src;
  if(!/ru-static/.test(userAvatar)) userAvatar = '/img/avatars/100-ON.png';

  return {
    nick: doc.querySelector('.header .info .ranking a').innerText,
    ranks: [...doc.querySelectorAll('.header .info .rank > h3 > *')].map(rank => rank.innerText.trim()),
    points: doc.querySelector('.info .points h1').innerText,
    avatar: userAvatar,
  }
}

async function thankAnswer(answerId) {
  return await fetch(`https://${MARKET}/api/28/api_responses/thank/${answerId}`, {
    method: 'POST'
  }).then(res => res.json());
}