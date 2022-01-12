$('#dark-mode').click(function ()
{
	if ($(this).is(':checked'))
	{
		$('body').addClass('dark-mode');
		$('#header').removeClass('navbar-light');
		$('#header').addClass('navbar-dark');
	}
	else
	{
		$('body').removeClass('dark-mode');
		$('#header').removeClass('navbar-dark');
		$('#header').addClass('navbar-light');
	}
});

$('[data-toggle="tooltip"]').tooltip();

window.onscroll = function() {scrollFunction()};
function scrollFunction() {
  if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0)
  {
    document.getElementById("back-to-top").style.display = "block";
  } else {
    document.getElementById("back-to-top").style.display = "none";
  }
}
function backToTop() {
  $("html, body").animate({scrollTop: 0}, 500);
}
window.getSelection().toString();

function getSelectText()
{
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}
function clearSelectText()
{
  if (window.getSelection) {
    if (window.getSelection().empty) {  // Chrome
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {  // Firefox
      window.getSelection().removeAllRanges();
    }
  } else if (document.selection) {  // IE?
    document.selection.empty();
  }
}