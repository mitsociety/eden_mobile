/**
 * Sahana Eden Mobile - Update-Form Controller
 *
 * Copyright (c) 2016-2017: Sahana Software Foundation
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

// ============================================================================
/**
 * Update-Form Controller
 *
 * @class EMDataUpdate
 * @memberof EdenMobile
 */
EdenMobile.controller("EMDataUpdate", [
    '$scope', '$state', '$stateParams', 'emDialogs', 'emFiles', 'emResources',
    function($scope, $state, $stateParams, emDialogs, emFiles, emResources) {

        "use strict";

        // --------------------------------------------------------------------
        /**
         * Redirection upon successful update/delete action
         *
         * @param {string} resourceName: the master resource name
         * @param {integer} recordID: the master record ID (in component view)
         * @param {string} componentName: the component name (in component view)
         */
        var confirmAction = function(message, resourceName, recordID, componentName) {

            // Mark as saved
            $scope.saved = true;

            // Show confirmation popup and go back to list
            emDialogs.confirmation(message, function() {

                var returnTo,
                    returnParams = {resourceName: resourceName};

                if (!!componentName) {
                    // Go back to the component record list
                    returnTo = 'data.component';
                    returnParams.recordID = recordID;
                    returnParams.componentName = componentName;
                } else {
                    // Go back to the master record list
                    returnTo = 'data.list';
                }
                $state.go(returnTo, returnParams, {location: 'replace'});
            });
        };

        // --------------------------------------------------------------------
        /**
         * Callback after successful update
         */
        var onUpdate = function() {
            confirmAction('Record updated',
                resourceName,
                recordID,
                componentName);
        };

        // --------------------------------------------------------------------
        /**
         * Callback after successful delete
         */
        var onDelete = function() {
            confirmAction('Record deleted',
                resourceName,
                recordID,
                componentName);
        };

        // --------------------------------------------------------------------
        // Read state params
        var resourceName = $stateParams.resourceName,
            recordID = $stateParams.recordID,
            componentName = $stateParams.componentName,
            componentID = $stateParams.componentID;

        $scope.resourceName = resourceName;
        $scope.recordID = recordID;
        $scope.componentName = componentName;

        // --------------------------------------------------------------------
        /**
         * Configure and populate the scope with the target record
         *
         * @param {Subset} subset: the subset containing the target record
         * @param {integer} targetID: the target record ID
         */
        var configureForm = function(subset, targetID) {

            var resource = subset.resource;

            // Enable component menu when updating a master record
            if (!resource.parent) {
                if (Object.keys(resource.activeComponents).length) {
                    $scope.hasComponents = true;
                    $scope.openComponents = function($event) {
                        emDialogs.componentMenu($scope, $event, resource);
                    };
                }
            }

            // Set form title
            $scope.formTitle = resource.getLabel();

            // Configure submit-function
            $scope.submit = function(form) {
                // Check if empty (@todo: form onvalidation)
                var empty = true;
                for (var fieldName in form) {
                    if (form[fieldName] !== undefined && form[fieldName] !== null) {
                        empty = false;
                        break;
                    }
                }
                if (!empty) {
                    // Commit to database, then redirect
                    var table = resource.table;
                    table.where(table.$('id').equals(targetID)).update(form,
                        function() {
                            onUpdate();
                        });
                }
            };

            // Configure delete-action
            $scope.deleteRecord = function() {
                emDialogs.confirmAction(
                    'Delete Record',
                    'Are you sure you want to delete this record?',
                    function() {
                        var table = resource.table;
                        table.where(table.$('id').equals(targetID)).delete(
                            function() {
                                onDelete();
                            });
                    });
            };

            // Extract current record and populate form and master
            var table = subset.table,
                fields = resource.fields,
                fieldNames = Object.keys(fields),
                master = $scope.master,
                form = $scope.form;

            subset.where(table.$('id').equals(targetID))
                  .select(fieldNames, {limitby: 1}).then(function(rows) {

                if (rows.length == 1) {
                    // Prepopulate the scope with current record data
                    var record = rows[0]._(),
                        field,
                        fieldName,
                        value;
                    for (fieldName in fields) {
                        field = fields[fieldName];
                        if (!field.readable && fieldName != 'llrepr') {
                            continue;
                        }
                        value = record[fieldName];
                        if (value !== undefined) {
                            master[fieldName] = value;
                            form[fieldName] = value;
                        }
                    }
                } else {
                    // Show error popup, then go back to list
                    emDialogs.error('Record not found', null, function() {

                        var returnTo,
                            returnParams = {resourceName: resourceName};

                        if (componentName) {
                            // Go back to the component record list
                            returnTo = 'data.component';
                            returnParams.recordID = recordID;
                            returnParams.componentName = componentName;
                        } else {
                            // Go back to the master record list
                            returnTo = 'data.list';
                        }
                        $state.go(returnTo, returnParams, {location: 'replace'});
                    });
                }
            });
        };

        // --------------------------------------------------------------------
        /**
         * Initialize the scope
         */
        var initForm = function() {

            // Start with empty master (populated asynchronously)
            $scope.master = {};
            $scope.saved = false;

            // Reset the form (@todo: expose reset in UI?)
            $scope.reset = function() {
                $scope.form = angular.copy($scope.master);
                $scope.pendingFiles = [];
                $scope.orphanedFiles = [];
            };
            $scope.reset();

            // Initialize Components Menu
            if ($scope.componentMenu) {
                $scope.componentMenu.remove();
                $scope.componentMenu = null;
            }
            $scope.hasComponents = false;
            $scope.openComponents = null;

            // Access the resource, then populate the form
            emResources.open(resourceName).then(function(resource) {

                var component;

                if (componentName) {
                    component = resource.component(componentName);
                }

                // Click-handler for return-to-list button
                $scope.returnToList = function() {

                    var returnTo,
                        returnParams = {resourceName: resourceName};

                    if (componentName) {
                        returnParams.recordID = recordID;
                        if (component.multiple) {
                            // Go back to the component record list
                            returnTo = 'data.component';
                            returnParams.componentName = componentName;
                        } else {
                            // Go back to the main record update
                            returnTo = 'data.update';
                        }
                    } else {
                        // Go back to the master record list
                        returnTo = 'data.list';
                    }
                    $state.go(returnTo, returnParams, {location: 'replace'});
                };

                if (componentName) {
                    if (!component) {
                        // Undefined component
                        emDialogs.error('Undefined component', componentName, function() {
                            // Go back to master record
                            $state.go('data.update',
                                {resourceName: resourceName, recordID: recordID},
                                {location: 'replace', reload: true});
                        });
                    } else {
                        // Open component record
                        configureForm(component.subSet(recordID), componentID);
                    }
                } else {
                    // Open master record
                    configureForm(resource.subSet(), recordID);
                }
            });
        };

        // --------------------------------------------------------------------
        // Init on enter
        $scope.$on('$ionicView.enter', initForm);

        // Clean up on exit
        $scope.$on('$destroy', function() {
            if ($scope.saved) {
                // Record saved => remove orphaned files
                emFiles.removeAll($scope.orphanedFiles);
            } else {
                // Record not saved => remove pending files
                emFiles.removeAll($scope.pendingFiles);
            }
        });
    }
]);

// END ========================================================================
