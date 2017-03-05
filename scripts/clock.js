$(document).ready(function () {
     if (vars.language == "en") {
        var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    } else {
        var monthNames = [ "tammikuuta", "helmikuuta", "maaliskuuta", "huhtikuuta", "toukokuuta", "kesäkuuta", "heinäkuuta", "elokuuta", "syyskuuta", "lokakuuta", "marraskuuta", "joulukuuta" ];
        var dayNames = ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"];
    }

    var newDate = new Date();
    newDate.setDate(newDate.getDate());
    $('#clock_date').html(dayNames[newDate.getDay()] + " " + newDate.getDate() + '. ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());

    setInterval(function () {
        var minutes = new Date().getMinutes();
        $("#clock_min").html(( minutes < 10 ? "0" : "" ) + minutes);
    }, 1000);

    setInterval(function () {
        var hours = new Date().getHours();
        $("#clock_hours").html(hours);
    }, 1000);
});
