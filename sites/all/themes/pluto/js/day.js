var Day = Day || {};
Day.dayNames = [
Drupal.t("Sunday"),
Drupal.t("Monday"),
Drupal.t("Tuesday"),
Drupal.t("Wednesday"),
Drupal.t("Thursday"),
Drupal.t("Friday"),
Drupal.t("Saturday")
];
/**
* Create a small banner indicating the number of days until
* the weekend.
*
* This will create a div element in the upper right-hand
* corner.
*/
Day.banner = function () {
	var divProps = {
		"position": "absolute",
		"top": "5px",
		"right": "25px",
		"background-color": "black",
		"color": "white",
		"padding": "4px"
	};
	var today = (new Date()).getDay();
	var dayCount = 6 - today;
	var dayFields = {
		"@day": Day.dayNames[today],
		"@satCount": Drupal.formatPlural(dayCount,"is 1 day", "are @count days"),
		"@saturday": Day.dayNames[6]
	};
	var dayText = Drupal.t(
	"Today is @day. There @satCount until @saturday.", dayFields);
	var dayDiv = '<div id="day_div"></div>';
	$('body').append(dayDiv).children('#day_div').css(divProps)
	.text(dayText);
};
$(document).ready(Day.banner);