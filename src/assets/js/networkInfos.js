

// NOTE: window.RTCPeerConnection is "not a constructor" in FF22/23
const RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

function test1(test) {

    if (RTCPeerConnection) (function () {
        const rtc = new RTCPeerConnection({iceServers: []});
        if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
            rtc.createDataChannel('', {reliable: false});
        }

        rtc.onicecandidate = function (evt) {
            // convert the candidate to SDP so we can run it through our general parser
            // see https://twitter.com/lancestout/status/525796175425720320 for details
            if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);
        };
        rtc.createOffer(function (offerDesc) {
            grepSDP(offerDesc.sdp);
            rtc.setLocalDescription(offerDesc);
        }, function (e) {
            console.warn("offer failed", e);
        });

        const addrs = Object.create(null);
        addrs["0.0.0.0"] = false;

        function updateDisplay(newAddr) {
            if (newAddr in addrs) return;
            else addrs[newAddr] = true;
            test = addrs;
            const displayAddrs = Object.keys(addrs).filter(function (k) {
                return addrs[k];
            });
            // document.getElementById('list').textContent = displayAddrs.join(" or perhaps ") || "n/a";
        }

        function grepSDP(sdp) {
            const hosts = [];
            sdp.split('\r\n').forEach(function (line) {
                let parts;
                let addr;
// c.f. http://tools.ietf.org/html/rfc4566#page-39
                if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
                    parts = line.split(' ');
                    addr = parts[4];
                    const type = parts[7];
                    if (type === 'host') updateDisplay(addr);
                } else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
                    parts = line.split(' ');
                    addr = parts[2];
                    updateDisplay(addr);
                }
            });
        }

        return rtc;
    })(); else {
        document.getElementById('list').innerHTML = "<code>ifconfig | grep inet | grep -v inet6 | cut -d\" \" -f2 | tail -n1</code>";
        document.getElementById('list').nextSibling.textContent = "In Chrome and Firefox your IP should display automatically, by the power of WebRTCskull.";
    }
}

function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    const myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    let pc = new myPeerConnection({
            iceServers: []
        }),
        noop = function () {
        },
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason) {
        // An error occurred, so handle the failure to connect
    });

    //listen for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

// Usage

getUserIP(function(ip){
    // alert("Got IP! :" + ip);
});
