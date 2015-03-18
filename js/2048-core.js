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

    self.showThis = function(data, event) {
        console.log(data);
    }
}

var GameViewModel = new _GameViewModel();

//jQuery custom function for sorting knockout observableArray by Title/Date
$.fn.sortTiles = function(sortBy) {
    ToDoViewModel.tiles.sort(function(a, b) {
        var _a = a.row, _b = b.row;
        if(_a == _b) return 0;
        return _a > _b ? 1 : -1;
    });
};

//jQuery document ready
$(function(){
    // Activates knockout.js
    ko.applyBindings(GameViewModel);
});