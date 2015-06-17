var long_questions = [
	"I am a <input class='number'></input> year old \
          <select>\
            <option value='white'>white</option>\
            <option value='nonwhite'>nonwhite</option>\
          </select>\
          <select>\
            <option value='male'>male</option>\
            <option value='female'>female</option>\
          </select> ."
]

var short_questions = [
	"<label>Birthdate</label> Month <input class='number'></input>\
		Day <input class='number'></input>\
		Year <input class='number'></input>",
	"I am a \
		<select>\
		<option value='0'>single</option>\
		<option value='0.8'>engaged</option>\
		<option value='1'>married</option>\
		</select>\
		<select>\
		<option value='white'>white</option>\
		<option value='black'>black</option>\
		<option value='other'>other</option>\
		</select>\
		<select>\
		<option value='male'>male</option>\
		<option value='female'>female</option>\
		</select> .",
    'I \
    	<select name="smoking">\
		<option value="0"> have never smoked.\
		</option><option value="0"> currently do not smoke.\
		</option><option value=".14"> smoke 1 cigarette per week.\
		</option><option value="1"> smoke 1 cigarette per day.\
		</option><option value="2"> smoke 2 cigarettes per day.\
		</option><option value="4"> smoke 4 cigarettes per day.\
		</option><option value="10"> smoke 10 cigarettes per day.\
		</option><option value="20"> smoke a pack a day.\
		</option><option value="40"> smoke two packs a day.\
		</option><option value="60"> smoke three packs a day.\
		</option><option value="80"> chain smoke.\
		</option></select>',
    'I <select name="seat_belt">\
	    <option value="1"> always wear\
	    </option><option value=".2" selected=""> sometimes wear\
	    </option><option value="0"> never wear\
	    </option></select> a seat belt in a car.',
	'I travel \
		<select name="driving">\
	    <option value="0"> zero\
	    </option><option value="1"> one thousand\
	    </option><option value="5"> five thousand\
	    </option><option value="10" selected=""> 10 thousand\
	    </option><option value="20"> 20 thousand\
	    </option><option value="30"> 30 thousand\
	    </option><option value="40"> 40 thousand\
	    </option><option value="50"> 50 thousand\
	    </option><option value="75"> 75 thousand\
	    </option><option value="100"> 100 thousand\
	    </option></select>\
		miles per year in a car.',
	'I exercise \
		<select name="exercise">\
		<option value="0"> infrequently.\
		</option><option value=".33" selected=""> 20 minutes per week.\
		</option><option value=".66"> 40 minutes per week.\
		</option><option value="1">   60 minutes per week.\
		</option><option value="1.5"> 90 minutes per week.\
		</option><option value="2"> two hours per week.\
		</option><option value="3"> three hours per week.\
		</option><option value="4"> four hours per week.\
		</option><option value="5"> five hours per week.\
		</option><option value="7"> 1 hour per day.\
		</option><option value="14"> 2 hours per day.\
		</option></select>'

]

var questions = [];
var responses = [];
var index = 0;
var expected_date;
localStorage;

document.addEventListener('DOMContentLoaded', function() {
	if (localStorage['load_countdown']) {
		$(".container").empty();
		countdown(Date.parse(localStorage["expected_date"]));
	}
    var b_start = document.getElementById('start');
    b_start.addEventListener('click', function() {
        start(this);
    });
    var b_next = document.getElementById('next');
    b_next.addEventListener('click', function() {
        next();
    });
});

function countdown(dt) {
	$("#countdown").show();

    var end = new Date(dt);
    var _year = 1000 * 60 * 60 * 24 * 365;
    var timer;

    function update() {
        var now = new Date();
        var distance = end - now;

        var years = (distance / _year).toFixed(9);

        var year_strings = (years+"").split(".");

        $("#countdown #left").text(year_strings[0]);
        $("#countdown #right").text("."+year_strings[1]);
    }

    timer = setInterval(update, 100);
}

function start(e) {
	if (e.className == "short") {
		questions= short_questions;
		$(".next label.empty").remove();
	} else {
		questions = long_questions;
		$(".next label.empty").hide();
	}
	$(".question").html(questions[index]);
	$(".next").show();
	
	$(".next label.birthday").hide();
	index++;
}

function next() {
	if (index == 1) {
		var emptybd = false;
		$("input").each(function() {
			if ($(this).val() == "") {
				emptybd = true;
				$(".next label.birthday").show();
			}
		});
		if (!emptybd) {
			$(".next label.birthday").hide();
			$("input, select").each(function() {
				responses.push($(this).val());
			});
			$(".question").html(questions[index]);
			$(".next label.empty").show();
			index++;
		}
	}
	else if (index < questions.length) {
		$("input, select").each(function() {
			responses.push($(this).val());
		});
		$(".question").html(questions[index]);
		index++;
	} else {
		$(".question").hide();
		$(".next").hide();
		var birthday = new Date(responses[2]+"-"+responses[0]+"-"+responses[1]);
  		var age = ~~((Date.now() - birthday) / (31557600000));
		$.getJSON("http://alloworigin.com/get?url=" + encodeURIComponent(
			"http://gosset.wharton.upenn.edu/~foster/mortality/form-manager.pl?"+
			"married="+responses[3]+"&race="+responses[4]+"&gender="+responses[5]+
			"&smoking="+responses[6]+"&age="+age+"&seat_belt="+responses[7]+
			"&driving="+responses[8]+"&exercise="+responses[9]), 
			function(data){
				var expected = Number(data.contents.split("live to ")[1].split(" years")[0]);
				expected_date = birthday;
				expected_date.setDate(expected_date.getDate() + expected*365);
				$(".container").empty();
				countdown(expected_date);

				//local storage
				localStorage['expected_date'] = expected_date;
				localStorage.setItem('load_countdown', JSON.stringify(true));
			});
	}
}