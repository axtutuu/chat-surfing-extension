// var ioSocket = io.connect("http://localhost:3000"); // チャットサーバーに接続
var ioSocket = io.connect("http://54.64.39.47:8080"); // チャットサーバーに接続

$(function() {
  // サーバーからのデータ受け取り処理
  ioSocket.on( "connect", function() {} ); // 接続
  ioSocket.on( "disconnect", function() {} ); // 切断

  // サーバーからクライアントへの送り返し
  ioSocket.on( "s2c_message", function( data ) { appendMessage( data.value ) });

  // 画面にメッセージを追記
  function appendMessage( text ) {
      $("#messageView").append( "<div>" + text + "</div>" );
  }

  // 自分を含む全員宛にメッセージを送信
  $("#sendMessageBtn").click( function() {

      // メッセージの内容を取得し、その後フォームをクリア
      var message = $("#messageForm").val();
      $("#messageForm").val("");

      // クライアントからサーバーへ送信
      ioSocket.emit( "c2s_message", { value : message } );
  });

  // 自分以外の全員宛にメッセージを送信
  $("#sendMessageBroadcastBtn").click( function() {

      // メッセージの内容を取得し、その後フォームをクリア
      var message = $("#messageForm").val();
      $("#messageForm").val("");

      // クライアントからサーバーへ送信
      ioSocket.emit( "c2s_broadcast", { value : message } );
  });
});

