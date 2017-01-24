process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        // Install:
        // npm install --save woocommerce-api

        // Setup:
        var WooCommerceAPI = require('woocommerce-api');

        var WooCommerce = new WooCommerceAPI({
          url: 'https://ecom.negteg.co/wordpress/index.php', // Your store URL
          consumerKey: 'ck_7cd335229ef1c9bf5ec9ab803e8008df08377508', // Your consumer key
          consumerSecret: 'cs_15927a29c050d6c2386692806b3400622d2f6a8b', // Your consumer secret
          wpAPI: false, // Enable the WP REST API integration
          version: 'v1' // WooCommerce WP REST API version
        });
        WooCommerce.get('products', function(err, data, res) {
  console.log(err, data, res);
});

