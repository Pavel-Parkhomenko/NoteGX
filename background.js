chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "popup_opened") {
    chrome.storage.local.get("gxNote", (data) => {
        if(data.gxNote) {
            sendResponse({ 
                data,
                st: 200
            });
        }
        else sendResponse({ 
            data: null,
            st: 500
        });
    })
  }

  return true;  
});