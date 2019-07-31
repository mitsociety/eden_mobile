/**
 * Sahana Eden Mobile - Wizard Form Directives
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

    "use strict";

    // ========================================================================
    /**
     * Directive for <em-form-section>:
     *   - a section of a form
     */
    EdenMobile.directive('emFormSection', [
        '$compile',
        function($compile) {

            var renderSection = function($scope, elem) {

                // Get the section config
                var sectionConfig = $scope.sectionConfig;
                if (!sectionConfig) {
                    return;
                }

                // Create the form
                var form = angular.element('<form>')
                                  .attr('name', 'wizard')
                                  .attr('novalidate', 'novalidate');

                // Generate the form rows for this section
                var formRows = angular.element('<div class="list">');
                sectionConfig.forEach(function(formElement) {
                    if (formElement.type == 'input') {
                        var formRow = angular.element('<em-form-row>')
                                             .attr('field', formElement.field);
                        formRows.append(formRow);
                    }
                });
                form.append(formRows);

                // Compile the form, and put it into the DOM
                elem.replaceWith($compile(form)($scope));
            };

            return {
                link: renderSection
            };
        }
    ]);

    // ========================================================================
    /**
     * Directive for <em-form-row>:
     *   - a form row with label and input widget etc.
     */
    EdenMobile.directive('emFormRow', [
        '$compile', 'emFormStyle', 'emFormWizard',
        function($compile, emFormStyle, emFormWizard) {

            var renderFormRow = function($scope, elem, attr) {

                // Get the resource from (parent) scope
                var resource = $scope.resource;
                if (!resource) {
                    return;
                }

                // Get the field
                var fieldName = attr.field,
                    field = resource.fields[fieldName];
                if (!field) {
                    return;
                }

                // Generate the widget and bind it to form
                var prefix = attr.prefix || 'form',
                    widget = emFormWizard.getWidget(field)
                                         .attr('ng-model', prefix + '.' + fieldName);

                // Use emFormStyle to render the form row
                // TODO: - comment (=description)
                //       - image
                //       - display logic (probably better to handle in controller)
                var formRow = emFormStyle.formRow(field.getLabel(), widget);

                // Compile the formRow, and put into the DOM
                elem.replaceWith($compile(formRow)($scope));
            };

            return {
                link: renderFormRow
            };
        }
    ]);

    // ========================================================================
    /**
     * Directive for <em-wizard-header>:
     *   - the top bar in the wizard view
     */
    EdenMobile.directive('emWizardHeader', function() {
        return {
            //link: renderHeader,
            templateUrl: 'views/wizard/header.html'
        };
    });

    // ========================================================================
    /**
     * Directive for <em-wizard-submit>:
     *   - the next/submit button row at the end of a form section
     */
    EdenMobile.directive('emWizardSubmit', function() {
        return {
            templateUrl: 'views/wizard/submit.html'
        };
    });

})(EdenMobile);

// END ========================================================================