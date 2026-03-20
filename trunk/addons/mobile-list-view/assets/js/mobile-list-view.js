(function() {
	'use strict';

	if (typeof window.$j === 'undefined') { return; }

	var $j = window.$j;

	function getSettings() {
		var settings = window.bookacti_mobile_list_view || {};
		var breakpoint = parseInt(settings.mobile_breakpoint, 10);
		if (isNaN(breakpoint) || breakpoint <= 0) {
			breakpoint = 768;
		}

		return {
			mobileBreakpoint: breakpoint,
			forceMobileList: parseInt(settings.force_mobile_list, 10) === 1,
			buttonText: settings.button_text || 'List'
		};
	}

	function isMobileViewport(bookingSystem, breakpoint) {
		var calendarWidth = bookingSystem.find('.bookacti-calendar:first').width();
		if (calendarWidth && calendarWidth <= breakpoint) {
			return true;
		}

		if (typeof window.matchMedia === 'function') {
			return window.matchMedia('(max-width: ' + breakpoint + 'px)').matches;
		}

		return false;
	}

	function ensureToken(list, token) {
		if (!list) { return token; }
		if (list.indexOf(token) !== -1) { return list; }
		return list + ',' + token;
	}

	$j(document).ready(function() {
		$j('body').on('bookacti_calendar_init_data', '.bookacti-booking-system', function(e, initData) {
			if (!initData || typeof initData !== 'object') { return; }

			var bookingSystem = $j(this);
			var settings = getSettings();
			var isMobile = isMobileViewport(bookingSystem, settings.mobileBreakpoint);

			if (typeof initData.views === 'undefined' || !initData.views) {
				initData.views = {};
			}
			if (typeof initData.views.listWeek === 'undefined') {
				initData.views.listWeek = {
					type: 'list',
					duration: { weeks: 1 },
					listDayFormat: { weekday: 'long' },
					listDaySideFormat: { day: '2-digit', month: 'long', year: 'numeric' },
					buttonText: settings.buttonText
				};
			}

			if (typeof initData.buttonText === 'undefined' || !initData.buttonText) {
				initData.buttonText = {};
			}
			if (typeof initData.buttonText.listWeek === 'undefined') {
				initData.buttonText.listWeek = settings.buttonText;
			}

			if (typeof initData.headerToolbar === 'undefined' || !initData.headerToolbar) {
				initData.headerToolbar = {
					start: 'prev,next today',
					center: 'title',
					end: 'dayGridMonth,timeGridWeek,timeGridDay'
				};
			}

			initData.headerToolbar.end = ensureToken(initData.headerToolbar.end || '', 'listWeek');

			if (settings.forceMobileList && isMobile) {
				initData.initialView = 'listWeek';
			}
		});

		$j('body').on('bookacti_calendar_after_set_up', '.bookacti-booking-system', function() {
			var bookingSystem = $j(this);
			var settings = getSettings();
			var isMobile = isMobileViewport(bookingSystem, settings.mobileBreakpoint);
			bookingSystem.toggleClass('bookacti-mobile-list-view', isMobile);
		});
	});
})();
