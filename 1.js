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
console.log(select.value);
let data = [];
let cropTypeData = [];
let cropType = "";
let searchData = [];

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
    cropName.value = "";
    cropType = e.target.dataset.type;
    cropBtn.forEach(i => {
        if (i.dataset.type !== cropType) {
            i.classList.remove("active");
        }
    });
    e.target.classList.toggle("active");

    if (e.target.classList.contains("active")) {
        if (cropType) {
            cropTypeData = data.filter(i => i.種類代碼 === cropType);
        }
    } else {
        cropTypeData = data
    }
    renderData(cropTypeData);
}

// 搜尋功能
searchBtn.addEventListener("click", searchCrop);

function searchCrop() {
    if (cropName.value.trim() === "") {
        resultTxt.textContent = "請輸入作物名稱！";
        resultTxt.classList.add("text-danger");
        return;
    }
    cropBtn.forEach(i => {
        i.classList.remove("active");
    });
    searchData = data.filter(i => i.作物名稱.match(cropName.value));
    if (searchData.length === 0) {
        resultTxt.textContent = "";
        productsList.innerHTML = `<tr><td colspan="7" class="text-center p-3">查詢不到當日的交易QQ</td></tr>`
        return;
    }
    resultTxt.classList.remove("text-danger");
    resultTxt.textContent = `查看「${cropName.value}」的比價結果，共有 ${searchData.length} 筆`
    cropType = searchData[0].種類代碼;
    for (i = 0; i < cropBtn.length; i++) {
        if (cropBtn[i].dataset.type === cropType) {
            cropBtn[i].classList.add("active");
        }
    }
    renderData(searchData);
}
// 優化鍵盤搜尋
cropName.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        searchCrop();
    }
})

// 下拉式選單排序
select.addEventListener("change", selectSort);
function selectSort(e){
    let sortValue = e.target.value;
    console.log(sortValue);
}