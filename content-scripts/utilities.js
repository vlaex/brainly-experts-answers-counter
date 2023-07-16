function showSpinner(element, opts = { 
  disable: true, 
  color: 'gray-700' 
}) {
  if(opts.disable) element.disabled = true;

  element.classList.add('sg-spinner-container');
  element.insertAdjacentHTML('beforeend', `<div class="sg-spinner-container__overlay">
    <div class="sg-spinner sg-spinner--${opts.color} sg-spinner--xsmall"></div>
  </div>`)
}

function hideSpinner(element) {
  if(element.disabled) element.disabled = false;
  element.classList.remove('sg-spinner-container');
  element.querySelector('.sg-spinner-container__overlay').remove();
}

function getDate(isoDate) {
  return new Date(isoDate);
}

function getOffsetDate(str, os) {
  let d = new Date(str);
  d.setDate(d.getDate() + os);
  return d;
}

function flashMessage(message = '', flashType = 'info') {
  const flash = document.createElement('div');
  flash.classList.add('sg-flash');
  flash.innerHTML = `
    <div class="sg-flash__message sg-flash__message--${flashType}">
      <div class="sg-text sg-text--small sg-text--bold sg-text--to-center">${message}</div>
    </div>
  `;
  flash.onclick = () => flash.remove();
  setTimeout(() => flash.remove(), 3000);

  document.querySelector('.flash-messages-container').append(flash);
}

const getToday = () => new Date().toLocaleDateString('en-CA');