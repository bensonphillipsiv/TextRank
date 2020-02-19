
document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('button').addEventListener('click', onclick, false)

    function onclick(){
        chrome.tabs.query({currentWindow: true, active: true}, 
        function (tabs){

            chrome.tabs.sendMessage(tabs[0].id, "button clicked", setTopSents)
        })
    }

    // function setTopSents(res){
    //     const div = document.createElement('div')
    //     div.textContent = `${res.TopSentences}`
    //     document.body.appendChild(div);
    // }

    //creating a table of the top sentences
    function setTopSents(res){
        var $table = document.createElement("table"), $row, $col;
        $table.className = "table";

        for(var i = res.TopSentences.length; i > 0; i--){
            $row = $table.insertRow(0);

            $col = $row.insertCell(0);
            $col.innerText = i;

            $col = $row.insertCell(1);
            $col.innerText = res.TopSentences[i-1];
        }
        document.body.appendChild($table);
    }
}, false)