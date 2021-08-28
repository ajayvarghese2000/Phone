function get_messages(password) {
    return new Promise((resolve, reject) => {
        url = 'http://thebigserver.xyz/mes/' + password
        fetch(url).then(response => response.json()).then(data => resolve(data));
    })
}

function create_items(data) {
    const texts = document.getElementById("texts");
    for (let i = 0; i < data.length; i++) {
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


function timeConverter(UNIX_timestamp) {
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(UNIX_timestamp / 1000)
    return d.toLocaleString()
}

function reset() {
    const Main = document.getElementById("texts");
    Main.innerHTML = "";
    password = document.getElementById("password").value;
    if (password == "") {
        alert("Enter a Password")
    } else {
        var totpObj = new TOTP();
        try {
            password = totpObj.getOTP(password);
            get_messages(password).then(data => success_check(data))
        } catch (error) {
            var element = document.getElementById("password");
            element.style.display = "block";
            var button = document.getElementById("button");
            button.value = "Submit"
            document.getElementById("password").value = "";
            alert("Wrong Password");
        }

    }
}

function success_check(data) {
    if (data["success"] == false) {
        var element = document.getElementById("password");
        element.style.display = "block";
        var button = document.getElementById("button");
        button.value = "Submit"
        document.getElementById("password").value = "";
        alert("Wrong Password");
    } else {
        var element = document.getElementById("password");
        element.style.display = "none";
        var button = document.getElementById("button");
        button.value = "Refresh"
        create_items(data)
    }
}


TOTP = function () {

    var dec2hex = function (s) {
        return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
    };

    var hex2dec = function (s) {
        return parseInt(s, 16);
    };

    var leftpad = function (s, l, p) {
        if (l + 1 >= s.length) {
            s = Array(l + 1 - s.length).join(p) + s;
        }
        return s;
    };

    var base32tohex = function (base32) {
        var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        var bits = "";
        var hex = "";
        for (var i = 0; i < base32.length; i++) {
            var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
            bits += leftpad(val.toString(2), 5, '0');
        }
        for (var i = 0; i + 4 <= bits.length; i += 4) {
            var chunk = bits.substr(i, 4);
            hex = hex + parseInt(chunk, 2).toString(16);
        }
        return hex;
    };

    this.getOTP = function (secret) {
        try {
            var epoch = Math.round(new Date().getTime() / 1000.0);
            var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, "0");
            var hmacObj = new jsSHA(time, "HEX");
            var hmac = hmacObj.getHMAC(base32tohex(secret), "HEX", "SHA-1", "HEX");
            var offset = hex2dec(hmac.substring(hmac.length - 1));
            var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + "";
            otp = (otp).substr(otp.length - 6, 6);
        } catch (error) {
            throw error;
        }
        return otp;
    };

}

var password = "inspect_element_nerd";