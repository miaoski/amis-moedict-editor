// Default values are to be replaced by local storage
let token = 'ghp_';
let myrepo = 'g0v/amis-moedict';
let branch = 'master';

const hidePage = `body > :not(.root) {
                    display: none;
                  }`;

const turnOnEditor = () => {
	// moedict amis safulo only
	if (location.href.split('/')[3].slice(0, 2) == '#:') {
		$('body').append(`
			<div id="root"
				style="position: absolute; inset: 53px 0 0 0; z-index:300; display: none;">
			</div>
		`);
		$('li:contains("幫校對")').html(`
			<a href="javascript:editme();">
				<i class="icon-edit"></i>
				編輯本條目
			</a>`).parent().after(`
			<ul class="nav pull-right hidden-xs">
			<li>
			<a href="javascript:editme();">
				<i class="icon-plus"></i>
				新增條目
			</a>
			</li>
			</ul>
		`);
	} else {
		// Not Safulo dict. Ignore it.
	}
};

// https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
function b64DecodeUnicode(str) {
	// Going backwards: from bytestream, to percent-encoding, to original string.
	return decodeURIComponent(
		atob(str)
			.split('')
			.map(function(c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join('')
	);
}

function b64EncodeUnicode(str) {
	return btoa(
		encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
			return String.fromCharCode(parseInt(p1, 16));
		})
	);
}

function editme() {
	if(token == 'ghp_') {
		alert('請先修改本 add-on 的設定，並填寫你的 Github API token');
	} else {
		$('#root').show();
	}
}

window.close_editor = function close_editor() {
	$('#root').hide();
};

window.get_lexicon = async function get_lexicon(word) {
	var config = {
		method: 'GET',
		headers: {
			Accept: 'application/vnd.github.v3+json',
			Authorization: `Bearer ${token}`,
		},
	};
	url = `https://api.github.com/repos/${myrepo}/contents/docs/s/${word}.json?ref=${branch}`;
	const res = await fetch(url, config);
	const json = await res.json();

	const result = {
		sha: json.sha,
		data: JSON.parse(b64DecodeUnicode(json.content)),
	};
	return result;
};

window.update_lexicon = function update_lexicon(
	word,
	sha,
	content,
	onSuccess,
	onError
) {
	const this_word = (word == null || word == '') ? content['t'] : word;	// TODO: should I lower it?
	var this_content = content;
	// Workaround a bug: extra "name" when adding a new lexicon
	if(this_content['h'][0].hasOwnProperty('name')) {
		delete this_content['h'][0]['name'];
	}
	var body_msg = {
			'message': `Update ${this_word}`,
			'content': b64EncodeUnicode(JSON.stringify(this_content)),
			'branch': branch,
		};
	if(sha != null) {
		body_msg['sha'] = sha;
	}
	var config = {
		method: 'PUT',
		headers: {
			'authorization': `Bearer ${token}`,
			'accept': 'application/vnd.github.v3+json',
		},
		body: JSON.stringify(body_msg),
	};
	url = `https://api.github.com/repos/${myrepo}/contents/docs/s/${this_word}.json`;
	console.log('PUT ' + url);
	fetch(url, config)
		.then(response => response.json())
		.then(data => {
			console.log('update_lexicon: Success:', data);
			if(data.commit == undefined) {
				alert('哦哦出錯了:', data);
			} else {
				if(typeof(data.commit.sha) == 'string') {
					alert('新增修改成功!');
				} else {
					alert('哦哦出錯了:', data);
				}
			}
			if(onSuccess) {
				onSuccess();
			}
		})
		.catch(error => {
			console.error('update_lexicon: Error:', error);
			if(onError) {
				onError();
			}
		});
};

function onError(error) {
	console.log(`Error: ${error}`);
}

function onGot(item) {
	if(item.token)  token  = item.token;
	if(item.myrepo) myrepo = item.myrepo;
	if(item.branch) branch = item.branch;
}

let getting = browser.storage.sync.get();
getting.then(onGot, onError);

exportFunction(editme, window, { defineAs: 'editme' });

// after dom ready
$(document).ready(function () {
	turnOnEditor();
});

