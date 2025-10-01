import {findNode, makeDocumentVisible, runOnce} from 'utils/common';
import {setFileInputData, initSearch, sendReceipt} from 'utils/engines';

const engine = 'depositphotos';

async function search({session, search, image, storageIds}) {
  (
    await findNode('body:not(.preload) div[data-qa="SearchByImageBoxV2"]', {
      observerOptions: {attributes: true, attributeFilter: ['class']}
    })
  ).click();

  const inputSelector = 'input[type=file]';
  const input = await findNode(inputSelector);

  await setFileInputData(inputSelector, input, image);

  await sendReceipt(storageIds);

  input.dispatchEvent(new Event('change', {bubbles: true}));
}

function init() {
  makeDocumentVisible();
  initSearch(search, engine, taskId);
}

if (runOnce('search')) {
  init();
}
