

function loadGames() {
    //document.cookie = "games=02,2,2,2,2,2,3,4,1,3,0/12,2,2,2,2,2,3,4,1,3,0/22,2,2,2,2,2,3,4,1,3,0/"
    var content ="<table id=\"leaderboard\"><tr><th>Winner</th><th>Score</th></tr>";
    var cookie = document.cookie
    console.log(cookie);
    // TODO: Could have it scan for equal sign
    var i = 6;
    while (i < cookie.length) {
        content += "<tr><td>"
        var winner="";
        if (cookie[i] == 0) {
            winner = "Draw";
        } else if (cookie[i] == 1) {
            winner = "Player 1"
        } else {
            winner = "Player 2"
        }
        content += winner + "</td><td>"
        i++;
        
        count = 0;
        while (i < cookie.length && cookie[i] != "/") {
            if (cookie[i] != ",") {
                count++;
            }
            i++;
        }
        i++;
        content += count + "</td></tr>";
    }
    content += "</table>"
    var div = document.getElementById("games");
    div.innerHTML = content;
    console.log(content);
}





loadGames();