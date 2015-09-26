var ioSocket = io.connect("http://localhost:8080"); // チャットサーバーに接続
// var ioSocket = io.connect("http://54.64.39.47:8080"); // チャットサーバーに接続
var api = "http://52.68.82.10";
// var api = "http://localhost:3000";

var room = [];
var room_id;
var user_id;

function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    // Put the image URL in Google search.
    room = url.match(/^[httpsfile]+:\/{2,3}([0-9a-zA-Z\.\-:]+?):?[0-9]*?\//i);
    renderStatus(room[1]);
  });
});

function postUserData(user) {
  $.ajax({
    type: "POST",
    url : api + "/users",
    data: {
      "name": user
    },
    success: function(data){
      console.log(data);
      user_id = data.results.user_id;
    }
  });
}

function postRoomData(room) {
  $.ajax({
    type: "POST",
    url:  api + "/rooms",
    data: {
      "name": room
    },
    success: function(data){
      console.log(data.results.room_id);
      room_id = data.results.room_id;

      fetchChatData(room_id);
    }
  });
}

function postChatData(user_id, room_id, message) {
  $.ajax({
    type: "POST",
    url : api + "/chats",
    data: {
      "user_id": user_id,
      "room_id": room_id,
      "message": message,
    },
  });
}

function fetchChatData(room_id) {
  $.ajax({
    type: "GET",
    url : api + "/chats?room_id=" + room_id,
    success: function(data) {

      $.each(data.results, function(index, elem){
        appendFirstData(elem);
      });

    }
  });
}

function appendFirstData(data) {
    $("#chats").append( '<div class="box_right"><p><span style="color: blue;"> ID: ' + data.name +'</span></p><div class="arrow_box_right">' + data.message + '</div></div><div class="clear"></div>' );
}

$(function() {
  // サーバーからのデータ受け取り処理

  // 接続
  ioSocket.on( "connect", function() {

    console.log(ioSocket.id);
    ioSocket.emit("join_room", {room: room[1]});

    // ルームの作成
    postRoomData(room[1]);
    // Userの作成
    postUserData(ioSocket.id);


  });

  ioSocket.on( "disconnect", function() {} ); // 切断

  // サーバーからクライアントへの送り返し
  ioSocket.on( "s2c_message", function( data ) { appendMessage( data ) });

  // 画面にメッセージを追記
  function appendMessage( data ) {
      // $("#messageView").append( "<div>" + text + "</div>" );
      $("#chats").append( '<div class="box_right"><p><span style="color: blue;"> ID: ' + data.id +'</span></p><div class="arrow_box_right">' + data.value + '</div></div><div class="clear"></div>' );
  }

  // 自分で送信したメッセージ用
  function appendMyMessage(text) {
    $('#chats').append('<div class="box_left"><div class="arrow_box_left">' + text + '</div></div><div class="clear"></div>');
  }

  // 自分を含む全員宛にメッセージを送信
  $("#sendMessageBtn").click( function() {
      // メッセージの内容を取得し、その後フォームをクリア
      var message = $("#messageForm").val();
      $("#messageForm").val("");
      // クライアントからサーバーへ送信
      ioSocket.emit( "c2s_message", { value : message, room: room[1]} );
  });

  // 自分以外の全員宛にメッセージを送信
  $("#sendMessageBroadcastBtn").click( function() {
      // メッセージの内容を取得し、その後フォームをクリア
      var message = $("#messageForm").val();
      appendMyMessage(message);
      $("#messageForm").val("");

      console.log("user_id:" + user_id + "room_id:" + room_id);
      // chatの作成
      postChatData(user_id, room_id, message);

      // クライアントからサーバーへ送信
      ioSocket.emit( "c2s_broadcast", { value : message, room: room[1]} );
  });
});
