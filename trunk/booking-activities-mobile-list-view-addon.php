<?php
/**
 * Plugin Name: Booking Activities - Mobile List View Addon
 * Description: Adds a mobile-friendly weekly list view to Booking Activities calendars.
 * Version: 1.0.0
 * Author: Booking Activities Team
 * Text Domain: booking-activities-mobile-list-view-addon
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

/**
 * Check whether Booking Activities is available.
 *
 * @return bool
 */
function bookacti_mlv_is_booking_activities_active() {
	return defined( 'BOOKACTI_VERSION' ) && wp_script_is( 'bookacti-js-booking-method-calendar', 'registered' );
}

/**
 * Enqueue addon assets.
 */
function bookacti_mlv_enqueue_assets() {
	if ( is_admin() ) { return; }
	if ( ! bookacti_mlv_is_booking_activities_active() ) { return; }

	$plugin_url = plugin_dir_url( __FILE__ ) . 'addons/mobile-list-view/';
	$plugin_ver = defined( 'BOOKACTI_VERSION' ) ? BOOKACTI_VERSION : '1.0.0';

	wp_enqueue_style(
		'bookacti-mobile-list-view-addon',
		$plugin_url . 'assets/css/mobile-list-view.css',
		array( 'bookacti-css-bookings' ),
		$plugin_ver
	);

	wp_enqueue_script(
		'bookacti-mobile-list-view-addon',
		$plugin_url . 'assets/js/mobile-list-view.js',
		array( 'bookacti-js-booking-method-calendar' ),
		$plugin_ver,
		true
	);

	wp_localize_script( 'bookacti-mobile-list-view-addon', 'bookacti_mobile_list_view', array(
		'mobile_breakpoint' => (int) apply_filters( 'bookacti_mobile_list_view_breakpoint', 768 ),
		'force_mobile_list' => (int) apply_filters( 'bookacti_mobile_list_view_force_mobile_list', 1 ),
		'button_text'       => apply_filters( 'bookacti_mobile_list_view_button_text', __( 'List', 'booking-activities' ) ),
	) );
}
add_action( 'wp_enqueue_scripts', 'bookacti_mlv_enqueue_assets', 40 );
