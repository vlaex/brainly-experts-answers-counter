const today = getToday();

document.title = 'Answers counter';
document.querySelector('.js-main-container').innerHTML = `
  <div class="sg-flex sg-flex--full-width sg-flex--justify-content-space-between sg-flex--align-items-center">
    <h1 class="sg-text-bit sg-text-bit--blue-primary">Answers counter</h1>
    <div class="sg-flex sg-flex--align-items-center">
      <span class="sg-text sg-text--bold sg-text--small sg-text--to-center sg-flex--margin-right-s">from/to</span>
      <input type="date" class="from-date sg-input" value="${today}" max="${today}" min="2011-01-01">
      <input type="date" class="to-date sg-input" value="${today}" max="${today}" min="2011-01-01">
      <button class="sg-button sg-button--s sg-button--solid-mint reload-all">
        <span class="sg-button__icon">
          <div class="sg-icon sg-icon--adaptive sg-icon--x16"><svg class="sg-icon__svg"><use xlink:href="#icon-reload"></use></svg></div>
        </span>
        <span class="sg-button__text">Reload all</span>
      </button>
      <button title="Sort by question date" class="sg-button sg-button--s sg-button--solid-blue reload-by-questions">
        <span class="sg-button__icon">
          <div class="sg-icon sg-icon--adaptive sg-icon--x16"><svg class="sg-icon__svg"><use xlink:href="#icon-all_questions"></use></svg></div>
        </span>
        <span class="sg-button__text">Sort by question date</span>
      </button>
    </div>
  </div>
  <div class="sg-flex sg-flex--full-width sg-flex--margin-top-xs">
    <input class="sg-input add-user-input" placeholder="Add user link">
    <button class="sg-button sg-button--solid sg-button--icon-only add-user">
      <span class="sg-button__icon"><div class="sg-icon sg-icon--adaptive sg-icon--x24"><svg class="sg-icon__svg"><use xlink:href="#icon-plus"></use></svg></div></span>
    </button>
  </div>
  <div class="sg-horizontal-separator sg-horizontal-separator--with-margin"></div>
  <div class="users-to-check"></div>
`;

const savedUserIds = localStorage.getItem('savedUserIds');
if(savedUserIds) JSON.parse(savedUserIds).forEach(async(id) => await renderUser(id));

document.querySelector('.add-user').onclick = async function() {
  const profileLinkInput = document.querySelector('.add-user-input')
  if(!profileLinkInput.value?.length) return;

  const userId = +profileLinkInput.value.match(/\d+(?=$|\/|\/\w+)/i)?.[0];
  if(!userId) return alert('Invalid user ID!');

  showSpinner(this, {disable: true, color: 'white'});
  await renderUser(userId);
  hideSpinner(this);
  profileLinkInput.value = '';
}

document.querySelector('.reload-all').onclick = () => {
  for(let user of document.querySelectorAll('.users-to-check > .user')) {
    user.querySelector('.count-user-answers').click();
  }
}

document.querySelector('.reload-by-questions').onclick = () => {
  [...document.querySelectorAll('.users-to-check > .user')].forEach(el =>
    el.querySelector('.count-user-answers-by-questions').click()
  );
}

window.onbeforeunload = () => {
  let userIds = [...document.querySelectorAll('.users-to-check > .user')].map(x => +x.dataset.id);
  localStorage.setItem('savedUserIds', JSON.stringify(userIds));
}