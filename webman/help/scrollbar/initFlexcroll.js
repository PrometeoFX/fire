var ua = navigator.userAgent.toLocaleLowerCase();
var check = function(r) {
        return r.test(ua);
};
var isOpera = check(/opera/);
var isIE = !isOpera && check(/msie/);
var isIE8 = isIE && check(/msie 8/) && (document.documentMode !== 7);

function ready() {
	if(!window.done){
		var curBody = document.getElementsByTagName('body')[0];
		window.setTimeout(function() {
			fleXenv.fleXcrollMain(curBody);
			curBody.fleXcroll.updateScrollBars();
			if (window.location !== window.parent.location) {
				window.parent.postMessage(window.location.href, "*");
			}
		}, 1);
	}
};

function docReady(e) {
	if(document.readyState === "complete"){
		ready();		
	}
}
window.done = false;

if(window.addEventListener) {
	window.addEventListener('load', ready, false);
}
else if (window.attachEvent) {
	document.onreadystatechange = docReady;
}
else {
	var fn = window.onload;
	window.onload = function() {
		fn && fn();
		ready();
	}
}
