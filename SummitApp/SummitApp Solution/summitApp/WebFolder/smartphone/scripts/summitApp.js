
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		ds.Event.all({
    orderBy: "startDate",
    autoExpand: "sessions",
    onSuccess: function(eventsCollectionEvent) {
        var count = eventsCollectionEvent.entityCollection.length;
        $(".loadDays").click(function() { //Click event handler of Event listitem
            console.log(this.id);
            daysPageGeneration(eventsCollectionEvent.entityCollection, this.id);
        });
    }
});

function daysPageGeneration(eventCollections, day) { //Load days of event if more than one
    eventCollections.query("name = :1 | name %% :1", day, {
        autoExpand: "sessions,activities",
        onSuccess: function(event) {
            event.entityCollection.forEach({
                onSuccess: function(eventItemEvent) {
                    var startDate = eventItemEvent.entity.startDate.getValue();
                    var endDate = eventItemEvent.entity.endDate.getValue();
                    $('#daysListView').empty().listview('refresh');
                    $('#daysListView').append('<li data-theme="c">' + '<a id="' + formatDate(startDate) + '" class="loadTimsSlots" href="#page3" data-transition="slide">' + '<h3>' + getTheDay(startDate) + " " + formatDate(startDate) + '</h3><p>4D Summit Pre-Class</p>' + '</li>').listview('refresh');
                    while (startDate < endDate) {
                        startDate.setDate(startDate.getDate() + 1);
                        //console.log(Math.round((ev.entity.endDate.getValue() - ev.entity.startDate.getValue()) / (1000*60*60*24)));
                        $('#daysListView').append('<li data-theme="c">' + '<a id="' + formatDate(startDate) + '" class="loadTimsSlots" href="#page3" data-transition="slide">' + '<h3>' + getTheDay(startDate) + " " + formatDate(startDate) + '</h3><p>4D Summit keynotes  breakout sessions</p>' + '</li>').listview('refresh');
                    }
                    var sessionsCollectionRel = eventItemEvent.entity.sessions.relEntityCollection;
                    var activitiesCollectionRel = eventItemEvent.entity.activities.relEntityCollection;
                    //console.log(sessionsCollectionRel);
                    sessionsCollectionRel.orderBy("sessionDate asc");
                    sessionsCollectionRel.query("startDate = :1 | startDate %% :1", this.id, {
                        autoExpand: "sessionSurveys",
                        onSuccess: function(sessionsEvent) {
                        	var sessionsCollctionArray = sessionsEvent.entityCollection.toArray();
                        	console.log(sessionsEvent.entityCollection);
                        	console.log(sessionsCollctionArray);
                        	activitiesCollectionRel.query("startDate = :1 | startDate %% :1", this.id, {
                        		onSuccess: function(activitiesEvent) {
                        			$(".loadTimsSlots").live('click', function() {
                        			var activitiesCollectionArray =  activitiesEvent.entityCollection.toArray();
                    				console.log(this.id);
                   					console.log(activitiesCollectionArray);
                    				});   
                        		}
                        	});
                        }
                    });             	
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

$('.goBack').click(function() {
    if ($('#daysListView li').size() > 1) {
        $.mobile.changePage("#page1", {
            transition: "slide",
            reverse: true
        });
    }
    else {
        $.mobile.changePage("#page0", {
            transition: "slide",
            reverse: true
        });
    }

})

function formatDate(date) { // ultility to formate date to mm/dd/yyyy
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
};

function getTheDay(date) {

    weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return weekday[date.getDay()];
}

$('#right').cycle();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
