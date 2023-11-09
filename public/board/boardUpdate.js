function boardUpdate_check() {
    let subject = document.querySelector(".bupdate_subject");
    let content = document.querySelector(".bupdate_textarea");

    if(subject.value === "") {
        alert("제목을 입력하세요.");
        subject.focus();
        return false;
    };

    if(content.value === "") {
        alert("내용을 입력하세요.");
        content.focus();
        return false;
    };

    document.boardUpdate_form.submit();
}