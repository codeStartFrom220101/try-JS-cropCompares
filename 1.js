// 資料串接功能  渲染資料
const url = "https://hexschool.github.io/js-filter-data/data.json";
const productsList = document.querySelector(".showList");
// 選擇作物種類功能
const cropBtns = document.querySelector(".button-group");
const cropBtn = cropBtns.querySelectorAll("button");
// 搜尋功能
const searchBtn = document.querySelector(".search");
const cropName = document.querySelector(".rounded-end");
const resultTxt = document.querySelector(".show-result");
// 下拉式選單排序
const select = document.querySelector(".sort-select");
const sortAdvanced = document.querySelector(".js-sort-advanced");
const sortAdvancedI = document.querySelectorAll(".js-sort-advanced i");
// mobile select
const mobileSelect = document.querySelector(".mobile-select");
// table 換頁
const pageChange = document.querySelector(".pages");
const pageNum = document.querySelector(".pageNum");
const totalPages = document.querySelector(".totalPages");

let data = [];
let dataList = [];
let pageData = [];
let cropNum = "";
let cropType = "";
let sortBy = "";
let upDown = "";
let i = 0;
//資料串接功能  渲染資料
function renderData(data) {
    let str = ""
    data.forEach(i => {
        str += `<tr>
                <td>${i.作物名稱}</td>
                <td>${i.市場名稱}</td>
                <td>${i.上價}</td>
                <td>${i.中價}</td>
                <td>${i.下價}</td>
                <td>${i.平均價}</td>
                <td>${i.交易量}</td>
                </tr>`
    });
    productsList.innerHTML = str
}

function getData() {
    axios.get(url)
        .then(function (response) {
            data = response.data.filter(i => i.作物名稱 && i.種類代碼.trim() !== "");
        })
        .catch(function (err) {
            console.log(err);
        })
}
getData();

// 選擇作物種類功能
cropBtns.addEventListener("click", chooseCropType);

function chooseCropType(e) {
    sortAdvancedI.forEach(i => {
        i.classList.remove("text-danger");
    });
    if (e.target.nodeName !== "BUTTON") return;
    if (!cropName.textContent) {
        resultTxt.classList.remove("text-danger");
    }
    let type = e.target.dataset.type;
    cropBtn.forEach(i => {
        if (i.dataset.type !== type) {
            i.classList.remove("active");
        }
    });
    e.target.classList.toggle("active");
    if (type !== cropNum) {
        cropNum = type;
    } else {
        cropNum = "";
    }
    resultTxt.textContent = "";
    cropName.value = "";
    if (e.target.classList.contains("active")) {
        if (cropNum) {
            dataList = data.filter(i => i.種類代碼 === cropNum);
            cropType = e.target.textContent;
        }
    } else {
        dataList = data
        cropType = "全部作物";
    }
    i = 0;
    productsList.innerHTML = `<tr><td colspan="7" class="text-center p-3">資料載入中...</td></tr>`
    resultTxt.textContent = `查看「${cropType}」的比價結果`;
    setTimeout(() => {
        resultTxt.textContent = `查看「${cropType}」的比價結果，共有「 ${dataList.length} 」筆`
        updateData()
    }, 500);
}

// 搜尋功能
searchBtn.addEventListener("click", searchCrop);

