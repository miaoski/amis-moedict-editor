// moedict amis safulo only
if(location.href.split('/')[3].slice(0, 2) == '#:') {
	var c = document.querySelectorAll('nav')[0].innerHTML;
	c = c.replace(  '<a href="http://ckhis.ck.tp.edu.tw/~ljm/amis-mp/" target="_blank" title="「阿美語萌典」校對活動">',
			'<a href="#" title="編輯本條目" onClick="editme(location.href);">').replace(
			'幫校對', '編輯本條目');
	document.querySelectorAll('nav')[0].innerHTML = c;
} else {
	// Not Safulo dict. Ignore it.
}


function editme(href) {
	var lexicon = href.split('/')[3].slice(2);
	alert('我還沒寫好! 要修改的是: ' + lexicon);
}
