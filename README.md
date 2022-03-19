# amis-moedict-editor
阿美語萌典用的編輯器，純前端，使用 Firefox plugin 及 Github API.


# 開發人員請注意
不要把 Github token 傳上來了 XDDDD

# 目前已知的 bug
1. 網頁 load 完之前就會 call `turnOnEditor()` 導致字串取代不到，需要 reload。
