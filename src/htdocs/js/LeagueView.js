/* global define */
define([
	'mvc/Collection',
	'mvc/View',
	'SelectView'
], function (
	Collection,
	View,
	SelectView
) {
	'use strict';

	var LeagueView = function (options) {
		this._options = options;
		View.call(this, options);
	};

	LeagueView.prototype = Object.create(View.prototype);

	LeagueView.prototype._initialize = function () {
		var el = this._el;

		this._formatPick = this._formatPick.bind(this);

		this._league = this._options.league;
		this._league.on('reset', this.render, this);

		el.innerHTML = '<section>' +
				'<div class="from"></div>' +
				'<div class="frompicks"></div>' +
			'</section>' +
			'<section>' +
				'<div class="to"></div>' +
				'<div class="topicks"></div>' +
			'</section>';

		var formatTeam = function (team) {
			return team.name +
					' (' + team.owner + ')';
		};

		this._from = new SelectView({
			collection: this._league,
			el: el.querySelector('.from'),
			format: formatTeam
		});
		this._to = new SelectView({
			collection: new Collection(),
			el: el.querySelector('.to'),
			format: formatTeam
		});

		this._from.on('select', this._onFromChange, this);
		this._to.on('select', this._onToChange, this);
		this._league.on('reset', function () {
			this._league.select(this._league.data()[0]);
		}.bind(this));
	};

	LeagueView.prototype._formatPick = function (pick) {
		var team = this._league.get(pick.teamid);
		return team.owner + ' - round ' + pick.round;
	};

	LeagueView.prototype._onFromChange = function () {
		var league = this._league.data(),
		    fromTeam = this._from._collection.getSelected(),
		    teams = [],
		    i, len, team;

		for (i=0, len = league.length; i < len; i++) {
			team = league[i];
			if (team !== fromTeam) {
				teams.push(team);
			}
		}
		this._to._collection.reset(teams);
		if (teams.length > 0) {
			this._to._collection.select(teams[0]);
		}

		// TODO: show from picks
		if (fromTeam) {
			this._el.querySelector('.frompicks').innerHTML = '' +
					fromTeam.name + ' picks';
			new SelectView({
				el: this._el.querySelector('.frompicks').appendChild(
						document.createElement('div')),
				collection: fromTeam.picks,
				format: this._formatPick,
				multiSelect: true
			});
		}

	};

	LeagueView.prototype._onToChange = function (team) {
		// TODO: show to picks
		if (team) {
			this._el.querySelector('.topicks').innerHTML = '' +
					team.name + ' picks';
			new SelectView({
				el: this._el.querySelector('.topicks').appendChild(
						document.createElement('div')),
				collection: team.picks,
				format: this._formatPick,
				multiSelect: true
			});
		}
	};


	LeagueView.prototype.render = function () {
	};


	return LeagueView;
});