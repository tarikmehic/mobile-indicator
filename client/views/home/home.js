let arr = new ReactiveArray([]);
let decArr = new ReactiveArray([]);

Template.Home.rendered = function() {
	decArr = [];
	arr = [];
	Session.set('avg', 0);
	Session.set('peek', 0);
	Session.set('isCompleted', false);
};

Template.Home.events({

});

Template.Home.helpers({
events: function (event) {
	window.addEventListener('deviceorientation', function(event) {
	  var alpha = event.alpha;
		Session.set('alpha', alpha);
	  var beta = event.beta;
		Session.set('beta', beta);
	  var gamma = event.gamma;
		Session.set('gamma', gamma);
	}, false);
	const alphaAngle = Session.get('alpha');
	const betaAngle = Session.get('beta');
	const tiltedRightLeft = alphaAngle < 40 || alphaAngle > 320;
	const tiltedUpDown = betaAngle < 95 || betaAngle > 45;
	if (tiltedRightLeft && tiltedUpDown) {
		Session.set('orientation', true);
	} else {
		Session.set('orientation', false);
	}
},
acceleration: function (event) {
		window.addEventListener('devicemotion', function(event) {
		  var x = event.accelerationIncludingGravity.x;
			Session.set('x', x);
		});
	},
	averageDeacceleration: function () {
		const orientation = Session.get('orientation');

		if (orientation) {
			const acceleration = Session.get('x');
			if (acceleration > 1.5) {
				Session.set('accelerationAchieved', true);
			}
			if (Session.get('isCompleted') === false && Session.get('accelerationAchieved') === true){

				const peek = Math.max.apply( Math, arr );
				if (acceleration > 0.1) {
					arr.push(acceleration);
						if (acceleration < peek) {
				 		 let sum = 0;
				 		 let avg = 0;
						 let i = 0;
				 		 decArr.push(acceleration);
				 		 decArr.forEach(function(n){
							 i++;
				 			 sum += n;
				 			 avg = sum / decArr.length;
							 console.log(i);
							 console.log(n);
							 if (i === decArr.length) {
								 setTimeout(function(){ Session.set('isCompleted', true) }, 1500);
							 }
				 		 });
						 Session.set('peek', peek.toPrecision(2));
						 Session.set('avg', avg.toPrecision(2));
					}
				}
			}
		} else {
			return 'Recalibrate';
		}
		if (Session.get('avg') === 0) {
			return 'Begin the test!';
		} else {
		return 'Deceleration average is: ' + Session.get('avg') + ' and peak of: ' + Session.get('peek');
		}
	},
	isEventDone: function () {
		if (Session.get('isCompleted') === true) {
			return 'Test completed with results: deceleration average is: ' + Session.get('avg') + ' and peak of: ' + Session.get('peek') + 'Please refresh to try again';
		}
	}
});
