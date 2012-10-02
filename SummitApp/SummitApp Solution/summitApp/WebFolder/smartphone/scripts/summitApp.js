
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		$.mobile.changePage($("#page0"), "none");
		ds.Event.all({
		    orderBy: "startDate",
		    autoExpand: "sessions",
		    onSuccess: function(eventsCollectionEvent) {
		        $(".loadDays").live('click', function() { //Click event handler of Event listitem
		            daysPageGeneration(eventsCollectionEvent.entityCollection, this.id);
		        });
		    }
		});

		function daysPageGeneration(eventCollections, eventName) { //Load days of event if more than one
		    eventCollections.query("name = :1 | name %% :1", eventName, {
		        autoExpand: "sessions",
		        onSuccess: function(event) {
		            event.entityCollection.forEach({
		                onSuccess: function(eventItemEvent) {
		                    var startDate = eventItemEvent.entity.startDate.getValue();
		                    var endDate = eventItemEvent.entity.endDate.getValue();
		                    $('#eventPageHead h3').text(eventName);
		                    $('#daysListView').empty().listview('refresh');
		                    $('#daysListView').append('<li data-theme="c">' + '<a id="' + formatDate(startDate) + '" class="loadTimsSlots" href="#page3" data-transition="slide">' + '<h3>' + getTheDay(startDate) + " " + formatDate(startDate) + '</h3><p>4D Summit Pre-Class</p>' + '</li>').listview('refresh');
		                    while (startDate < endDate) {
		                        startDate.setDate(startDate.getDate() + 1);
		                        //console.log(Math.round((ev.entity.endDate.getValue() - ev.entity.startDate.getValue()) / (1000*60*60*24)));
		                        $('#daysListView').append('<li data-theme="c"><a id="' + formatDate(startDate) + '" class="loadTimsSlots" href="#page3" data-transition="slide">' + '<h3>' + getTheDay(startDate) + " " + formatDate(startDate) + '</h3><p>4D Summit keynotes  breakout sessions</p></li>').listview('refresh');
		                    }
		                    var sessionsCollectionRel = eventItemEvent.entity.sessions.relEntityCollection;
		                    sessionsCollectionRel.orderBy("startTime asc");
		                    //console.log(sessionsCollectionRel);
		                    var sessionsArray = [];
		                    //var date = new Date("10/23/2012");
		                    //sessionsCollectionRel.query("sessionDate >= :1 AND sessionDate <= :2", new Date("10/23/12"), new Date("10/24/12"));
		                    // console.log(sessionsCollectionRel);
		                    $(".loadTimsSlots").live('click', function() {
		                        sessionsArray.length = 0;
		                        var currentDate = this.id;
		                        if (sessionsCollectionRel.length > 0) {
		                            //Check if listView is initialized, if not listview('refresh') causes error.
		                            ($('#timSlotListView').hasClass('ui-listview') ? $('#timSlotListView').empty().listview('refresh') : $('#timSlotListView').empty());
		                            var sessionTimes = [];
		                            var tagsSet = {};
		                            $('#dayPageHead h3').text(currentDate);
		                            sessionsCollectionRel.forEach({
		                                onSuccess: function(sessionRelevent) {
		                                    var sessionItem = sessionRelevent.entity;
		                                    var sessionDate = formatDate(sessionItem.sessionDate.getValue());
		                                    var sessionTime = sessionItem.startTime.getValue() + "- " + sessionItem.endTime.getValue();
		                                    var sessionFirstTag = "";
		                                   	if (sessionItem.tags.getValue()){
		                	                    sessionFirstTag =  sessionItem.tags.getValue().match(/,/)?sessionItem.tags.getValue().split(',')[0]:sessionItem.tags.getValue();
		                	                    if(sessionTimes.indexOf(sessionTime) != -1) {
		                	                    	//var idToAddTags = getFirstKeyOfJSON(tagsSet[sessionTime]) ;
		                	                    	if ( typeof tagsSet[sessionTime] === "undefined" ) tagsSet[sessionTime] ="";
		                	                    	tagsSet[sessionTime] = tagsSet[sessionTime].concat(' ' + sessionFirstTag);
		                	                    	//console.log(sessionFirstTag + ' added! to ' + sessionTime );
		                	                    }
		         							}											
		                                    if (sessionDate == currentDate & sessionTimes.indexOf(sessionTime) == -1) {
		                                        sessionTimes.push(sessionTime);		                                        
		                                        //sessionsArray.push(sessionRelevent.entity);
		                                        if (sessionItem.isActivity.getValue()) {
		                                            ($('#timSlotListView').hasClass('ui-listview') ? $('#timSlotListView').append('<li role="heading" data-role="list-divider"><h3>' + sessionTime + '  ' + sessionItem.ID.getValue() + '</h3></li>').listview('refresh') : $('#timSlotListView').append('<li role="heading" data-role="list-divider"><h3>' + sessionTime + '  ' + sessionItem.ID.getValue() + ' ' + sessionItem.room.getValue() + '</h3></li>'));
		                                        }
		                                        else {
		                                        	($('#timSlotListView').hasClass('ui-listview') ? $('#timSlotListView').append('<li data-theme="c"><a id="' + sessionItem.ID.getValue() + '" class="" href="#page5" data-transition="slide" >' + '<h3>' + sessionTime + '</h3><p class="'+ sessionTime + '">'+  sessionFirstTag +'</p></li>').listview('refresh') : $('#timSlotListView').append('<li data-theme="c">' + '<a id="' + sessionItem.ID.getValue() + '" class="" href="#page5" data-transition="slide">' + '<h3>' + sessionTime + '</h3><p  class="'+ sessionTime + '">'+  sessionFirstTag +'</p></li>'));
													if ( typeof tagsSet[sessionTime] === "undefined" ) tagsSet[sessionTime] ="";
													tagsSet[sessionTime] = tagsSet[sessionTime].concat(' ' + sessionFirstTag);
													tagsSet[sessionItem.ID.getValue()] = sessionTime;
		                                        } 
												//console.log("timeSLotTags text " + $('.'+sessionTime).text());
		                                    }
		                                },
		                                atTheEnd: function(end) {
		                                	//Replace the tag paragraph in displayed li item with concated all sessions tags
		                                    console.log(tagsSet);
		                                    for (var key in tagsSet) {
		       									 if (key.match(/\d{1,2}[:-]\d{2}([:-]\d{2,3})*/)) {
		            								var idToAddTags = getKeyForValue(tagsSet, key);
		            								console.log(idToAddTags + ': ' + tagsSet[key]);
		            								$('#' + idToAddTags+" p").text(tagsSet[key]);
		        								}
		   									 }
		                                }
		                            })
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
		
		function getKeyForValue(jsonObjet, value) {
		    for (var key in jsonObjet) {
		        if (jsonObjet.hasOwnProperty(key) && typeof(key) !== 'function') {
		            if (jsonObjet[key] == value) return key;
		        }
		    }
		}
		
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
