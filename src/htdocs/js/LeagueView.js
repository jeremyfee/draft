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
		var el = this._el,
			league;

		this._formatTeam = this._formatTeam.bind(this);
		this._formatPick = this._formatPick.bind(this);

		league = this._league = this._options.league;
		league.on('reset', this.render, this);

		el.innerHTML = '<section>' +
				'<div class="from"></div>' +
				'<div class="frompicks"></div>' +
			'</section>' +
			'<section>' +
				'<div class="to"></div>' +
				'<div class="topicks"></div>' +
			'</section>' +
			'<section>' +
				'<textarea class="comment"></textarea>' +
				'<button class="trade">Trade</button>' +
			'</section>';

		this._from = new SelectView({
			collection: this._league,
			el: el.querySelector('.from'),
			format: this._formatTeam
		});
		this._to = new SelectView({
			collection: new Collection(),
			el: el.querySelector('.to'),
			format: this._formatTeam
		});

		this._fromPicks = new SelectView({
			collection: new Collection(),
			el: el.querySelector('.frompicks'),
			format: this._formatPick,
			multiSelect: true
		});
		this._toPicks = new SelectView({
			collection: new Collection(),
			el: el.querySelector('.topicks'),
			format: this._formatPick,
			multiSelect: true
		});

		this._from.on('select', this._onFromChange, this);
		this._to.on('select', this._onToChange, this);
		league.on('reset', function () {
			league.select(league.data()[0]);
		}.bind(this));

		this._comment = el.querySelector('.comment');
		this._trade = el.querySelector('.trade');
		this._trade.addEventListener('click',
			this._onTrade.bind(this));

		this._onFromChange();
	};

	LeagueView.prototype._formatTeam = function (team) {
		return team.owner + ' (' + team.name + ')';
	};

	LeagueView.prototype._formatPick = function (pick) {
		var team = this._league.get(pick.teamid);
		return 'Round ' + pick.round + ' (' + team.owner + ')';
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

		if (fromTeam) {
			this._fromPicks._collection.reset(fromTeam.picks.data());
		}
	};

	LeagueView.prototype._onToChange = function () {
		var team = this._to._collection.getSelected();

		// TODO: show to picks
		if (team) {
			this._toPicks._collection.reset(team.picks.data());
		}
	};

	LeagueView.prototype._onTrade = function () {
		var now = new Date().getTime(),
			comment = this._comment.value,
			fromTeam = this._from._collection.getSelected(),
			toTeam = this._to._collection.getSelected(),
		    fromPicks = this._fromPicks.getValue(),
		    toPicks = this._toPicks.getValue();

		fromPicks.forEach(function (value) {
			value.history.push({
				time: now,
				teamid: toTeam.id,
				comment: comment
			});
		});

		toPicks.forEach(function (value) {
			value.history.push({
				time: now,
				teamid: fromTeam.id,
				comment: comment
			});
		});

		fromTeam.picks.remove.apply(fromTeam.picks, fromPicks);
		toTeam.picks.remove.apply(toTeam.picks, toPicks);

		fromTeam.picks.add.apply(fromTeam.picks, toPicks);
		toTeam.picks.add.apply(toTeam.picks, fromPicks);

		function sortByRound(a, b) {
			return a.round - b.round;
		}

		fromTeam.picks.sort(sortByRound);
		toTeam.picks.sort(sortByRound);

		this._league.trigger('select');
	};

	LeagueView.prototype.render = function () {
	};


	return LeagueView;
});