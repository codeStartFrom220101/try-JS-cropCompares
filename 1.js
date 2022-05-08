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

let data = [];
let dataList = [];
let cropType = "";
let sortBy = "";
let upDown = "";

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
    if (e.target.nodeName !== "BUTTON") return;
    let type = e.target.dataset.type;
    cropBtn.forEach(i => {
        if (i.dataset.type !== type) {
            i.classList.remove("active");
        }
    });
    e.target.classList.toggle("active");
    if (type !== cropType) {
        cropType = type;
    } else {
        cropType = "";
    }
    resultTxt.textContent = "";
    cropName.value = "";
    if (e.target.classList.contains("active")) {
        if (cropType) {
            dataList = data.filter(i => i.種類代碼 === cropType);
        }
    } else {
        dataList = data
    }
    productsList.innerHTML = `<tr><td colspan="7" class="text-center p-3">資料載入中...</td></tr>`
    setTimeout(() => {
        renderData(dataList);
    }, 1000);
}

// 搜尋功能
searchBtn.addEventListener("click", searchCrop);

function searchCrop() {
    if (!cropName.value.trim()) {
        resultTxt.textContent = "請輸入作物名稱！";
        resultTxt.classList.add("text-danger");
        productsList.innerHTML = `<tr><td colspan="7" class="text-center p-3">請輸入並搜尋想比價的作物名稱^＿^</td></tr>`
        return;
    }
    cropBtn.forEach(i => {
        i.classList.remove("active");
    });
    
    dataList = data.filter(i => i.作物名稱.match(cropName.value));
    if (!dataList.length) {
        resultTxt.textContent = "";
        productsList.innerHTML = `<tr><td colspan="7" class="text-center p-3">查詢不到當日的交易QQ</td></tr>`
        return;
    }
    resultTxt.classList.remove("text-danger");
    resultTxt.textContent = `查看「${cropName.value}」的比價結果`;
    cropType = dataList[0].種類代碼;
    for (i = 0; i < cropBtn.length; i++) {
        if (cropBtn[i].dataset.type === cropType) {
            cropBtn[i].classList.add("active");
        }
    }
    productsList.innerHTML = `<tr><td colspan="7" class="text-center p-3">資料載入中...</td></tr>`
    setTimeout(() => {
        resultTxt.textContent = `查看「${cropName.value}」的比價結果，共有「 ${dataList.length} 」筆`
        renderData(dataList);
    }, 1000);
}
// 優化鍵盤搜尋
cropName.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        searchCrop();
    }
})

// 下拉式選單排序
select.addEventListener("change", selectSort);
function selectSort(e) {
    console.log("SS");
    sortBy = e.target.value.slice(1, select.value.length - 2);
    console.log(sortBy);
    upDown = "down"
    sortData();
}

sortAdvanced.addEventListener("click", upAndDown)

function upAndDown(e) {
    if (e.target.nodeName !== "I") {
        return;
    }
    sortBy = e.target.closest("div").textContent.trim();
    upDown = e.target.dataset.sort
    sortData();
}

function sortData() {
    if (!dataList.length) {
        return;
    }
    if (upDown === "down") {
        dataList = dataList.sort((a, b) => a[sortBy] - b[sortBy]);
    } else if (upDown === "up") {
        dataList = dataList.sort((a, b) => b[sortBy] - a[sortBy]);
    }
    renderData(dataList);
}
