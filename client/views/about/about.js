Template.About.rendered = function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.About.events({
	
});

Template.About.helpers({
	
});
