var countDownDate = new Date("29 March 2021 6:00:00 UTC");

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

// Update the count down every 1 second
var x = setInterval(function() {

    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    //let result = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

    let result = pad(days,2) + ":" + pad(hours,2)  + ":" + pad(minutes,2) + ":" + pad(seconds,2);

    let elems = document.getElementsByClassName("launch");
    for( let i = 0; i < elems.length; i ++ ) {
        elems[i].innerHTML = result;
    }

    document.getElementById("presale-box").style.visibility = 'visible';

    // If the count down is finished, write some text
    if (distance < 0) {
        clearInterval(x);
        for( let i = 0; i < elems.length; i ++ ) {
            elems[i].innerHTML = "";
        }
    
        document.getElementById("presale-box").style.visibility = 'hidden';
    }
}, 1000);