function get_messages(password){
    return new Promise((resolve, reject) =>{
        url = 'https://ajayvhd.pythonanywhere.com/mes/' + password
        fetch(url).then(response => response.json()).then(data => resolve(data));
    })
}

//get_messages().then(data => create_items(data))

function create_items(data){
    const texts = document.getElementById("texts");
    for (let i = 0; i < data.length; i++) 
    {
        const diff = data.length - (1 + i);
        const Div = document.createElement("div");
        Div.classList = "mes"
        
        const p1 = document.createElement("p");
        const Message = document.createTextNode(String(data[diff]["message"]));
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

function reset(){
    const Main = document.getElementById("texts");
    Main.innerHTML = "";
    password = document.getElementById("password").value;
    if (password == "") {
        alert("Enter a Password")
    }
    else{
        get_messages(password).then(data => success_check(data))
    }
}

function success_check(data){
    console.log(data)
    if(data["success"] == false)
    {
        document.getElementById("password").value = "";
        alert("Wrong Password");
    }
    else
    {
        var element = document.getElementById("password");
        element.style.display = "none";
        var button = document.getElementById("button");
        button.value = "Refresh"
        create_items(data)
    }

}

var password = "inspect_element_nerd";