
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		var eventCollections;
		ds.Event.all({
			orderBy:"startDate",
			autoExpand: "sessions",
			onSuccess:function(event) {	
				var count = event.entityCollection.length;
//				eventCollections = event.entityCollection;
//				console.log(eventCollections.length);
				$(".loadDays").click(function(){ 
			    	console.log(this.id);
			    	daysPageGeneration(event.entityCollection,this.id);
			    });
//				event.entityCollection.forEach({
//				onSuccess: function(event2) {
//					//myHTML += '<p>' + escapeHTML(event2.entity.name.getValue()) + '</p>';
//				},
//				atTheEnd: function(end) {
//					var stop = new Date();
//					var executionTime = stop - start;
//					$('#container2').html(myHTML);
//					$$('richText9').setValue(executionTime+ "ms");	
//				}
//			});		
		}}); 
		console.log(eventCollections);
		function daysPageGeneration(eventCollections,day){
			eventCollections.query("name = :1 | name %% :1", day, {
	                autoExpand: "sessions", 
	                onSuccess: function(event) { 
	                	//console.log(event.entityCollection.length);
	                	event.entityCollection.forEach({
	                        onSuccess: function(ev) {
	                        	var startDate = ev.entity.startDate.getValue();
	                        	var endDate = ev.entity.endDate.getValue();
    							$('#daysListView').empty().listview('refresh');
	                        	$('#daysListView').append('<li data-theme="c">' + '<a class="loadTimes" href="#page3" data-transition="slide">'+ '<h3>'+ getTheDay(startDate) + " " + formatDate(startDate) +'</h3><p>4D Summit Pre-Class</p>' + '</li>').listview('refresh');
	                        	while(startDate < endDate){
	                        		startDate.setDate(startDate.getDate() + 1);
		                        	//console.log(Math.round((ev.entity.endDate.getValue() - ev.entity.startDate.getValue()) / (1000*60*60*24)));
		                        	$('#daysListView').append('<li data-theme="c">' + '<a class="loadTimes" href="#page3" data-transition="slide">'+ '<h3>'+ getTheDay(startDate) + " " + formatDate(startDate) +'</h3><p>4D Summit keynotes  breakout sessions</p>' + '</li>').listview('refresh');
 
								}
	                        }
	                    })
	          		}
	          })
		}
//		$(".loadDays").click(function(){ 
//			  console.log(this.id);
//			  WAF.ds.Event.query("name = :1 | name %% :1", this.id, {
//	                autoExpand: "sessions", 
//	                onSuccess: function(event) { 
//	                	//console.log(event.entityCollection.length);
//	                	event.entityCollection.forEach({
//	                        onSuccess: function(ev) {
//	                        	var startDate = ev.entity.startDate.getValue();
//	                        	var endDate = ev.entity.endDate.getValue();
//    							$('#daysListView').empty().listview('refresh');
//	                        	$('#daysListView').append('<li data-theme="c">' + '<a class="loadTimes" href="#page3" data-transition="slide">'+ '<h3>'+ formatDate(startDate) +'</h3>' + '</li>').listview('refresh');
//	                        	while(startDate < endDate){
//	                        		startDate.setDate(startDate.getDate() + 1);
//		                        	console.log(Math.round((ev.entity.endDate.getValue() - ev.entity.startDate.getValue()) / (1000*60*60*24)));
//		                        	$('#daysListView').append('<li data-theme="c">' + '<a class="loadTimes" href="#page3" data-transition="slide">'+ '<h3>'+ formatDate(startDate) +'</h3>' + '</li>').listview('refresh');
// 
//								}
//	                        }
//	                    })
//	          		}
//	          })
//		});
		$('.goBack').click(function(){
			if($('#daysListView li').size() > 1){	
				$.mobile.changePage("#page1", { transition: "slide",reverse:true});
			}
			else {
				$.mobile.changePage("#page0", { transition: "slide",reverse:true});
			}
				
		})
		function formatDate(date) {// ultility to formate date to mm/dd/yyyy
			return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
		};
		function getTheDay(date)
		{

			weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
			return weekday[date.getDay()];
		}
//		$(".loadTimes").click(function(){ 
//			  console.log(this.id);
//			  WAF.ds.Event.query("fullName = :1", WAF.directory.currentUser().fullName, {
//	                autoExpand: "pTO_RequestCollection",
//	                onSuccess: function(event) {
//	          		}
//	          })
//		});

//		    (function($) {
//      $("#carousel1").carousel();
//      //$("#carousel2").carousel({direction: "vertical"});
//  		})(jQuery);	
//  		$('#right').cycle({
//     	 	fx: 'scrollRight',
//      		next: '#right',
//      		timeout: 0,
//      		easing: 'easeInOutBack'
//  		});
			$('#right').cycle();
			//$(".basic").jRating(); // more complex jRating call 
//			$(".basic").jRating({ step:true, length : 20, // nb of stars
//				onSuccess : function(){ alert('Success : your rate has been saved :)'); 
//				} 
//			});
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
