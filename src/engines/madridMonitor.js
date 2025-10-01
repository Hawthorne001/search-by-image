import {findNode, runOnce} from 'utils/common';
import {setFileInputData, initSearch, sendReceipt} from 'utils/engines';
import {targetEnv} from 'utils/config';

const engine = 'madridMonitor';

async function search({session, search, image, storageIds} = {}) {
  (await findNode('#imageModeLink')).click();

  await findNode('.fileTarget-open');

  const inputSelector = 'input#imageFileUpload';
  const input = await findNode(inputSelector);

  await setFileInputData(inputSelector, input, image, {
    patchInput: targetEnv === 'safari'
  });

  input.dispatchEvent(new Event('change'));

  // wait for image to load
  await findNode('.ui-icon-pencil');

  // select Concept strategy
  (await findNode('a[data-hasqtip="83"]')).click();

  // deselect all image types
  (await findNode('a[data-hasqtip="89"]')).click();
  (await findNode('a[data-hasqtip="90"]')).click();

  await sendReceipt(storageIds);

  window.setTimeout(async () => {
    (
      await findNode('#image_search_container .searchButtonContainer a')
    ).click();
  }, 100);
}

function init() {
  initSearch(search, engine, taskId);
}

if (runOnce('search')) {
  init();
}
