require.config({
	baseUrl: 'js',
	paths: {
		mvc: '/hazdev-webutils/src/mvc',
		util: '/hazdev-webutils/src/util'
	},
	shim: {
	}
});

require([
	'DraftApplication'
], function (
	DraftApplication
) {
	'use strict';

	new DraftApplication({
		el: document.querySelector('#draft'),
		crudUrl: '/js/testdata.json'
	});

});
