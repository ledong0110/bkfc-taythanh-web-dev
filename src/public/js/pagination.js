//calling function with passing parameters and adding inside element which is ul tag
function createPagination(totalPages, page){
    const element = document.querySelector(".pagination");
    let liTag = '';
    let active;
    let beforePage = page - 1;
    let afterPage = page + 1;
    if(page > 1){ //show the next button if the page value is greater than 1
        liTag += `<li class="pagination-item" data-pag="${page - 1}">
                    <span class="pagination-item__link">
                        <i class="pagination-item__icon fas fa-angle-left"></i>
                    </span>
                </li>`
    }

    if(page > 2){ //if page value is less than 2 then add 1 after the previous button
        liTag += `<li class="pagination-item " data-pag="1">
                        <span class="pagination-item__link">
                        1
                        </span>
                    </li>`;
        if(page > 3){ //if page value is greater than 3 then add this (...) after the first li or page
        liTag += `<li class="pagination-item-dots">
                        <i class="pagination-item__icon fas fa-ellipsis-h"></i>
                    </li>`;
        }
    }
    if (totalPages > 4)
    {
        // how many pages or li show before the current li
        if (page == totalPages) {
            beforePage = beforePage - 2;
        } else if (page == totalPages - 1) {
            beforePage = beforePage - 1;
            
        }
        // how many pages or li show after the current li
        if (page == 1) {
            afterPage = afterPage + 2;
        } else if (page == 2) {
            afterPage  = afterPage + 1;
        }
    }

    
    for (var plength = beforePage; plength <= afterPage; plength++) {
        if (plength > totalPages) { //if plength is greater than totalPage length then continue
        continue;
        }
        if (plength == 0) { //if plength is 0 than add +1 in plength value
        plength = plength + 1;
        }
        if(page == plength){ //if page is equal to plength than assign active string in the active variable
        active = "pagination-item--active";
        }else{ //else leave empty to the active variable
        active = "";
        }
        liTag += `<li class="pagination-item ${active}" data-pag="${plength}">
                    <span class="pagination-item__link">
                        ${plength}
                    </span>
                </li>`;
    }

    if(page < totalPages - 1){ //if page value is less than totalPage value by -1 then show the last li or page
        if(page < totalPages - 2 ){ //if page value is less than totalPage value by -2 then add this (...) before the last li or page
        liTag += `<li class="pagination-item-dots">
                        <i class="pagination-item__icon fas fa-ellipsis-h"></i>
                    </li>`;
        }
            liTag += `<li class="pagination-item " data-pag="${totalPages}">
                        <span class="pagination-item__link">
                        ${totalPages}
                        </span>
                    </li>`;
    }

    if (page < totalPages) { //show the next button if the page value is less than totalPage(20)
        liTag += `<li class="pagination-item" data-pag="${page + 1}">
                    <span class="pagination-item__link">
                    <i class="pagination-item__icon fas fa-angle-right"></i>
                    </span>
                </li>`;
    }
    element.innerHTML = liTag; //add li tag inside ul tag
        //reurn the li tag
}

//This function conduct POST method and return the json data from server, config variable is config for jquery ajax



