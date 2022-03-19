let token = 'ghp_';
let myrepo = 'miaoski/amis-moedict';
let branch = 'safulo-draft';

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
			</a>
			<a href="javascript:editme();">
				<i class="icon-plus"></i>
				新增條目
			</a>
		`);
	} else {
		// Not Safulo dict. Ignore it.
	}
};

// after dom ready
$(document).ready(function () {
	var checkExist = setInterval(function() {
		if($('li:contains("幫校對")')) {
			turnOnEditor();
			clearInterval(checkExist);
		}
		if($('li:contains("編輯本條目")')) {
			clearInterval(checkExist);
		}
	}, 100);
});

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
		alert('請先修改本 add-on 的設定，填寫你的 Github API token');
		return 0;
	}
	$('#root').show();
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
	url = `https://api.github.com/repos/${myrepo}/contents/amis-deploy/s/${word}.json?ref=safulo-draft`;
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
	const body_msg = {
			'message': `Update ${word}`,
			'content': b64EncodeUnicode(JSON.stringify(content)),
			'branch': branch,
			'sha': sha,
		};
	var config = {
		method: 'PUT',
		headers: {
			'authorization': `Bearer ${token}`,
			'accept': 'application/vnd.github.v3+json',
		},
		body: JSON.stringify(body_msg),
	};
	url = `https://api.github.com/repos/${myrepo}/contents/amis-deploy/s/${word}.json`;
	fetch(url, config)
		.then(response => response.json())
		.then(data => {
			console.log('update_lexicon: Success:', data);
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
	if(item.token) {
		token = item.token;
	}
}

let getting = browser.storage.sync.get('token');
getting.then(onGot, onError);

exportFunction(editme, window, { defineAs: 'editme' });
