/* 연결 불가 링크 리스트 */
const DISCONNECT = [
    'https://www.k-startup.go.kr/',
    'https://www.k-startup.go.kr/edu/home/main/index',
    "https://www.motie.go.kr/",
    "https://www.kisa.or.kr/",
    "https://www.nipa.kr/",
    "https://www.kocca.kr/kocca/main.do",
    "https://www.smes.go.kr/sme-expo/site/main/home.do",
    "https://www.campus.co/intl/ko_kr/seoul/",
    "https://dcamp.kr/",
    "https://www.startupall.kr/",
    "http://fundfinder.k-vic.co.kr/rsh/rsh/RshMacFnd",
    "https://www.vcs.go.kr/web/portal/investor/list",
    "https://www.wishket.com/",
    "https://www.freemoa.net/",
    "https://onoffmix.com/",
    "http://startup-wiki.kr"
]

$(document).ready(async function(){
    console.log("문서가 로딩완료되었습니다");
    const resultMessage = await requestWeather();
    createView("weather", resultMessage);
});

/* 좌측 메뉴링크 버튼 클릭 이벤트 */
const dropdown_links = document.querySelectorAll(".dropdown-item");
dropdown_links.forEach(function (item) {
    item.addEventListener("click", display);
});

function display(event) {

    // 메뉴 타겟 링크 이벤트리스너 세팅
    const link = event.target.href;
    const new_window_yn = DISCONNECT.includes(link); // disconnec에 있는지 여부 체크

    if (new_window_yn) {
        event.target.setAttribute("target", "_blank");
        //console.log('새 창으로 연결됩니다.');
        return;
    } else {
        //console.log('현재 창으로 연결합니다.');

        event.preventDefault();
        const $element = document.createElement("embed");

        $element.setAttribute("class", 'embeded-content')
        $element.setAttribute("type", 'text/html');
        $element.setAttribute("src", link);
        const content_area = document.getElementById("contents");

        // 기존에 있던 자식 노드들을 모두 제거
        while (content_area.firstChild) {
            content_area.removeChild(content_area.firstChild);
        }

        content_area.appendChild($element); // 수정된 embed 요소를 삽입
        content_area.style.display = "block";
    }

}


/* 우측 사이드메뉴 버튼 클릭 이벤트*/
const sideMenuBar = document.querySelectorAll(".page-item");
sideMenuBar.forEach(function(item){
    item.addEventListener("click", change);
});

async function change(event) {

    // "문의"인 경우만 화면 세팅
    initArea();

    // ID값으로 분기 처리
    const theme = event.target.id;
    let resultMessage = "";

    switch (theme) {
        case "weather":
            resultMessage = await requestWeather();
            createView(theme, resultMessage);
            break;
        case "map":
            // requestMap()
            resultMessage = "";
        case "exchangeRate":
            // requestExchageRate()
            resultMessage = "";
        case "IndustryFlow":
            // requestIndustryFlow()
            resultMessage = "";
        case "inquiry":
            resultMessage = "";
        default:
            createView(theme, resultMessage);
    }
}

/* 문의 버튼만 문의 컨텐츠가 보이게 처리. */
function initArea() {
    $(".side_contents.inquiry").hide();
    $("#sb_title").text('');
    $(".table-wrapper").text('');
    console.log("영역이 초기화 되었습니다.");

}


/* 날씨 조회 버튼 클릭 이벤트 */
async function requestWeather() {
    console.log("API request Start!")
    const key = "23a93b0b3bafbd17bc6bfaa741906d2d";
    const requestLocation = `http://api.openweathermap.org/geo/1.0/direct?q=Seoul&limit=5&appid=${key}`;
    try{
        const result = await fetch(requestLocation)
        apiResult(result);
        const jsonResult = await result.json();

        let locationSet= new Object();
        locationSet = findLocation(locationSet, jsonResult[0]);

        const resultMessage = await getWeather(locationSet.lat, locationSet.lon, key);
        console.log("resultMessage >>> : " + resultMessage);
        return resultMessage;
    } catch (error) {
        console.error('Error in : requestWeather() >>> : '+ error);
        return "";
    }

}

/* 문의 제출 버튼 클릭 이벤트 */
const submitButtonClick = document.getElementById("submit");
submitButtonClick.addEventListener("click", function(){
   alert("보내버렸슈..");
});

/* api 결과 로그 출력 */
function apiResult(result) {
    const targetUrl = result.url;
    const rType = result.type;
    const rStatus = result.status;
    const rStatusText = result.statusText;

    console.log(`url : ${targetUrl}, type : ${rType}, status : ${rStatus} >>> : ${rStatusText}`);
}


function findLocation(object, info) {
    object.country = info.country;
    object.city = info.name;
    object.lat = info.lat; // 위도
    object.lon = info.lon; // 경도

    return object;
}

async function getWeather(lat, lon, key) {

    const requestWeather =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=kr`;
    try{
        const getWeather = await fetch(requestWeather);
        const weatherData = await getWeather.json();

        if (!weatherData) {
            return "날씨를 가져오지 못했어요!";
        }

        const locName = weatherData.name; // 지역명
        const temp_Max = weatherData.main.temp_max; // 최고기온
        const temp_Min = weatherData.main.temp_min; // 최저기온
        const temp = weatherData.main.temp; // 현재기온
        const desciption = weatherData.weather[0].description;

        const message =
        `현재 위치는 ${locName} 입니다! \n 오늘의 최고기온은 ${temp_Max}도, 최저기온은 ${temp_Min}도 입니다! \n 현재 온도는 ${temp} 도 입니다! \n 현재 날씨는 ${desciption} 입니다!`;

        return message;
    } catch(error) {
        console.log("error in findLocation(object, info) >>> : " + error)
    }
}


function createView(theme, message) {

    if (theme === "inquiry") {
        $(".side_contents.inquiry").show();
    } else {
        $("#sb_title").text(theme);
        $("<p>").text(message).appendTo(".table-wrapper");
    }

}