﻿// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

const $id = (id) => document.getElementById(id);
let baseContainer,movieListData,currentMovieData;
 
function init() {
    baseContainer = $id('base');
    showListView();
}
function showListView() {
    DOMTemplate.deleteChildrenNodeAll(baseContainer);

    DOMTemplate.applyTemplate(baseContainer, 'indexView');
    const searchStringCtrl = $id('searchString');
    const itemListCtrl = $id('itemList');

    rederMovieList('', itemListCtrl);
    $id('searchButton').addEventListener('click', () => {
        DOMTemplate.deleteChildrenNodeAll(itemListCtrl);
        const endpoint = (searchStringCtrl.value === '') ? '' : '/find/' + searchStringCtrl.value;
        rederMovieList(endpoint, itemListCtrl);
    });
}
async function rederMovieList(arg, itemListCtrl) {
    const END_POINT = 'api/movie' + arg;
    const response = await fetch(END_POINT);
    movieListData = await response.json();

    let cnt= 0;
    for (item of movieListData) {
        item.editHref = `javaScript:showEditView(${cnt})`;
        item.detailHref = `javaScript:showDetailsView(${cnt})`;
        item.deleteHref = `javaScript:deleteListIem(${cnt})`;
        item.releaseDate = dateFormate(item.releaseDate);
        item.updateCaption = 'Update';
        cnt++
    }
    DOMTemplate.bindTemplate(itemListCtrl, movieListData, DOMTemplate.oderBy.ASC);
}

//新規作成画面を表示
function showCreateView() {
    DOMTemplate.deleteChildrenNodeAll(baseContainer);
    DOMTemplate.applyTemplate(baseContainer, 'createView');
    $id('submitButton').onclick = () => {
        postData(null);
    };
}

//編集画面を表示
function showEditView(index) {
    currentMovieData = movieListData[index];
    currentMovieData.updateHref = `updateIem()`;
    showCreateView()
    DOMTemplate.traversalBind($id('movieForm'), currentMovieData);
    $id('submitButton').onclick = () => {
        postData(currentMovieData.id);
    }
}

//詳細画面を表示
function showDetailsView(index) {
    currentMovieData = movieListData[index];
    DOMTemplate.deleteChildrenNodeAll(baseContainer);
    DOMTemplate.applyTemplate(baseContainer, 'datailView');
    DOMTemplate.traversalBind($id('movieInfo'), currentMovieData);
    $id('deleteButton').style.display = 'none';
    $id('editLink').style.display = 'block';
}

//データを削除
function deleteListIem(index) {
    currentMovieData = movieListData[index];
    DOMTemplate.deleteChildrenNodeAll(baseContainer);
    DOMTemplate.applyTemplate(baseContainer, 'datailView');
    DOMTemplate.traversalBind($id('movieInfo'), currentMovieData);
    $id('editLink').style.display = 'none';
    const deleteButton = $id('deleteButton');
    deleteButton.style.display = 'block';
    
    deleteButton.onclick = async () => {
        const response = await fetch(`/api/Movie/${currentMovieData.id}`, {
            method: "DELETE",
        });
        showListView();
        return await response.status;
    }
}

//日付データのフォーマットを整える
function dateFormate(date) {
    let d = new Date(date);
    const returnString = `${d.getFullYear()}-${addZero(d.getMonth())}-${addZero(d.getDate())}`;
    return returnString;
}

function addZero(num) {
  return (num < 10) ? '0' + num : num;
}


async function postData(id) {
    let data = {
        "title": $id('Title').value,
        "releaseDate": $id('ReleaseDate').value,
        "genre": $id('Genre').value,
        "price": $id('Price').value,
        "rating": $id('Rating').value
    };

    if (id) {
        data.id = id

        const response = await fetch(`/api/Movie/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const responData = await response.json();
        showListView();
        return responData.id;

    } else {
        const response = await fetch('/api/Movie', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data), 
        });
        const responData = await response.json();
        showListView();
        return responData.id;
    }
}
