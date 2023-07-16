async function renderUser(userId) {
  const user = await getUserInfo(userId);
  document.querySelector('.users-to-check').insertAdjacentHTML('afterbegin', `<div class="user" data-id="${userId}">
    <div class="user-info">
    <button class="sg-button sg-button--transparent sg-button--icon-only delete-user">
      <span class="sg-button__icon"><div class="sg-icon sg-icon--adaptive sg-icon--x24"><svg class="sg-icon__svg"><use xlink:href="#icon-close"></use></svg></div></span>
    </button>
    <div class="sg-flex sg-flex--align-items-center">
      <img src="${user.avatar}" class="sg-avatar sg-flex--margin-right-xs">
      <div class="sg-flex sg-flex--column">
        <a href="/users/redirect_user/${userId}" target="_blank" class="sg-text--link sg-text sg-text--bold">${user.nick}</a>
        <span class="sg-text sg-text--small">${user.ranks[0]}</span>
      </div>
    </div>
    <h3 class="sg-headline">Ответов: <span class="user-answers-count">...</span></h3>
    <button title="Show/hide answers" class="sg-button sg-button--m sg-button--outline toggle-user-answers">
      <span class="sg-button__icon sg-button__icon--s"><div class="sg-icon sg-icon--adaptive sg-icon--x24"><svg class="sg-icon__svg"><use xlink:href="#icon-arrow_down"></use></svg></div></span>
      <span class="sg-button__text">Answers</span>
    </button>
    <button title="Reload" class="sg-button sg-button--s sg-button--facebook sg-button--icon-only count-user-answers">
      <span class="sg-button__icon sg-button__icon--s"><div class="sg-icon sg-icon--adaptive sg-icon--x16"><svg class="sg-icon__svg"><use xlink:href="#icon-reload"></use></svg></div></span>
    </button>
    <button class="sg-button sg-button--solid-blue sg-button--icon-only sg-button--s count-user-answers-by-questions" title="Get the number of answers for the last week to questions whose publication date is indicated in the fields from-to">
      <span class="sg-button__icon"><div class="sg-icon sg-icon--adaptive sg-icon--x16"><svg class="sg-icon__svg"><use xlink:href="#icon-all_questions"></use></svg></div></span>
    </button>
  </div>
  <ul class="user-answers"></ul></div>`);
}