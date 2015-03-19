//Preparing the tile in 1 dimension array with object content
//object.val and object.moved are observable so we can update the values on the fly
//object.row represents the row of the object
//object.col represents the column of the object
//object.val is the value of the tile
//object.moved is for us to check if the tile has been moved
var objects = [
    {row: 1, col: 1, val: ko.observable(0), moved: ko.observable(false)},
    {row: 1, col: 2, val: ko.observable(0), moved: ko.observable(false)},
    {row: 1, col: 3, val: ko.observable(0), moved: ko.observable(false)},
    {row: 1, col: 4, val: ko.observable(0), moved: ko.observable(false)},
    {row: 2, col: 1, val: ko.observable(0), moved: ko.observable(false)},
    {row: 2, col: 2, val: ko.observable(0), moved: ko.observable(false)},
    {row: 2, col: 3, val: ko.observable(0), moved: ko.observable(false)},
    {row: 2, col: 4, val: ko.observable(0), moved: ko.observable(false)},
    {row: 3, col: 1, val: ko.observable(0), moved: ko.observable(false)},
    {row: 3, col: 2, val: ko.observable(0), moved: ko.observable(false)},
    {row: 3, col: 3, val: ko.observable(0), moved: ko.observable(false)},
    {row: 3, col: 4, val: ko.observable(0), moved: ko.observable(false)},
    {row: 4, col: 1, val: ko.observable(0), moved: ko.observable(false)},
    {row: 4, col: 2, val: ko.observable(0), moved: ko.observable(false)},
    {row: 4, col: 3, val: ko.observable(0), moved: ko.observable(false)},
    {row: 4, col: 4, val: ko.observable(0), moved: ko.observable(false)}
];

// 2048 Game view model
var _GameViewModel = function () {
    var self = this;

    //Create an observableArray
    self.tiles = ko.observableArray(objects);

    //Return requested row from array for templating
    self.getByRow = function(row) {
        return ko.utils.arrayFilter(self.tiles(), function(item) {
            return (item.row === row);
        });
    };

    //Return only the row we want with sorted array
    self.filterByRow = function(row, sort) {
        var data = ko.utils.arrayFilter(self.tiles(), function(item) {
            return (item.row === row);
        });

        return data.sort(function(a, b) {
            var _a = a.col, _b = b.col;
            if(_a == _b) return 0;
            if (sort == 'asc') {
                return _a > _b ? 1 : -1;
            }
            else {
                return _a < _b ? 1 : -1;
            }
        });
    };

    //Return only the col we want with sorted array
    self.filterByCol = function(col, sort) {
        var data = ko.utils.arrayFilter(self.tiles(), function(item) {
            return (item.col === col);
        });

        return data.sort(function(a, b) {
            var _a = a.row, _b = b.row;
            if(_a == _b) return 0;
            if (sort == 'asc') {
                return _a > _b ? 1 : -1;
            }
            else {
                return _a < _b ? 1 : -1;
            }
        });
    };

    //Return only empty tiles
    self.filteredTiles = function () {
        return ko.utils.arrayFilter(self.tiles(), function(item) {
            return (item.val() === 0);
        });
    };

    //Generate random number
    self.randNum = function (length){
        return Math.floor((Math.random()) * length);
    };

    //Add number 2 in random tile once in empty tile only
    self.addTwo = function () {
        self.checkTiles(); //Check for winning tile
        var tiles = self.filteredTiles(); //Return only empty tiles

        if (tiles.length) { //Check if there is any empty tiles to add
            var num = self.randNum(tiles.length);
            tiles[num].val(2).moved(false);
        }
        else {
            alert('No more moves, you lose !!!');
        }
    };

    //New game will fire by default onload, if new game button is clicked it will fire again
    self.newGame = function() {
        var notEmpty = ko.utils.arrayFilter(self.tiles(), function(item) {
            return (item.val() !== 0);
        });

        ko.utils.arrayForEach(notEmpty, function(item) {
            item.val(0).moved(false);
        });

        self.addTwo();
        self.addTwo();
    };

    //Check if any tiles has 2048, if available then alert winning message
    self.checkTiles = function() {
        var win = ko.utils.arrayFilter(self.tiles(), function(item) {
            return (item.val() === 2048);
        });

        if (win.length > 0) {
            alert('Congratulation, you\'ve beat the game !!!');
        }
    };

    //Game logic to move tiles
    self.traverseTile = function(sort, direction) {
        for (var i=1; i<=4; i++) {
            if (direction == 'up' || direction == 'down') {
                var tiles = self.filterByCol(i, sort);
            }
            else if (direction == 'left' || direction == 'right') {
                var tiles = self.filterByRow(i, sort);
            }
            var ceiling = 3;

            for (var x=0; x<ceiling; x++) {
                if (tiles[x].val() == tiles[x+1].val()) {
                    tiles[x].val(0).moved(true);
                    tiles[x+1].val(tiles[x+1].val()*2).moved(true);
                }

                for (var j=x; j<=ceiling; j++) {
                    if (tiles[ceiling].val() == 0 && tiles[ceiling-1].val() != 0) {
                        tiles[ceiling].val(tiles[ceiling-1].val()).moved(true);
                        tiles[ceiling-1].val(0).moved(true);
                    }
                    else if (tiles[ceiling].val() == tiles[ceiling-1].val()) {
                        tiles[ceiling].val(tiles[ceiling-1].val()*2).moved(true);
                        tiles[ceiling-1].val(0).moved(true);
                    }

                    if (tiles[ceiling-1].val() == 0 && tiles[ceiling-2].val() != 0) {
                        tiles[ceiling-1].val(tiles[ceiling-2].val()).moved(true);
                        tiles[ceiling-2].val(0).moved(true);
                    }
                    else if (tiles[ceiling-1].val() == tiles[ceiling-2].val()) {
                        tiles[ceiling-1].val(tiles[ceiling-2].val()*2).moved(true);
                        tiles[ceiling-2].val(0).moved(true);
                    }

                    if (tiles[j].val() == 0) {
                        tiles[j].val(tiles[x].val()).moved(true);
                        tiles[x].val(0).moved(true);
                    }
                }
            }
        }
    };
};

//Initiate view model
var GameViewModel = new _GameViewModel();

//jQuery custom function for sorting knockout observableArray by Title/Date
$.fn.sortTiles = function() {
    GameViewModel.tiles.sort(function(a, b) {
        var _a = a.col, _b = b.col;
        if(_a == _b) return 0;
        return _a > _b ? 1 : -1;
    });
};

//jQuery document ready
$(function(){
    //Assign view model to new variable for easier access
    var gvm = GameViewModel;

    // Activates knockout.js
    ko.applyBindings(gvm);

    //Sort ko.observableArray self.tiles in ASC order
    $(document).sortTiles();

    //Keyboard mapping to game logic
    $(document).on( "keydown", function( event ) {
        switch( event.which ) {
            case 87: //Keypress "W" for Up
                gvm.traverseTile('desc', 'up');
                gvm.addTwo();
                break;
            case 83: //Keypress "S" for Down
                gvm.traverseTile('asc', 'down');
                gvm.addTwo();
                break;
            case 65:
                gvm.traverseTile('desc' , 'left');
                gvm.addTwo();
                break;
            case 68:
                gvm.traverseTile('asc' , 'left');
                gvm.addTwo();
                break;
        }
    });
});