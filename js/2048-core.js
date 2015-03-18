var objects = [
    {row: 1, col: 1, val: 0},
    {row: 1, col: 2, val: 0},
    {row: 1, col: 3, val: 0},
    {row: 1, col: 4, val: 0},
    {row: 2, col: 1, val: 0},
    {row: 2, col: 2, val: 0},
    {row: 2, col: 3, val: 0},
    {row: 2, col: 4, val: 0},
    {row: 3, col: 1, val: 0},
    {row: 3, col: 2, val: 0},
    {row: 3, col: 3, val: 0},
    {row: 3, col: 4, val: 0},
    {row: 4, col: 1, val: 0},
    {row: 4, col: 2, val: 0},
    {row: 4, col: 3, val: 0},
    {row: 4, col: 4, val: 0}
];

// 2048 Game view model
var _GameViewModel = function () {
    var self = this;

    self.tiles = ko.observableArray(objects);

    self.filterByRow = function(row) {
        return ko.utils.arrayFilter(self.tiles(), function(item) {
            return (item.row === row);
        });
    };

    self.filterByCol = function(col) {
        return ko.utils.arrayFilter(self.tiles(), function(item) {
            return (item.col === col);
        });
    };

    self.randNum = function (val){
        var newVal = Math.floor((Math.random()) * (4 - 1)) + 1;

        if (newVal === val) {
            return self.randNum(val);
        }

        return newVal;
    };

    self.addTwo = function () {
        var row = self.randNum(0);
        var col = self.randNum(0);

        ko.utils.arrayForEach(self.tiles(), function(tile) {
            if (tile.row == row && tile.col == col && tile.val == 0) {
                self.tiles.remove(tile);
                self.tiles.push({row: row, col: col, val: 2});
                console.log(tile);
            }
        });

        var _row = self.randNum(row);
        var _col = self.randNum(col);

        ko.utils.arrayForEach(self.tiles(), function(tile) {
            if (tile.row == _row && tile.col == _col && tile.val == 0) {
                self.tiles.remove(tile);
                self.tiles.push({row: _row, col: _col, val: 2});
                console.log(tile);
            }
        });
    };

    self.showThis = function(data, event) {
        console.log(data);
    }
};

var GameViewModel = new _GameViewModel();

//jQuery custom function for sorting knockout observableArray by Title/Date
$.fn.sortTiles = function(sortBy) {
    GameViewModel.tiles.sort(function(a, b) {
        var _a = a.col, _b = b.col;
        if(_a == _b) return 0;
        return _a > _b ? 1 : -1;
    });
};

//jQuery document ready
$(function(){
    // Activates knockout.js
    ko.applyBindings(GameViewModel);
    GameViewModel.addTwo();
    $(document).sortTiles();

    $(document).on( "keydown", function( event ) {
        switch( event.which ) {
            case 87:
                console.log( "up" );
                break;
            case 83:
                console.log( "down" );
                break;
            case 65:
                console.log( "left" );
                break;
            case 68:
                console.log( "right" );
                break;
        }
    });
});