// redirect to secure connection
location.protocol === 'http:' && (location.protocol = 'https:');
      
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
      
function textChange(newText=null) {
  const textarea = document.querySelector('textarea');
  const targetVal = newText || textarea.value;
  const a = document.querySelector('a#gen');
  const iframe = document.querySelector('iframe');
  const iframeEditable = document.getElementById('editable').checked;
  a.href = location.origin +'/#'+ encodeURI(targetVal);
  if (newText && iframeEditable)  // If changed by iframe
    textarea.value = targetVal;
  else {
    iframe.srcdoc = `<html contenteditable="${iframeEditable}" oninput="window.parent.textChange(this.innerHTML)">`+ targetVal + '</html>';
    iframe.contentWindow.isEditor = true;
  }
  //location.hash = 'edit=' + encodeURI(targetVal);
  history.replaceState(null, null, '#edit=' + encodeURI(targetVal));
}

// Adapted from https://stackoverflow.com/questions/11076975/how-to-insert-text-into-the-textarea-at-the-current-cursor-position
function insertAtCursor(myField, myValue) {
    //IE support
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
}

function handlePaste(event) {
  let paste = (event.clipboardData || window.clipboardData).getData('text');
  // Remove site URL prefix
  const regex = new RegExp('^' + location.origin + '/?#?(edit=)?');
  paste = decodeURI(paste).replace(regex, '');

  insertAtCursor(event.target, paste);
  textChange();

  event.preventDefault();
}

function copyTo(target) {
  navigator.clipboard.writeText('<iframe style="width: 100%; height: 300px;" src="' + document.querySelector('a#gen').href + '"></iframe>');
  target.innerText = 'Copied!';
  setTimeout(() => target.innerText = "Copy iframe", 2000);
}

window.onload = () => {
  const textarea = document.querySelector('textarea');
  const cmd = location.hash.split('=')[0];
  if (cmd === '' || cmd === '#edit') {
    textarea.value = decodeURI(location.hash.substring(6));
    document.title = "Edit | " + document.title;
    textChange();
  } else {
    document.write(document.head.outerHTML + decodeURI(location.hash.substring(1)));
  }
  document.body.style.display = 'block';
}