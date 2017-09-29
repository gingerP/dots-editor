(function (angular) {
    'use strict';
    angular.module('app', []).controller('pane', function ($scope) {
        function showTestJSON() {

        }

        function convertArray(array) {
            var xIndex = 0;
            var yIndex = 0;
            var result = [];
            for (; yIndex < array.length; yIndex++) {
                for (xIndex = 0; xIndex < array[yIndex].length; xIndex++) {
                    if (array[yIndex][xIndex].isSelected) {
                        result.push({
                            x: array[yIndex][xIndex].x,
                            y: array[yIndex][xIndex].y
                        });
                    }
                }
            }
            return result;
        };

        function convertArrayToTestData(array) {
            var testData = {
                name: '',
                inbound: [],
                outbound: [{
                    id: 0,
                    loop: [],
                    trappedDots: []
                }]
            };
            var xIndex = 0;
            var yIndex = 0;
            var result = [];
            var item;
            for (; yIndex < array.length; yIndex++) {
                for (xIndex = 0; xIndex < array[yIndex].length; xIndex++) {
                    item = array[yIndex][xIndex];
                    if (item.isSelected) {
                        if (item.isBorder) {
                            testData.inbound.push({
                                x: array[yIndex][xIndex].x,
                                y: array[yIndex][xIndex].y
                            });
                            testData.outbound[0].loop.push({
                                x: array[yIndex][xIndex].x,
                                y: array[yIndex][xIndex].y
                            });
                        } else if (item.isTrapped) {
                            testData.outbound[0].trappedDots.push({
                                x: array[yIndex][xIndex].x,
                                y: array[yIndex][xIndex].y
                            });
                        }
                    }
                }
            }
            return testData;
        };

        function updateArray(x, y) {
            var xIndex = 0;
            var yIndex = 0;
            var result = [];
            for (; yIndex < y; yIndex++) {
                result.push([]);
                for (xIndex = 0; xIndex < x; xIndex++) {
                    result[yIndex].push({x: xIndex, y: yIndex});
                }
            }
            return result;
        };

        function makeSpiral() {
            var LIMIT = 50;
            var xSize = $scope.xSizeApproved;
            var ySize = $scope.ySizeApproved;
            var step = 2;
            var index = 0;
            var line = {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0
            };
            var lineSize = step + 1;

            while (lineSize > step) {
                lineSize = getLineSize(index, xSize);
                line = getSpiralLine(index, line.x2, line.y2, xSize);
                console.info('%s, %s, %s', index - (Math.floor(index / 4) * 4), JSON.stringify(line), getLineSize(index, xSize));
                selectLine(line);
                index++;
            }
            selectLine({x1: 2, y1: 1, x2: 2, y2: 1});
        }

        function makeBordersLoop() {
            var xSize = $scope.xSizeApproved;
            var ySize = $scope.ySizeApproved;
            var lines = [
                {x1: 0, y1: 0, x2: xSize - 1, y2: 0},
                {x1: xSize - 1, y1: 0, x2: xSize - 1, y2: ySize - 1},
                {x1: xSize - 1, y1: ySize - 1, x2: 0, y2: ySize - 1},
                {x1: 0, y1: ySize - 1, x2: 0, y2: 0},
            ];
            lines.forEach(selectLine);
            selectTrapped();
        }


        function makeSnake() {

        }

        function getLineSize(index, arrayHeight) {
            var stepOf3 = index - Math.floor(index / 2) * 2;
            var stepIndex = Math.floor(index / 2);
            var stepSize = 2;
            return arrayHeight - stepIndex * stepSize;
        }

        function getSpiralLine(index, x2, y2, arrayHeight) {
            var isVertical = index / 2 === Math.floor(index / 2);
            var position = index - (Math.floor(index / 4) * 4);
            var lineSize = getLineSize(index, arrayHeight);
            if (position === 0) {
                return {x1: x2, y1: y2, x2: x2 + (lineSize - 1), y2: y2};
            } else if (position === 1) {
                return {x1: x2, y1: y2, x2: x2, y2: y2 + (lineSize - 1)};
            } else if (position === 2) {
                return {x1: x2, y1: y2, x2: x2 - (lineSize - 1), y2: y2};
            } else if (position === 3) {
                return {x1: x2, y1: y2, x2: x2, y2: y2 - (lineSize - 1)};
            }

        }

        function selectLine(pos) {
            var index = 0;
            var direction;
            if (pos.x1 === pos.x2) {
                if (pos.y1 < pos.y2) {
                    for (index = pos.y1; index <= pos.y2; index++) {
                        $scope.array[index][pos.x1].isBorder = true;
                        $scope.array[index][pos.x1].isSelected = true;
                    }
                } else {
                    for (index = pos.y1; index >= pos.y2; index--) {
                        $scope.array[index][pos.x1].isBorder = true;
                        $scope.array[index][pos.x1].isSelected = true;
                    }
                }
            } else if (pos.y1 === pos.y2) {
                if (pos.x1 < pos.x2) {
                    for (index = pos.x1; index <= pos.x2; index++) {
                        $scope.array[pos.y1][index].isBorder = true;
                        $scope.array[pos.y1][index].isSelected = true;
                    }
                } else {
                    for (index = pos.x1; index >= pos.x2; index--) {
                        $scope.array[pos.y1][index].isBorder = true;
                        $scope.array[pos.y1][index].isSelected = true;
                    }
                }
            }
        }

        function selectTrapped() {
            var array = $scope.array;
            array.forEach(function(line) {
                line.forEach(function(vertex) {
                    if (!vertex.isSelected) {
                        vertex.isSelected = true;
                        vertex.isTrapped = true;
                    }
                });
            });
        }

        function updatePane() {
            $scope.xSizeApproved = Number($scope.xSize);
            $scope.ySizeApproved = Number($scope.ySize);
            $scope.array = updateArray($scope.xSizeApproved, $scope.ySizeApproved);
            if ($scope.selectedTemplate && $scope.selectedTemplate.id !== 'empty') {
                if ($scope.selectedTemplate.id === 'spiral') {
                    makeSpiral();
                } else if ($scope.selectedTemplate.id === 'borders') {
                    makeBordersLoop();
                }
            }
        }

        function updateItem(item) {
            item.loopId = $scope.selectedLoopId;
            item.isSelected = !item.isSelected;
            item.isBorder = !item.isSelected ? false : $scope.selectionType === 'border';
            item.isTrapped = !item.isSelected ? false : $scope.selectionType === 'trapped';
            $scope.selectedSize = convertArray($scope.array).length;
        }

        function updateItemOnMouseOver(item) {
            if ($scope.isListenCursor) {
                updateItem(item);
            }
        }

        function showArray() {
            $scope.isPopupVisible = !$scope.isPopupVisible;
            if ($scope.isPopupVisible) {
                $scope.arrayToString = JSON.stringify(convertArray($scope.array));
            }
        }

        function selectText() {
            var containerid = 'popup';
            if (document.selection) {
                var range = document.body.createTextRange();
                range.moveToElementText(document.getElementById(containerid));
                range.select();
            } else if (window.getSelection) {
                var range = document.createRange();
                range.selectNode(document.getElementById(containerid));
                window.getSelection().addRange(range);
            }
        }

        function showTestJSON() {
            $scope.isPopupVisible = !$scope.isPopupVisible;
            if ($scope.isPopupVisible) {
                $scope.arrayToString = JSON.stringify(convertArrayToTestData($scope.array), null, '');
            }
        }

        function getDefaultLoop() {
            return {
                id: getRandomId(),
                loop: [],
                trappedDots: []
            };
        }

        function getRandomId() {
            return Math.random().toString(36).substring(20);
        }

        function addLoop() {
            $scope.loops.push(getDefaultLoop());
        }

        function deleteLoop(item) {
            var index = 0;
            for(;index < $scope.loops.length; index++) {
                if (item.id === $scope.loops[index].id) {
                    $scope.loops.splice(index, 1);
                    break;
                }
            }
        }

        function selectLoop(item) {
            var index = 0;
            $scope.selectedLoopId = item.id;
            for(;index < $scope.loops.length; index++) {
                if (item.id !== $scope.loops[index].id) {
                    $scope.loops[index].isActive = false;
                } else {
                    $scope.loops[index].isActive = true;
                }
            }
        }

        function getSelectionBorders() {
            var result = {
                min: {
                    x: $scope.array[0].length,
                    y: $scope.array.length
                },
                max: {
                    x: 0,
                    y: 0
                }
            };
            var xIndex = 0;
            var yIndex = 0;
            var item;
            
            for(; xIndex < $scope.array.length; xIndex++) {
                for(yIndex = 0; yIndex < $scope.array.length; yIndex++) {
                    if ($scope.array[xIndex][yIndex].isSelected) {
                        if (xIndex > result.max.x) {
                            result.max.x = xIndex; 
                        }    
                        if (xIndex < result.min.x) {
                            result.min.x = xIndex;
                        }
                        if (yIndex > result.max.y) {
                            result.max.y = yIndex;
                        }
                        if (yIndex < result.min.y) {
                            result.min.y = yIndex;
                        }
                    }
                }                
            }

            return result;
        }

        function getSignsImage() {
            var result = '';
            var borders = getSelectionBorders();
            var xIndex = 0;
            var yIndex = 0;

            for(; xIndex < $scope.array.length; xIndex++) {
                for(yIndex = 0; yIndex < $scope.array[xIndex].length; yIndex++) {
                    if ($scope.array[xIndex][yIndex].isTrapped) {
                        result += '×─';
                    } else if ($scope.array[xIndex][yIndex].isSelected) {
                        result += '■─';
                    } else {
                        result += '┼─';
                    }
                }
                result += '\n';
            }
            return result;
        }

        function showSignsImage() {
            $scope.isPopupVisible = !$scope.isPopupVisible;
            if ($scope.isPopupVisible) {
                $scope.arrayToString = getSignsImage();
            }
        }

        function loadTestArray() {
            try {
                var vertexes = JSON.parse($scope.stringToObject.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": '));
                var border = getMaxBorders(vertexes);

                $scope.xSize = Math.max(border.y + 2, border.x + 2);
                $scope.ySize = Math.max(border.y + 2, border.x + 2);
                updatePane();
                vertexes.forEach(function(inboundItem) {
                    var item = $scope.array[inboundItem.y][inboundItem.x];
                    item.isBorder = true;
                    item.isSelected = true;
                    item.isTrapped = false;
                });
                $scope.isVisible = true;
                $scope.isTextareaPopupVisible = false;
            } catch(error) {
                console.error(error);
            }

        }
        function loadTestJSON() {
            try {
                var object = JSON.parse($scope.stringToObject);
                var vertexes = object.inbound.list || [];
                var border = getMaxBorders(vertexes);
                    
                $scope.xSize = border.y + 2;
                $scope.ySize = border.x + 2;
                updatePane();
                vertexes.forEach(function(inboundItem) {
                    var item = $scope.array[inboundItem.x][inboundItem.y];
                    item.isBorder = true;
                    item.isSelected = true;
                    item.isTrapped = false;
                });
                if (object.outbound) {
                    object.outbound.forEach(function(outboundItem) {
                        outboundItem.trappedDots.forEach(function(trappedDot) {
                            var item = $scope.array[trappedDot.x][trappedDot.y];
                            item.isBorder = false;
                            item.isSelected = true;
                            item.isTrapped = true;
                        });
                    });
                }
                $scope.isVisible = true;
                $scope.isTextareaPopupVisible = false;
            } catch(error) {
                console.error(error);
            }
        }

        function beatyTestJSON() {
            try {
                $scope.stringToObject = JSON.stringify(JSON.parse($scope.stringToObject), null, '  ');
            } catch(error) {
                console.error(error);
            }
        }
        
        function openTextAreaPopup() {
            $scope.isTextareaPopupVisible = !$scope.isTextareaPopupVisible;
            $scope.stringToObject = '';
        }
        
        function getMaxBorders(vertexes, vertex) {
            vertex = vertex || {x: 0, y: 0};
            vertexes.forEach(function(vertexItem) {
                if (vertexItem.x > vertex.x) {
                    vertex.x = vertexItem.x;
                }
                if (vertexItem.y > vertex.y) {
                    vertex.y = vertexItem.y;
                }
            });
            
            return vertex;
        }

        $scope.showSignsImage = showSignsImage;
        $scope.selectedLoopId = null;
        $scope.loops = [getDefaultLoop()];
        $scope.xSize = 0;
        $scope.ySize = 0;
        $scope.xSizeApproved = 0;
        $scope.ySizeApproved = 0;
        $scope.array = [];
        $scope.selectedSize = 0;
        $scope.isListenCursor = false;
        $scope.isPositionDisplayed = true;
        $scope.isVisible = false;
        $scope.selectedTemplate;

        $scope.isPopupVisible = false;
        $scope.isTextareaPopupVisible = false;

        $scope.arrayToString = '';
        $scope.selectionType = 'border';
        $scope.templates = [
            {id: 'empty', label: '-Select-'},
            {id: 'spiral', label: 'Spiral'},
            {id: 'snake', label: 'Snake'},
            {id: 'borders', label: 'Borders'}
        ];
        
        $scope.loadTestJSON = loadTestJSON;
        $scope.loadTestArray = loadTestArray;

        $scope.openTextAreaPopup = openTextAreaPopup;
        $scope.beatyTestJSON = beatyTestJSON;

        $scope.updatePane = updatePane;
        $scope.updateItem = updateItem;
        $scope.updateItemOnMouseOver = updateItemOnMouseOver;
        $scope.showArray = showArray;
        $scope.showTestJSON = showTestJSON;
        $scope.selectText = selectText;
        $scope.addLoop = addLoop;
        $scope.deleteLoop = deleteLoop;
        $scope.selectLoop = selectLoop;

        $scope.$watch('isListenCursor', function (isListenCursor) {

        });
    });
})(window.angular);