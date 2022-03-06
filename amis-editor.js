let token = "ghp_";
let myrepo = 'miaoski/amis-moedict';
let branch = 'safulo-draft';

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
	if(token == "ghp_") {
		alert('請先修改本 add-on 的設定，填寫你的 Github API token');
		return 0;
	}

	get_lexicon(lexicon).then(e => console.log(content.value));
}

async function get_lexicon(word) {
	url = `https://raw.githubusercontent.com/${myrepo}/${branch}/amis-deploy/s/${word}.json`;
	console.log(url);
	const ret = await (await fetch(url)).json();
	return ret;
}

function update_lexicon(word, content) {
	var data = JSON.stringify({
		"message": `修改 ${word}`,
		"content": content
	});
	var headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
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
