/**
 * Sahana Eden Mobile - Form Wizard Widget Directives
 *
 * Copyright (c) 2019-2019 Sahana Software Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function(EdenMobile) {

    // TODO implement more widgets

    "use strict";

    // ========================================================================
    /**
     * Copy directive attributes to a generated element, using the
     * attribute map of the directive to map camelCase notation to
     * dash notation, e.g. ngModel becomes ng-model.
     *
     * @param {object} ngAttr - the directive's DOM attributes
     * @param {DOMNode} element - the target element
     * @param {Array} validAttr - the attributes to copy in camelCase
     *                            notation
     */
    function copyAttr(ngAttr, element, validAttr) {

        var attrMap = ngAttr.$attr,
            attribute,
            name,
            value;

        for (var i=validAttr.length; i--;) {
            attribute = validAttr[i];

            name = attrMap[attribute];
            value = ngAttr[attribute];
            if (name && value !== undefined) {
                element.attr(name, value);
            }
        }
    }

    // ========================================================================
    /**
     * Generic Widget <em-wizard-generic-widget>
     */
    EdenMobile.directive('emWizardGenericWidget', [
        '$compile',
        function($compile) {

            var renderWidget = function($scope, elem, attr) {

                // TODO this should not render any input element (for now)

                // Create the widget
                var widget = angular.element('<input>')
                                    .attr('type', attr.type || 'text');

                // Input attributes
                copyAttr(attr, widget, [
                    'ngModel',
                    'disabled',
                    'placeholder'
                ]);

                // Compile the widget against the scope, then
                // render it in place of the directive
                var compiled = $compile(widget)($scope);
                elem.replaceWith(compiled);
            };

            return {
                link: renderWidget
            };
        }
    ]);

    // ========================================================================
    /**
     * Boolean Widget <em-wizard-boolean-widget>
     */
    EdenMobile.directive('emWizardBooleanWidget', [
        '$compile',
        function($compile) {

            var renderWidget = function($scope, elem, attr) {

                // Build the widget
                var widget;
                if (attr.widget == 'checkbox') {
                    // Checkbox
                    widget = angular.element('<ion-checkbox>')
                                    .html(attr.label || '');
                } else {
                    // Default: Toggle
                    widget = angular.element('<ion-toggle toggle-class="toggle-positive">')
                                    .html(attr.label || '');
                }

                // Widget attributes
                copyAttr(attr, widget, [
                    'ngModel',
                    'disabled'
                ]);

                // Compile the widget against the scope, then
                // render it in place of the directive
                var compiled = $compile(widget)($scope);
                elem.replaceWith(compiled);
            };

            return {
                link: renderWidget
            };
        }
    ]);

    // ========================================================================
    /**
     * Date widget
     */
    EdenMobile.directive('emWizardDateWidget', [
        '$compile',
        function($compile) {

            var renderWidget = function($scope, elem, attr) {

                // Create the widget
                var widget = angular.element('<input type="date">');

                // Input attributes
                copyAttr(attr, widget, [
                    'ngModel',
                    'disabled'
                ]);

                // Compile the widget against the scope, then
                // render it in place of the directive
                var compiled = $compile(widget)($scope);
                elem.replaceWith(compiled);
            };

            return {
                link: renderWidget
            };
        }
    ]);

    // ========================================================================
    /**
     * Number widget
     */
    EdenMobile.directive('emWizardNumberWidget', [
        '$compile',
        function($compile) {

            var renderWidget = function($scope, elem, attr) {

                // Create the widget
                var widget = angular.element('<input type="number">');

                // Input attributes
                copyAttr(attr, widget, [
                    'ngModel',
                    'disabled',
                    'placeholder'
                ]);

                // Compile the widget against the scope, then
                // render it in place of the directive
                var compiled = $compile(widget)($scope);
                elem.replaceWith(compiled);
            };

            return {
                link: renderWidget
            };
        }
    ]);

    // ========================================================================
    /**
     * String widget
     */
    EdenMobile.directive('emWizardStringWidget', [
        '$compile',
        function($compile) {

            var renderWidget = function($scope, elem, attr) {

                // Create the widget
                var widget = angular.element('<input>')
                                    .attr('type', attr.type || 'text');

                // Input attributes
                copyAttr(attr, widget, [
                    'ngModel',
                    'disabled',
                    'placeholder'
                ]);

                // Compile the widget against the scope, then
                // render it in place of the directive
                var compiled = $compile(widget)($scope);
                elem.replaceWith(compiled);
            };

            return {
                link: renderWidget
            };
        }
    ]);

    // ========================================================================
    /**
     * Text widget
     */
    EdenMobile.directive('emWizardTextWidget', [
        '$compile',
        function($compile) {

            var renderWidget = function($scope, elem, attr) {

                // Create the widget
                var widget = angular.element('<textarea rows="5", cols="60">');

                // Input attributes
                copyAttr(attr, widget, [
                    'ngModel',
                    'disabled'
                ]);

                // Compile the widget against the scope, then
                // render it in place of the directive
                var compiled = $compile(widget)($scope);
                elem.replaceWith(compiled);
            };

            return {
                link: renderWidget
            };
        }
    ]);

})(EdenMobile);

// END ========================================================================
