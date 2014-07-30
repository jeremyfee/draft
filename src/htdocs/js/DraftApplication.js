/* global define */
define([
	'mvc/Collection',
	'util/Util',
	'util/Xhr',

	'LeagueView'
], function(
	Collection,
	Util,
	Xhr,

	LeagueView
) {
	'use strict';

	var DraftApplication = function (options) {
		this._options = options;
		this._initialize();
	};


	DraftApplication.prototype._initialize = function () {
		var options = this._options,
			leagueEl;

		this._el = options.el;

		leagueEl = this._el.appendChild(document.createElement('div'));
		leagueEl.className = 'league';

		this._league = new Collection();
		this._leagueView = new LeagueView({
			el: leagueEl,
			league: this._league
		});


		this._load = this._load.bind(this);
		this._loadError = this._loadError.bind(this);

		Xhr.ajax({
			url: options.crudUrl,
			success: this._load,
			error: this._loadError
		});
	};

	DraftApplication.prototype._load = function (teams) {
		var team, i, len;
		for (i = 0, len = teams.length; i < len; i++) {
			team = teams[i];
			team.picks = new Collection(team.data.picks);
		}
		this._league.reset(teams);
	};

	DraftApplication.prototype._loadError = function () {
		console.log(arguments);
	};


	return DraftApplication;

});
