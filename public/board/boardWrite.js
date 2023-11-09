function boardWrite_check() {
    let subject = document.querySelector(".bwrite_subject");
    let content = document.querySelector(".bwrite_textarea");

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

    document.boardWrite_form.submit();
}