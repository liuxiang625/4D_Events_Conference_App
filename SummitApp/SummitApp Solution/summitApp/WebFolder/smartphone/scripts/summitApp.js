
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
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
//		function formatDate(date) {// ultility to formate date to mm/dd/yyyy
//			return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
//		};
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
