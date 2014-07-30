/* global define */
define([
	'mvc/View'
], function (
	View
) {
	'use strict';

	var SelectView = function (options) {
		this._options = options;
		View.call(this, options);
	};

	SelectView.prototype = Object.create(View.prototype);

	SelectView.prototype._initialize = function () {
		var options = this._options;
		this._collection = options.collection;

		this._select = this._el.appendChild(document.createElement('select'));
		this._select.addEventListener('change', this._onSelect.bind(this));

		this._collection.on('reset', this.render, this);
		this._collection.on('select', this.trigger.bind(this, 'select'));

		if (options.multiSelect === true) {
			this._select.setAttribute('multiple', 'multiple');
		}

		this.render();
	};

	SelectView.prototype.render = function () {
		var format = this._options.format,
		    collection = this._collection.data(),
			i, len, item,
			buf = [];

		for (i=0, len = collection.length; i < len; i++) {
			item = collection[i];
			buf.push(
				'<option value="', i, '">',
				format(item),
				'</option>');
		}
		this._select.innerHTML = buf.join('');

		if (this._options.multiSelect === true) {
			this._select.setAttribute('size', len);
		}
	};

	SelectView.prototype._onSelect = function (e) {
		var index = e.target.value,
			selected = this._collection.data()[index];

		this._collection.select(selected);
	};


	return SelectView;

});

