import {findNode, runOnce} from 'utils/common';
import {setFileInputData, initSearch, sendReceipt} from 'utils/engines';

const engine = 'saucenao';

async function search({session, search, image, storageIds} = {}) {
  const autoSubmit = await findNode('input#auto-cb');
  if (!autoSubmit.checked) {
    autoSubmit.click();
  }

  if (search.assetType === 'image') {
    const inputSelector = 'input#fileInput';
    const input = await findNode(inputSelector);

    await setFileInputData(inputSelector, input, image);

    await sendReceipt(storageIds);

    input.dispatchEvent(new Event('change'));
  } else {
    const input = await findNode('input#urlInput');

    await sendReceipt(storageIds);

    input.value = image.imageUrl;

    // input.blur() is only dispatched when the tab is active
    input.dispatchEvent(new Event('blur'));
  }
}

function init() {
  initSearch(search, engine, taskId);
}

if (runOnce('search')) {
  init();
}
