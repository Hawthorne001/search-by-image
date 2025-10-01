import {validateUrl, getContentXHR} from 'utils/app';
import {runOnce} from 'utils/common';
import {
  initSearch,
  prepareImageForUpload,
  sendReceipt,
  getValidHostname,
  uploadCallback
} from 'utils/engines';

const engine = 'yandex';

function showResults(xhr) {
  const params = JSON.parse(xhr.responseText).blocks[0].params;

  const tabUrl = `https://${getValidHostname()}/images/search?cbir_id=${params.cbirId}&rpt=imageview&tabInt=1&url=${params.originalImageUrl}`;

  if (validateUrl(tabUrl)) {
    window.location.replace(tabUrl);
  }
}

async function searchApi({image, storageIds} = {}) {
  const url =
    `https://${getValidHostname()}/images/touch/search?rpt=imageview&format=json` +
    `&request={"blocks":[{"block":"cbir-uploader__get-cbir-id"}]}`;

  const data = new FormData();
  data.append('upfile', image.imageBlob);

  const xhr = getContentXHR();
  xhr.addEventListener('load', function () {
    sendReceipt(storageIds);

    uploadCallback(this, showResults, engine);
  });
  xhr.open('POST', url);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader(
    'Accept',
    'application/json, text/javascript, */*; q=0.01'
  );
  xhr.send(data);
}

async function search({session, search, image, storageIds} = {}) {
  image = await prepareImageForUpload({
    image,
    engine,
    target: 'api'
  });

  await searchApi({image, storageIds});
}

async function engineAccess() {
  if (window.location.pathname.startsWith('/showcaptcha')) {
    return false;
  }

  return true;
}

function init() {
  initSearch(search, engine, taskId, {engineAccess, documentVisible: true});
}

if (runOnce('search')) {
  init();
}
