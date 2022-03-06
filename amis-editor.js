let token = "ghp_";

// moedict amis safulo only
if(location.href.split('/')[3].slice(0, 2) == '#:') {
	document.querySelectorAll('nav').forEach( e => {
		e.innerHTML = e.innerHTML.replace(
			'"http://ckhis.ck.tp.edu.tw/~ljm/amis-mp/" target="_blank"', '"javascript:editme(location.href);"').replace(
			'幫校對', '編輯本條目');
	});
} else {
	// Not Safulo dict. Ignore it.
}

function editme(href) {
	var lexicon = href.split('/')[3].slice(2);
	alert('我還沒寫好! 要修改的是: ' + lexicon);
}

function onError(error) {
	console.log(`Error: ${error}`);
}

function onGot(item) {
	if (item.token) {
		token = item.token;
	}
}

let getting = browser.storage.sync.get("token");
getting.then(onGot, onError);

exportFunction(editme, window, {defineAs: 'editme'});
