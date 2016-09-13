var now = new Date(),
minDate = now.toISOString().substring(0,10);


//change min date that can be selected, to today's date
$('.date').prop('min', minDate);
//when leave-date is selected, update return date so min date will be leave-date
$('.leave-date').on('change',function(){
  var leaveDate = $('.leave-date').val();
  $('.return-date').prop('min', leaveDate );
});
