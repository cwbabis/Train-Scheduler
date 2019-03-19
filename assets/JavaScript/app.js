// Initialize Firebase
var config = {
    apiKey: "AIzaSyAOiC8VsmpoZmkq0Y5AOHMI-9t1Ua4D3Ok",
    authDomain: "thomas-train-scheduler.firebaseapp.com",
    databaseURL: "https://thomas-train-scheduler.firebaseio.com",
    projectId: "thomas-train-scheduler",
    storageBucket: "thomas-train-scheduler.appspot.com",
    messagingSenderId: "92595246175"
};
firebase.initializeApp(config);
var database = firebase.database();


function childAdded() {
    $("#table-display").empty();
    database.ref().on("child_added", function (snapshot) {
        console.log(snapshot.val())
        var sv = snapshot.val();
        var name = sv.name;
        var destination = sv.destination;
        var startDate = sv.startDate;
        //var currTime = database.ServerValue.TIMESTAMP;
        //need to delete startdate from current time
        var nextArrival = startDate;
        var frequency = sv.frequency;

        /* var billed = frequency; */
        var row = $("<tr>");
        row.append("<td>" + name + "</td>");
        row.append("<td>" + destination + "</td>");
        row.append("<td>" + frequency + "</td>");

        // Time is 3:30 AM
        var firstTime = "03:30";

        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        var tRemainder = diffTime % frequency;
        console.log(tRemainder);

        var tMinutesTillTrain = frequency - tRemainder;
        row.append("<td>" + tMinutesTillTrain + ' Minute(s)' + "</td>");

        var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
        row.append("<td>" + nextTrain + "</td>");

        $("#table-display").append(row);
    })
};
childAdded();
$("#submit-btn").on("click", function (event) {
    //prevent refresh
    event.preventDefault();
    //hold input values
    var name = $("#name-display").val().trim();
    var destination = $("#destination-display").val().trim();
    var startDate = $("#start-date-display").val().trim();
    var frequency = $("#frequency-display").val().trim();
    //database push
    database.ref().push({
        name: name,
        destination: destination,
        startDate: startDate,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    childAdded();
});

