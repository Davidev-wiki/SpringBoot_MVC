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
    "https://onoffmix.com/"
]

const dropdown_links = document.querySelectorAll(".dropdown-item");

dropdown_links.forEach(function(item){
    item.addEventListener("click", display);
});

const sideMenuBar = document.querySelectorAll(".page-item");

sideMenuBar.forEach(function(item){
    item.addEventListener("click", change);
});

const submitButtonClick = document.getElementById("submit");
submitButtonClick.addEventListener("click", function(){
   alert("보내버렸슈..");
});



function change(event) {

    const theme = event.target.id;

    switch (theme) {
        case "weather":
            // 처리 로직 추가
            location.href = "/";
            break;
        case "map":
            document.querySelector(".sidebar_title").innerHTML = "<h3>미구현 상태입니다.</h3>";
            console.log("지도api 실행함수 requestMap()만들기");
            // 처리 로직 추가
            // requestMap()
            break;
        case "exchangeRate":
            document.querySelector(".sidebar_title").innerHTML = "<h3>서비스 준비중입니다.</h3>";
            console.log("환율api 실행함수 requestExchageRate()만들기");
            // 처리 로직 추가
            // requestExchageRate()
            break;
        case "IndustryFlow":
            document.querySelector(".sidebar_title").innerHTML = "<h3>알아보는 중입니다.</h3>";
            console.log("동향api 실행함수 requestIndustryFlow()만들기");
            // 처리 로직 추가
            // requestIndustryFlow()
            break;
        case "inquiry":
            document.querySelector(".sidebar_title").innerHTML = "";
            console.log("문의화면 세팅함수 requestInquiry()만들기");
            // 처리 로직 추가
            requestInquiry()
            break;
        default:
        // 기본 처리 로직 (필요에 따라 추가)
        console.log(`${theme}를 클릭했습니다.`);

    }
}
function requestInquiry() {
    const inquiryArea = document.querySelector(".inquiry");
    inquiryArea.style.display = "block";
}

function display(event) {

    // 메뉴 타겟 링크 이벤트리스너 세팅
    const link = event.target.href;
    const new_window_yn = DISCONNECT.includes(link); // disconnec에 있는지 여부 체크

    if(new_window_yn) {
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


