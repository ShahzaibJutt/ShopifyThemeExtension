document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (!tabs[0].id) {
      document.getElementById('result').textContent = 'Cannot check this page.';
      return;
    }

    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      world: "MAIN",
      func: () => {
        if (window.Shopify && window.Shopify.theme) {
          return {
            exists: true,
            theme: window.Shopify.theme
          };
        }
        return {
          exists: false,
          theme: null
        };
      }
    })
    .then(results => {
      const result = document.getElementById('result');
      if (results && results[0] && results[0].result && results[0].result.exists) {
        const theme = results[0].result.theme;
        result.textContent = `Shopify theme found!\nID: ${theme.id}\nName: ${theme.name}`;
        result.className = 'exists';
      } else {
        result.textContent = 'No Shopify theme data found.';
        result.className = 'not-exists';
      }
    })
    .catch(error => {
      document.getElementById('result').textContent = 'Error checking theme: ' + error.message;
    });
  });
});