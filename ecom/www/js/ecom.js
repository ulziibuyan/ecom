/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var ecom = {
    // Application Constructor
    init: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        ecom.order_button = $('.order-button');
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');

        ecom.products_fetch();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    /*

    */

    order_submit: function() {
        var order_submit_url = 'https://ecom.negteg.co/wordpress/wp-json/wc/v1'
                             + '/orders?consumer_key=ck_7cd335229ef1c9bf5ec9ab'
                             + '803e8008df08377508&consumer_secret=cs_15927a29'
                             + 'c050d6c2386692806b3400622d2f6a8b';

        $('#orderConfirm').text('Ordering...');
        $.post(order_submit_url, ecom.order_json, function(reply) {
            console.log(this);
            console.log(JSON.stringify(reply));
            $('#orderConfirm').text('ORDERED');
            $('#order-confirm .confirm').attr('disabled', 'disabled');
        })
    },

    order_modal_toggle: function() {
        $('#order-confirm').modal('toggle');
    },

    order_compute: function() {
        $('#order-confirm .address').text('Shipping Address: E-Mart');

        var total = 0;
        ecom.order_json = {};
        var line_items = [];
        $('.products input').each(function(i, e) {
            var product = $(e);
            var quantity = parseInt(product.val());
            var price = parseInt(ecom.product_list[e.id].price);

            item = {};
            item['product_id'] = e.id;
            item['quantity'] = quantity;
            line_items.push(item);

            total += price * quantity;
        })
        ecom.order_json['line_items'] = line_items;

        $('#order-confirm .total').text('total: ' + total + 'MNT');
        ecom.order_modal_toggle();
    },

    product_quant_change: function() {
      var input = $('input[id=' + this.id + ']')
      var operation = this.getAttribute('data-type');
      var value = parseInt(input.val());
      if (operation == 'inc') {
        if (value < 0)
          value = 0;
        input.val(value + 1);
      } else if (operation == 'dec') {
          if (value > 0)
            input.val(value - 1);
      }
      ecom.order_button.removeAttr('disabled');
    },

    bind_controls: function() {
        $('.products button').each(function(i, e) {
          $(e).on('click', ecom.product_quant_change);
        })
        $('#order-confirm button.confirm').on('click', ecom.order_submit);
        ecom.order_button.on('click', ecom.order_compute);
    },

    products_display: function() {
        var products_div = $('.products');

        $.each(ecom.products_html, function(i, product) {
            products_div.append(product);
        })
        products_div.css('display', 'block');
    },

    products_render: function() {
        var product_template = $('#product_template').html();
        ecom.products_html = [];
        ecom.product_list = {}

        $.each(ecom.products_json, function(i, product) {
            ecom.products_html.push(Mustache.render(product_template, product));
            ecom.product_list[product.id] = product;
        })
    },

    products_load: function() {
        ecom.products_render();
        ecom.products_display();
        ecom.bind_controls();
        ecom.order_button.text('order');
    },

    products_fetch: function() {
        var products_url = 'https://ecom.negteg.co/wordpress/wp-json/wc/v1'
                         + '/products?consumer_key=ck_7cd335229ef1c9bf5ec9'
                         + 'ab803e8008df08377508&consumer_secret=cs_15927a'
                         + '29c050d6c2386692806b3400622d2f6a8b'

        $.getJSON(products_url, function(products_json) {
            ecom.products_json = products_json;
            ecom.products_load();
        })
    }
};

ecom.init();
