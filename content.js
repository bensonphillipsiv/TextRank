
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
    const pageContent = document.documentElement.innerText;
    var text = "";

    if(window.getSelection().toString()){
        text = window.getSelection().toString();
        console.log("something selected")
    }
    else{
        var textA = document.documentElement.getElementsByTagName('P');
        console.log(textA[5].innerText);
        for(i = 0; i < textA.length; i++){
            text += " ";
            text += textA[i].innerText;
        }
        console.log("nothing selected");
    }

    //var topSent = textRank(pageContent);
    var topSent = textRank(text);

    sendResponse({TopSentences: topSent});
    
})

function textRank(text){
    digestArray = digest(text);
    digestedText = digestArray[0];  //pure form of sentences
    finalSents = [];

    //ranking senteces on how they correlate with other sentences
    //digestArray[1] = 2D array with each word of each sentence split up
    var dict = connections(digestArray[1]);

    mostVisitedSents = iterate(dict, 1000000);
    var topSent = [];
    for(_ = 0; _ < 3; _++){
        var val = 0;
        for(i = 0; i < digestedText.length; i++){
            if(val < mostVisitedSents[i] && (!topSent.includes(i) || topSent.length == 0)){
                topSent[_] = i;
                val = mostVisitedSents[i];
            }
        }
    }

    for(j = 0; j < topSent.length; j++){
        console.log(digestedText[topSent[j]]);
        finalSents.push(digestedText[topSent[j]]);
    }
    return finalSents;
}

function digest(doc){
    var text = doc.replace("\n", " ");
    var rankText = [];
    var digestedText = text.match(/[^\.!\?]+[\.!\?]+["']?|.+$/g);
    var textArray = [];
    
    for(i = 0; i < digestedText.length; i++){
        digestedText[i] = digestedText[i].trim();
        rankText[i] = digestedText[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        rankText[i] = rankText[i].toLowerCase();
    }

    for(j = 0; j < rankText.length; j++){
        textArray[j] = rankText[j].split(" ");
    }

    return [digestedText, textArray]
}

function connections(textArray){
    var stopwords = ["a","about","above","after","again","against","all","am","an","and","any","are","aren't","as","at","be","because","been","before","being","below","between","both","but","by","can't","cannot","could","couldn't","did","didn't","do","does","doesn't","doing","don't","down","during","each","e.g.","few","for","from","further","had","hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself","let's","me","more","most","mustn't","my","myself","no","nor","not","of","off","on","once","only","or","other","ought","our","ours","ourselves","out","over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't","so","some","such","than","that","that's","the","their","theirs","them","themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up","very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's","where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves"]

    //declaring 2D array
    var dict = [], cols = textArray.length;
    for ( var _ = 0; _ < cols; _++ ) {
      dict[_] = []; 
    }

    var counter;
    //for each sentence
    for(i1 = 0; i1 < textArray.length; i1++){
        //for each sentence2
        for(j1 = 0; j1 < textArray.length; j1++){
            counter = 0;

            //for each word in sentence
            for(i2 = 0; i2 < textArray[i1].length; i2++){
                //for each word in sentence2
                for(j2 = 0; j2 < textArray[j1].length; j2++){
                    if( textArray[i1][i2] == textArray[j1][j2] && i1 != j1){
                        counter++;
                    }
                }
            }

            dict[i1][j1] = counter;
        }
    }
    
    return percentageRanks(dict);
}

function percentageRanks(dict){
    for(i = 0; i < dict.length; i++){
        //summing the connections to other sentences
        var val = dict[i].reduce((a, b) => a + b, 0);

        for(j = 0; j < dict.length; j++){
            dict[i][j] = dict[i][j]/val;
        }
    }
    
    return dict;
}

function iterate(graph, numOfIterations){
    var onNode = Math.floor(Math.random()*graph.length);
    var vistedNodes = []
    var lastProb;

    for(_ = 0; _ < numOfIterations; _++){
        var rand = Math.random();
        lastProb = 0;

        for(i = 0; i < graph.length; i++){
            lastProb += graph[onNode][i];

            if(rand < lastProb){
                vistedNodes.push(i)
                onNode = i;
                break;
            }
        }
        if(vistedNodes.length == 0){
            var onNode = Math.floor(Math.random()*graph.length);
        }
    }
    return rank(graph, vistedNodes);
}

function rank(graph, vistedNodes){
    var mostVisitedSents = [];
    for(i = 0; i < graph.length; i++){
        var add = 0;

        for(j = 0; j < vistedNodes.length; j++){
            if(i == vistedNodes[j]){
                add++;
            }
        }
        mostVisitedSents[i] = add;
    }
    console.log(mostVisitedSents);
    return mostVisitedSents;
    
}