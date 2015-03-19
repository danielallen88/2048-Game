//Preparing the default tile object form
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
    self.objects = objects;
    self.tiles = ko.observableArray(self.objects);

    self.getByRow = function(row) {
        return ko.utils.arrayFilter(self.tiles(), function(item) {
            return (item.row === row);
        });
    };

    //Return only the row we want
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

    //Return only the col we want
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
        var tiles = self.filteredTiles();
        var num = self.randNum(tiles.length);

        tiles[num].val(2).moved(false);
    };

    //New game
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