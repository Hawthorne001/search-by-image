import {findNode, runOnce} from 'utils/common';
import {setFileInputData, initSearch, sendReceipt} from 'utils/engines';

const engine = 'repostSleuth';

async function search({session, search, image, storageIds} = {}) {
  (await findNode('button[id$="-trigger-image"]')).dispatchEvent(
    new MouseEvent('mousedown', {bubbles: true})
  );

  const button = await findNode('button[disabled]');

  const inputSelector = 'input[type=file]';
  const input = await findNode(inputSelector);

  await setFileInputData(inputSelector, input, image);

  await sendReceipt(storageIds);

  input.dispatchEvent(new Event('change', {bubbles: true}));

  window.setTimeout(() => button.click(), 1000);
}

async function engineAccess() {
  if (
    // Cloudflare challenge
    document
      .querySelector('noscript')
      ?.textContent.includes(
        '<div class="h2"><span id="challenge-error-text">'
      ) ||
    // Cloudflare error
    document.querySelector('div#cf-wrapper > div#cf-error-details')
  ) {
    return false;
  }

  return true;
}

function init() {
  initSearch(search, engine, taskId, {engineAccess});
}

if (runOnce('search')) {
  init();
}
