﻿
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
		                    $('#daysListView').empty().listview('refresh');
		                    $('#daysListView').append('<li data-theme="c">' + '<a id="' + formatDate(startDate) + '" class="loadTimsSlots" href="#page3" data-transition="slide">' + '<h3>' + getTheDay(startDate) + " " + formatDate(startDate) + '</h3><p>4D Summit Pre-Class</p>' + '</li>').listview('refresh');
		                    while (startDate < endDate) {
		                        startDate.setDate(startDate.getDate() + 1);
		                        //console.log(Math.round((ev.entity.endDate.getValue() - ev.entity.startDate.getValue()) / (1000*60*60*24)));
		                        $('#daysListView').append('<li data-theme="c"><a id="' + formatDate(startDate) + '" class="loadTimsSlots" href="#page3" data-transition="slide">' + '<h3>' + getTheDay(startDate) + " " + formatDate(startDate) + '</h3><p>4D Summit keynotes  breakout sessions</p></li>').listview('refresh');
		                    }
		                    var sessionsCollectionRel = eventItemEvent.entity.sessions.relEntityCollection;
		                    sessionsCollectionRel.orderBy("startTime asc");
		                    console.log(sessionsCollectionRel);
		                    var sessionsArray = [];
		                    var activitiesArray = [];
		                    //var date = new Date("10/23/2012");
		                    //sessionsCollectionRel.query("sessionDate >= :1 AND sessionDate <= :2", new Date("10/23/12"), new Date("10/24/12"));
		                    // console.log(sessionsCollectionRel);
		                    $(".loadTimsSlots").live('click', function() {
		                        sessionsArray.length = 0;
		                        var currentDate = this.id;
		                        console.log("Current Date: " + currentDate);

		                        if (sessionsCollectionRel.length > 0) {
		                            //Check if listView is initialized, if not listview('refresh') causes error.
		                            ($('#timSlotListView').hasClass('ui-listview') ? $('#timSlotListView').empty().listview('refresh') : $('#timSlotListView').empty());
		                            var sessionTimes = [];
		                            sessionsCollectionRel.forEach({
		                                onSuccess: function(sessionRelevent) {
		                                    var sessionItem = sessionRelevent.entity;
		                                    var sessionDate = formatDate(sessionItem.sessionDate.getValue());
		                                    var sessionTime = sessionItem.startTime.getValue() + "- " + sessionItem.endTime.getValue();
		                                   	if (sessionItem.tags.getValue()){
		                	                    var sessionFirstTag =  sessionItem.tags.getValue().match(/,/)?sessionItem.tags.getValue().split(',')[0]:sessionItem.tags.getValue();
		         							}
		         							console.log("tsessionFirstTag " + sessionFirstTag);                           
											//(sessionTimes.indexOf(sessionTime) != -1?sessionTags.concat())
		                                    if (sessionDate == currentDate & sessionTimes.indexOf(sessionTime) == -1) {
		                                        sessionTimes.push(sessionTime);
		                                        //sessionsArray.push(sessionRelevent.entity);
		                                        if (sessionItem.isActivity.getValue()) {
		                                            ($('#timSlotListView').hasClass('ui-listview') ? $('#timSlotListView').append('<li role="heading" data-role="list-divider">' + sessionTime + '  ' + sessionItem.name.getValue() + '</li>').listview('refresh') : $('#timSlotListView').append('<li role="heading" data-role="list-divider">' + sessionTime + '  ' + sessionItem.name.getValue() + ' ' + sessionItem.room.getValue() + '</li>'));
		                                        }
		                                        else {
		                                            ($('#timSlotListView').hasClass('ui-listview') ? $('#timSlotListView').append('<li data-theme="c"><a id="' + sessionItem.name.getValue() + '" class="" href="#page5" data-transition="slide" >' + '<h3>' + sessionTime + '</h3><p class="'+ sessionTime + '">'+ sessionFirstTag +'</p></li>').listview('refresh') : $('#timSlotListView').append('<li data-theme="c">' + '<a id="' + sessionItem.name + '" class="" href="#page5" data-transition="slide">' + '<h3>' + sessionTime + '</h3><p  class="'+ sessionTime + '">'+ sessionFirstTag +'</p></li>'));
		                                        } 
												console.log("timeSLotTags text " + $('.'+sessionTime).text());
		                                    }
		                                },
		                                atTheEnd: function(end) {
		                                    //                                    if (activitiesCollectionRel.length > 0) {
		                                    //                                        activitiesCollectionRel.forEach({
		                                    //                                            onSuccess: function(activityRelevent) {
		                                    //                                            	var activityDate = formatDate(activityRelevent.entity.activityDate.getValue());
		                                    //                                                if (activityDate == currentDate) {
		                                    //                                                    activitiesArray.push(activityRelevent.entity);
		                                    //                                                }
		                                    //                                            }
		                                    //                                        })
		                                    //                                    }
		                                    //console.log(sessionsArray.length);
		                                    //                                    console.log(activitiesArray.length);
		                                    //                                    var $element = $('<li data-theme="c">' + '<a id="' + formatDate(startDate) + '" class="loadTimsSlots" href="#page3" data-transition="slide">' + '<h3>' + getTheDay(startDate) + " " + formatDate(startDate) + '</h3><p>4D Summit Pre-Class</p>' + '</li>');
		                                    //                                    $('#timSlotListView').empty().listview('refresh');
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
