
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock


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
