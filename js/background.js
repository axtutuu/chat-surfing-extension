var ioSocket = io.connect("http://localhost:8080"); // チャットサーバーに接続
// var ioSocket = io.connect("http://54.64.39.47:8080"); // チャットサーバーに接続
// var api = "http://52.68.82.10";
var api = "http://localhost:3000";

var room = [];

 //function getCurrentTabUrl(callback) {
 //  var queryInfo = {
 //    active: true,
 //    currentWindow: true
 //  };
 //
 //  chrome.tabs.query(queryInfo, function(tabs) {
 //    var tab = tabs[0];
 //
 //    var url = tab.url;
 //    console.assert(typeof url == 'string', 'tab.url should be a string');
 //    callback(url);
 //  });
 //}

// TODO: URLが取得できないため一旦、後回し(´・ω・｀)ｼｮﾎﾞｰﾝ
chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
  // 現在選択されているタブを設定する
  currentTabId = tabId;

  console.log(selectInfo);
  // タブのURLを取得する
  chrome.tabs.get(tabId, function(tab) {
    console.log(tab);
  });

  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
  });

});


// getCurrentTabUrl(function(url) {
//   // Put the image URL in Google search.
//   room = url.match(/^[httpsfile]+:\/{2,3}([0-9a-zA-Z\.\-:]+?):?[0-9]*?\//i);
//   renderStatus(room[1]);
//   alert(room[1]);
// });

// document.addEventListener('DOMContentLoaded', function() {
//   getCurrentTabUrl(function(url) {
//     // Put the image URL in Google search.
//     room = url.match(/^[httpsfile]+:\/{2,3}([0-9a-zA-Z\.\-:]+?):?[0-9]*?\//i);
//     renderStatus(room[1]);
//   });
// });


// $(function() {
//
//   // 接続
//   ioSocket.on( "connect", function() {
//
//     ioSocket.emit("join_room", {room: room[1]});
//   });
//
//   // サーバーからクライアントへの送り返し
//   ioSocket.on( "s2c_message", function( data ) {
//     // TODO: ここで通知を行う
//   });
//
// });
