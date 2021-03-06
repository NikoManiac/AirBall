var https=require('https');
var fs = require('fs'); 
var outputFilename = './myData.json';


//get 请求外网  
function get() {
    let resdata = [];
    for (let i = 1; i < 39; i++) {
        setTimeout(() => {
            let url = `https://api-all.9h-sports.com/cba-data/api/cba/v1/league/match-current?year=20172018&round=${i}&league_sub_id=2`;
            https.get(url,function(req,res){  
                var html='';  
                req.on('data',function(data){  
                    html+=data;  
                });  
                req.on('end',function(){
                    let res = JSON.parse(html).data;

                    for (key of res) {
                        let isHomeWin = key.league_match.homeScore > key.league_match.guestScore;
                        let WLoc = isHomeWin ? 'H' : 'V';
                        resdata.push({
                            id: key.league_match.id,
                            WLoc: WLoc,
                            WTeam: isHomeWin ? key.league_match.homeClubName : key.league_match.guestClubName,
                            LTeam: isHomeWin ? key.league_match.guestClubName : key.league_match.homeClubName
                        }) 
                    }
                    console.log(resdata);
                    if (i === 38) {
                        fs.writeFile(outputFilename, JSON.stringify(resdata), function(err) {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log("JSON saved to " + outputFilename);
                            }
                        });
                    }
                });
            });    
        }, i * 1000);
    }
}

get();