function searchCrop() {
    cropBtn.forEach(i => {
        i.classList.remove("active");
    });
    sortAdvancedI.forEach(i => {
        i.classList.remove("text-danger");
    });
    if (!cropName.value.trim()) {
        resultTxt.textContent = "請輸入作物名稱！";
        resultTxt.classList.add("text-danger");
        productsList.innerHTML = `<tr><td colspan="7" class="text-center p-3">請輸入並搜尋想比價的作物名稱^＿^</td></tr>`
        dataList = [];
        totalPages.textContent = 1;
        return;
    }
    dataList = data.filter(i => i.作物名稱.match(cropName.value));
    if (!dataList.length) {
        resultTxt.textContent = "";
        productsList.innerHTML = `<tr><td colspan="7" class="text-center p-3">查詢不到當日的交易QQ</td></tr>`
        return;
    }
    resultTxt.classList.remove("text-danger");
    resultTxt.textContent = `查看「${cropName.value}」的比價結果`;
    
    if (dataList.filter(i => i.種類代碼 === "N04").length) {
        cropBtn[0].classList.add("active");
    }
    if (dataList.filter(i => i.種類代碼 === "N05").length) {
        cropBtn[1].classList.add("active");
    }
    if (dataList.filter(i => i.種類代碼 === "N06").length) {
        cropBtn[2].classList.add("active");
    }

    i = 0;
    productsList.innerHTML = `<tr><td colspan="7" class="text-center p-3">資料載入中...</td></tr>`
    setTimeout(() => {
        resultTxt.textContent = `查看「${cropName.value}」的比價結果，共有「 ${dataList.length} 」筆`
        updateData()
    }, 500);
}
// 優化鍵盤搜尋
cropName.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        searchCrop();
    }
})

// 下拉式選單排序
select.addEventListener("change", selectSort);
// mobile
mobileSelect.addEventListener("change", selectSort);

function selectSort(e) {
    if (!e.target.value) {
        return;
    }
    sortAdvancedI.forEach(i => {
        i.classList.remove("text-danger");
    });
    sortBy = e.target.value;
    console.log(sortBy);
    upDown = "down";
    sortData();
    upDown = "";
}



sortAdvanced.addEventListener("click", upAndDown);

function upAndDown(e) {
    if (e.target.nodeName !== "I") {
        return;
    }
    sortBy = e.target.closest("div").textContent.trim();
    select.value = sortBy;
    mobileSelect.value = sortBy;
    upDown = e.target.dataset.sort
    sortAdvancedI.forEach(i => {
        if (i.dataset.sort !== upDown || i.closest("div").textContent.trim() !== sortBy) {
            i.classList.remove("text-danger");
        }
    });
    if (e.target.classList.contains("text-danger")) {
        upDown = "down";
        select.value = "排序";
        mobileSelect.value = "排序";
    }
    e.target.classList.toggle("text-danger");
    sortData();
}

function sortData() {
    if (!dataList.length) {
        return;
    }
    if (upDown === "down") {
        dataList = dataList.sort((a, b) => b[sortBy] - a[sortBy]);
    } else if (upDown === "up") {
        dataList = dataList.sort((a, b) => a[sortBy] - b[sortBy]);
    }
    i = 0;
    updateData()
}

pageChange.addEventListener("click", tbodyPage);

function tbodyPage(e) {
    if (e.target.nodeName !== "A" || dataList.length === 0) {
        return;
    }
    if (i < 0) {
        i += 10;
    } else if (i >= dataList.length) {
        i -= 10;
    }
    switch (e.target.textContent) {
        case "第一頁":
            i = 0;
            break;
        case "上一頁":
            i -= 10;
            break;
        case "下一頁":
            i += 10;
            break;
        case "最後一頁":
            i = dataList.length - dataList.length % 10;
            break;
    }
    if (i < 0 || i >= dataList.length) {
        return;
    }
    console.log(i, dataList.length);
    updateData();
}

function updateData() {
    if (!dataList.length) {
        productsList.innerHTML = `<tr><td colspan="7" class="text-center p-3">請輸入並搜尋想比價的作物名稱^＿^</td></tr>`
        return;
    }
    pageNum.textContent = i / 10 + 1;
    if (dataList.length % 10 === 0) {
        totalPages.textContent = Math.ceil(dataList.length / 10);
    } else {
        totalPages.textContent = Math.ceil((dataList.length + 0.1) / 10);
    }
    pageData = dataList.slice(i, i + 10);
    renderData(pageData);
}
updateData();