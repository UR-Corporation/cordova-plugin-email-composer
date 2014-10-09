/*
    Copyright 2013-2014 appPlant UG

    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

var exec = require('cordova/exec');

/**
 * List of all available options with their default value.
 *
 * @return {Object}
 */
exports.getDefaults = function () {
    return {
        subject:     '',
        body:        '',
        to:          [],
        cc:          [],
        bcc:         [],
        attachments: [],
        isHtml:      true
    };
};

/**
 * Displays the email composer pre-filled with data.
 *
 * @param {Object} options
 *      Different properties of the email like the body, subject
 * @param {Function} callback
 *      A callback function to be called with the result
 * @param {Object?} scope
 *      The scope of the callback
 */
exports.open = function (options, callback, scope) {
    var fn = this.createCallbackFn(callback, scope);

    options = this.mergeWithDefaults(options || {});

    exec(fn, null, 'EmailComposer', 'open', [options]);
};

/**
 * Alias für `open()`.
 */
exports.openDraft = function () {
    this.open.apply(this, arguments);
};

/**
 * Verifies if sending emails is supported on the device.
 *
 * @param {Function} callback
 *      A callback function to be called with the result
 * @param {Object} scope
 *      The scope of the callback
 */
exports.isServiceAvailable = function (callback, scope) {
    var fn = this.createCallbackFn(callback, scope);

    exec(fn, null, 'EmailComposer', 'isServiceAvailable', []);
};

/**
 * @private
 *
 * Merge settings with default values.
 *
 * @param {Object} options
 *      The custom options
 *
 * @retrun {Object}
 *      Default values merged
 *      with custom values
 */
exports.mergeWithDefaults = function (options) {
    var defaults = this.getDefaults();

    for (var key in defaults) {

        if (!options.hasOwnProperty(key)) {
            options[key] = defaults[key];
            continue;
        }

        var custom_  = options[key],
            default_ = defaults[key];

        if (typeof default_ != typeof custom_) {

            if (typeof default_ == 'string') {
                options[key] = custom_.join('');
            }

            else if (typeof default_ == 'object') {
                options[key] = [custom_.toString()];
            }
        }
    }

    return options;
};

/**
 * @private
 *
 * Creates a callback, which will be executed
 * within a specific scope.
 *
 * @param {Function} callbackFn
 *      The callback function
 * @param {Object} scope
 *      The scope for the function
 *
 * @return {Function}
 *      The new callback function
 */
exports.createCallbackFn = function (callbackFn, scope) {
    if (typeof callbackFn != 'function')
        return;

    return function () {
        callbackFn.apply(scope || this, arguments);
    };
};
