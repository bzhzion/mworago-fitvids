<?php
/*
Plugin Name: Mworago FitVids
Description: Remplace FitVids for WordPress — vanilla JS, sans jQuery, fix bug width=100%.
Version: 1.0.0
Requires at least: 6.5
Requires PHP: 8.2
Author: Breizhzion
Author URI: https://breizhzion.com
*/

if (!function_exists('add_action')) { exit; }

class KpopifyFitVids {
    public function __construct() {
        add_action('wp_enqueue_scripts', [$this, 'scripts']);
        add_action('wp_enqueue_scripts', [$this, 'dequeue_original'], 100);
    }

    public function scripts(): void {
        wp_register_script(
            'kpopify-fitvids',
            plugin_dir_url(__FILE__) . 'mworago-fitvids.js',
            [],
            '1.0.0',
            true
        );
        wp_enqueue_script('kpopify-fitvids');
    }

    public function dequeue_original(): void {
        wp_dequeue_script('fitvids');
        wp_deregister_script('fitvids');
    }
}

new KpopifyFitVids();
