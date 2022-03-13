let token = "ghp_";
let myrepo = 'miaoski/amis-moedict';
let branch = 'safulo-draft';

const hidePage = `body > :not(.root) {
                    display: none;
                  }`;
const rootBlockCSS = 'position: absolute; top: 53px; left: 0; right: 0; z-index:300;'

// moedict amis safulo only
if(location.href.split('/')[3].slice(0, 2) == '#:') {
	const root = document.createElement("div");
	root.setAttribute("id", "root");
	document.body.insertBefore(root, null);
	document.getElementById('root').style = rootBlockCSS + ' display: none;';
	document.querySelectorAll('nav').forEach( e => {
		e.innerHTML = e.innerHTML.replace(
			'"http://ckhis.ck.tp.edu.tw/~ljm/amis-mp/" target="_blank"', '"javascript:editme(location.href);"').replace(
			'幫校對', '編輯本條目');
	});
} else {
	// Not Safulo dict. Ignore it.
}

// https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
function b64DecodeUnicode(str) {
	// Going backwards: from bytestream, to percent-encoding, to original string.
	return decodeURIComponent(atob(str).split('').map(function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));
}

function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode(parseInt(p1, 16))
    }))
}

function editme(href) {
	var word = href.split('/')[3].slice(2);
	if(token == "ghp_") {
		alert('請先修改本 add-on 的設定，填寫你的 Github API token');
		return 0;
	}

	document.getElementById('root').style = rootBlockCSS + ' display: block;';
	get_lexicon(word).then(e => {
		sha = e.sha;
		data = JSON.parse(b64DecodeUnicode(e.content));
		console.log(sha);
		console.log(data);

		data['extra'] = '測試中';
		// update_lexicon(word, sha, data);
	});
}

function get_lexicon(word) {
	var config = {
		method: 'GET',
		headers: {
			'Accept': 'application/vnd.github.v3+json',
			'Authorization': `Bearer ${token}`
		}
	};
	url = `https://api.github.com/repos/${myrepo}/contents/amis-deploy/s/${word}.json?ref=safulo-draft`;
	console.log(url);
	const ret = fetch(url, config)
		.then(response => response.json())

	return ret;
}

function update_lexicon(word, sha, content) {
	var config = {
		method: 'PUT',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Accept': 'application/vnd.github.v3+json',
			'Content-Type': 'application/json'
		},
		body: new URLSearchParams({
			"message": `Update ${word}`,
			"content": b64EncodeUnicode(JSON.stringify(content)),
			'branch': branch,
			'sha': sha
		})
	};
	url = `https://api.github.com/repos/${myrepo}/contents/amis-deploy/s/${word}.json`;
	console.log(url);
	console.log(config);
	alert('TODO: Uncomment the save function! Check console.log()');
	/*
	fetch(url, config)
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	*/
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
