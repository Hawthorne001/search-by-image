import {findNode, runOnce} from 'utils/common';
import {setFileInputData, initSearch, sendReceipt} from 'utils/engines';

const engine = 'icons8';

async function search({session, search, image, storageIds} = {}) {
  (await findNode('button.search-autocomplete__img-trigger')).click();

  const inputSelector = 'input#file-input';
  const input = await findNode(inputSelector);

  await setFileInputData(inputSelector, input, image);

  await sendReceipt(storageIds);

  input.dispatchEvent(new Event('input'));
}

function init() {
  initSearch(search, engine, taskId, {documentVisible: true});
}

if (runOnce('search')) {
  init();
}
