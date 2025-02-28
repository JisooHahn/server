// 검색창 눌렀을 때만 뜨는 창
const searchBox = document.querySelector(".searchBox>input");
const searchWindow = document.querySelector(".searchWindow");

// focus: 검색창을 클릭했을 때 검색창 뜨게 하기
searchBox.addEventListener("focus", () => {
    searchWindow.style.display = "block";
    searchWindow.style.zIndex = "999999";
});

// blur: 검색창 밖을 클릭했을 때 검색창 숨겨지게 하기
searchBox.addEventListener("blur", () => {
    searchWindow.style.display = "none";
});

// 네비 스크롤에 따라 나타났다 없어지게 하기
const fixedNav = document.querySelector(".fixedNavigation"); // 고정된 nav
const mainNav = document.querySelector(".mainNavigation"); // 스크롤 따라 사라질 nav

// 이전 스크롤 위치를 저장할 변수
let lastScrollPosition = 0;
const scrollThreshold = 100; // 100px 이상 스크롤을 내리면 mainNav가 숨겨짐

let isMainNavHovered = false; // mainNav에 마우스가 올라갔는지 체크하는 변수
let isFixedNavHovered = false; // fixedNav에 마우스가 올라갔는지 체크하는 변수

// 스크롤 이벤트로 mainNav 보이기/숨기기
window.addEventListener("scroll", function () {
    const currentScrollPosition = window.scrollY;

    // mainNav, fixedNav에 마우스가 없을 때만 스크롤에 따른 동작
    if (!isMainNavHovered && !isFixedNavHovered) {
        if (currentScrollPosition > scrollThreshold) {
            // 스크롤이 설정한 값을 넘으면
            if (currentScrollPosition > lastScrollPosition) {
                mainNav.classList.remove("show"); // mainNav 숨기기
            } else {
                mainNav.classList.add("show"); // 스크롤 올리면 나타나게
            }
        } else {
            // 스크롤이 threshold 아래일 경우 mainNav를 항상 보이게
            mainNav.classList.add("show"); // mainNav 나타나게 하기
        }
    }

    lastScrollPosition = currentScrollPosition;
});

// 이제 스크롤따라 mainNav가 숨겨지는건 됨. 이제 숨겨진 상태에서 윗쪽 nav에 커서를 갖다대면(mouseover)
// 숨겨져있던 mainNav가 보이게 show 클래스를 추가한다.

// fixedNavigation에 마우스 오버 시
fixedNav.addEventListener("mouseover", function () {
    isFixedNavHovered = true; // fixedNav에 마우스가 올라가면
    mainNav.classList.add("show");
});

// fixedNavigation에서 마우스 아웃 시
fixedNav.addEventListener("mouseout", function () {
    isFixedNavHovered = false; // fixedNav에서 마우스가 나가면
    if (!isMainNavHovered && window.scrollY > scrollThreshold) {
        mainNav.classList.remove("show");
    }
});

// mainNavigation에 마우스 오버 시
mainNav.addEventListener("mouseover", function () {
    isMainNavHovered = true; // mainNav에 마우스가 올라가면
    mainNav.classList.add("show");
});

// mainNavigation에서 마우스 아웃 시
mainNav.addEventListener("mouseout", function () {
    isMainNavHovered = false; // mainNav에서 마우스가 나가면
    if (window.scrollY > scrollThreshold) {
        mainNav.classList.remove("show");
    }
});

// 카테고리 버튼 구현 부분
// aria-pressed? html에 있길래 쓰긴 했는데
// 버튼같은 요소가 눌린 상태인지 여부를 나타내는 속성이라고 합니다...
// 토글 기능을 넣어야 하니까 이게 true인지 false인지에 따라 CSS에서 스탈을 따로 줘야겠음

