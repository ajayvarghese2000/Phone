function get_messages(){
    return new Promise((resolve, reject) =>{
        url = 'https://ajayvhd.pythonanywhere.com/mes'
        fetch(url).then(response => response.json()).then(data => resolve(data));
    })
}

get_messages().then(data => create_items(data))

function create_items(data){
    console.log(data[1])
    const texts = document.getElementById("texts");
    for (let i = 0; i < data.length; i++) 
    {
        const diff = data.length - (1 + i);
        const Div = document.createElement("div");
        Div.classList = "mes"
        
        const p1 = document.createElement("p");
        const Message = document.createTextNode(data[diff]["message"]);
        p1.appendChild(Message)
        p1.classList = "motd"

        formattedTime = timeConverter(data[diff]["sent_timestamp"])
        const p2 = document.createElement("p");
        const SenderInfo = document.createTextNode(formattedTime + " " + data[diff]["from"]);
        p2.appendChild(SenderInfo)
        p2.classList = "info"

        Div.appendChild(p1)
        Div.appendChild(p2)

        texts.appendChild(Div)

    }
}


function timeConverter(UNIX_timestamp){
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(UNIX_timestamp/1000)
    return d.toLocaleString()
  }