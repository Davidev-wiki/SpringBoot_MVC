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

    initArea();
    const resultMessage = await requestWeather();
    setWeather("weather", resultMessage);


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

        initArea();

        // ID값으로 분기 처리
        const theme = event.target.id;
        let resultMessage = "";

        switch (theme) {
            case "weather":
                resultMessage = await requestWeather();
                console.log('weather 종료');
                break;
            case "map":
                kakao.maps.load(() => {
                    requestMap();
                });
                console.log('map 종료');
                break;
            case "exchangeRate":
                // requestExchageRate()
                resultMessage = "";
                console.log('exchangeRate 종료');

                break;
            case "IndustryFlow":
                // requestIndustryFlow()
                resultMessage = "";
                console.log('IndustryFlow 종료');

                break;
            case "inquiry":
                resultMessage = "";
                console.log('inquiry 종료');

                break;
        }
    }

    /* 문의 버튼만 문의 컨텐츠가 보이게 처리. */
    function initArea() {
        $(".sidebar_content").empty();

        const newTitle = $("<h3>");
        newTitle.attr("id", "content-title");
        newTitle.text("");
        $(".sidebar_content").append(newTitle);

        const newDiv = $("<div>");
        newDiv.attr("id", "content-wrapper");
        newDiv.css("width", "300px");
        newDiv.css("height", "250px");
        $(".sidebar_content").append(newDiv);

        console.log("영역이 초기화 되었습니다.");
    }

    /* 날씨 조회 버튼 클릭 이벤트 */
    async function requestWeather() {
        console.log("Weather API requested!")
        const key = "23a93b0b3bafbd17bc6bfaa741906d2d";
        const requestLocation = `http://api.openweathermap.org/geo/1.0/direct?q=Seoul&limit=5&appid=${key}`;
        try{
            const result = await fetch(requestLocation)
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

    function requestMap() {
        /* key : 8bb01530fa66d976bcf0c13b83203cff */
        // 현재의 위도와 경도를 가져온 후 api 호출
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const mapContainer = document.getElementById('content-wrapper'), // 지도를 표시할 div
                mapOption = {
                    center: new kakao.maps.LatLng(lat, lon), // 지도의 중심좌표
                    level: 3 // 지도의 확대 레벨
                };
            // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
            const map = new kakao.maps.Map(mapContainer, mapOption);
        });
    }

    /* 문의 제출 버튼 클릭 이벤트 */
    $("#submit").click(function(){
        alert("보내버렸슈..")
    });

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


    function setWeather (title, message) {
        $("#content-title").text(title);
        $("<p>").text(message).appendTo("#content-wrapper");
    }

});

