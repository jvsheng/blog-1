let HIDDEN_STYLE = `
	height:0 !important;
	overflow:hidden !important;
	position: fixed !important;
	top: -9999px !important;
	left: -9999px !important;
	opacity: 0 !important;
`;

function calcTextareaHeight(targetElement, minRows=1, maxRows=null) {
  // ...
  hiddenTextarea.value = '';
  let singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;

  hiddenTextarea.value = targetElement.value || targetElement.placeHolder;
  let height = hiddenTextarea.scrollHeight;

  if (boxSizing === 'border-box') {
    height = height + borderSize;
  } else if (boxSizing === 'content-box') {
    height = height - paddingSize;
  }
}