// DOMContentLoaded가 뭔가하니 사이트 킬 때 즉시 js가 실행되게 하는 역할이라구 함
document.addEventListener("DOMContentLoaded", () => {
    const selectAllButton = document.querySelector(".selectAllButton"); // 전체 선택 버튼
    const categoryButtons = document.querySelectorAll(
        ".categoryButton:not(.selectAllButton)"
    ); // selectAllButton이 아닌 개별 카테고리 버튼(전체 버튼도 클래스에 포함되어있어서 not으로 제외한다)

    // 카테고리 버튼을 누르면 aria-pressed 상태 변경
    // 버튼을 각각 확인
    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // aria-pressed 값 토글
            // isPressed: 버튼이 지금 눌려있니?(boolean)

            // setAttribute(속성, 값) & getAttribute(속성)?
            // html에서 속성이랑 값을 수정할 때랑 가져올 때 쓴다구 한다.
            // 자바때 배운 getter setter이랑 느낌은 비슷한듯
            // 예:) document.querySelector("a").setAttribute("href", "https://google.com"); // a태그 링크수정
            const isPressed = button.getAttribute("aria-pressed") === "true";

            // 개별 버튼이 하나라도 해제되면 "전체 선택"을 false로 변경

            // some은 배열에서 하나라도 조건을 만족하는 요소가 있는지 확인할 때 사용
            // 여기선 개별 버튼을 누르면 전체 버튼을 끄는 목적으로 사용
            const anyUnchecked = [...categoryButtons].some(
                (btn) => btn.getAttribute("aria-pressed") === "false"
            );
            // aria-pressed 상태가 true인가? true면 false, false면 true로 반대로 리턴한다.
            selectAllButton.setAttribute(
                "aria-pressed",
                anyUnchecked ? "false" : "true"
            );

            // 선택된 버튼 개수 확인
            let buttonCount = 0;
            categoryButtons.forEach((btn) => {
                // aria-pressed의 상태가 true면
                if (btn.getAttribute("aria-pressed") === "true") {
                    // 선택된 개수에 추가하여 계산한다.
                    buttonCount++;
                }
            });

            // 개별 버튼을 5개 이상 누르면 alert 메세지 띄우기
            // buttonCount 제한만 쓰니까 alert 메세지가 뜨고 버튼 해제도 안 되어서 안 눌려있다는 조건을 추가함

            // ※ alert 띄우지 말고 선택만 더 안 되게 막으라고 하셔서 alert는 빼야겠음
            if (!isPressed && buttonCount >= 5) {
                // alert("직무는 5개까지 선택 가능합니다");
                // 메세지는 제대로 뜨는데 alert가 뜨고도 버튼 체크되는게 마음에 안 듬.
                // 여기를 통과해야 aria-pressed의 상태를 바꾸는게 좋아보임.
                return;
            }

            // 상태 변경 (위 조건을 통과한 경우만 실행)
            // aria-pressed 상태가 true인가? true면 false, false면 true로 반대로 리턴한다.
            button.setAttribute("aria-pressed", isPressed ? "false" : "true");
        });
    });

    // "전체 선택" 버튼 클릭 이벤트 (개별 버튼 상태 변경)
    selectAllButton.addEventListener("click", () => {
        const isPressed =
            selectAllButton.getAttribute("aria-pressed") === "true";

        // "전체 선택" 버튼을 클릭하면 개별 버튼들의 aria-pressed 값을 모두 false로 변경
        // 전체 버튼이 눌려있니? 눌려있음 끄고 꺼져있으면 키기
        selectAllButton.setAttribute(
            "aria-pressed",
            isPressed ? "false" : "true"
        );
        categoryButtons.forEach((button) => {
            button.setAttribute("aria-pressed", "false"); // 전체 버튼을 누르면 개별 버튼들은 모두 false로 설정
        });
    });
});

// 로그인 후 회원버튼에 마우스를 갖다대면 전용 메뉴가 뜸
const memberButton = document.querySelector(".loginedMemberButton>button"); // 홍길동님
const memberNav = document.querySelector(".loginMemberNav"); // 메뉴

const showDiv = () => (memberNav.style.display = "block"); // div가 보이게
const hideDiv = () => (memberNav.style.display = "none"); // div가 숨겨지게

// 마우스가 나가면 창이 꺼지게
// div에서 커서가 nav까지 가기 전에 창이 꺼져버리기 때문에 약간 꺼지는 시간에 딜레이를 주었다
const checkMouseLeave = () => {
    setTimeout(() => {
        // 버튼과 메뉴 둘 다 마우스를 떼면 숨기기
        if (!memberButton.matches(":hover") && !memberNav.matches(":hover")) {
            hideDiv();
        }
    }, 100);
};

// 마우스를 올렸을 때
memberButton.addEventListener("mouseenter", showDiv);
memberNav.addEventListener("mouseenter", showDiv);

// 마우스를 뗐을 때
memberButton.addEventListener("mouseleave", checkMouseLeave);
memberNav.addEventListener("mouseleave", checkMouseLeave);
