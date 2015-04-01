'use strict';


/**
 * FUNCTIONS.
 */
function enable(container) {

  $.each(container.find('.list'), function checkList(index, list) {

    list = $(list);

    if (list.attr('data-enable') !== 'false') {
      enableList(list);
    }

  });

}

function enableList(list) {

  list.find('.list-handle').click(handleClick.bind(null, list));

}

function handleClick(list, e) {

  var handle = $(e.currentTarget);

  var sortName = handle.attr('data-sortname');
  var sortOrder = handle.attr('data-sortorder');
  var sortValue = (sortOrder === 'asc') ? 1 : -1;
  var dataType = handle.attr('data-type') || 'string';

  var listItems = list.find('.list-item');

  listItems.sort(function sortList(a, b) {

    var aValue = $(a).attr('data-' + sortName);
    var bValue = $(b).attr('data-' + sortName);

    if (dataType === 'number') {
      aValue = +aValue;
      bValue = +bValue;
    } else if (dataType === 'date') {
      if (!aValue) {
        aValue = new Date(2016, 0, 1);
      } else {
        aValue = new Date(aValue);
      }
      if (!bValue) {
        bValue = new Date(2016, 0, 1);
      } else {
        bValue = new Date(bValue);
      }
    } else if (dataType === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue > bValue) {
      return sortValue * 1;
    } else if (aValue < bValue) {
      return sortValue * -1;
    } else {
      return 0;
    }

  });

  handle.attr('data-sortorder', (sortValue === 1) ? 'desc': 'asc');

  $.each(listItems, function rearrangeList(index, item) {
    list.append(item);
  });

}


/**
 * EXPORTS.
 */
module.exports = {
  enable: enable
};