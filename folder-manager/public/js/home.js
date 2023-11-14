function message(title, message){
    let dialog = $("#message-dialog");
    dialog.find(".modal-title").text(title);
    dialog.find(".modal-body p").text(message);
    dialog.modal("show");
}

function readDirectory(item = null, keyword = null){
    $("tbody").empty(); // clear all files and folders
    fetch("/redirect", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ itemName: item, type: "dir", keyword })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            let folders = data.folders,
                files = data.files;
            // append path
            let path = ["Home", ...data.path];
            $("#path-todir").empty();
            
            for (let i = 0; i < path.length-1; i++) {
                $("#path-todir").append(`<li class="breadcrumb-item"><a href="#" data-id="${i-path.length+1}" class="back-par">${path[i]}</a></li>`);
            }
            $("#path-todir").append(`<li class="breadcrumb-item active" aria-current="page" title="Current directory">${path[path.length-1]}</li>`);
            if (folders.length === 0 && files.length === 0) {
                $("tbody").append(`<tr><td colspan="5" class="text-center"><i class="fas fa-ban"></i> No files or folders found!</td></tr>`);
                return;
            }
            // append folders
            folders.forEach(folder => {
                $("tbody").append(`<tr>
                    <td>
                        <i class="fa fa-folder"></i>
                        <a href="#" data-type="dir" class="open">
                        ${folder.name}
                        </a>
                    </td>
                    <td>Folder</td>
                    <td>-</td>
                    <td>${folder.lastModified}</td>
                    <td>
                        <span><i class="fa fa-download action"></i></span>
                        <span><i class="fa fa-edit action"></i></span>
                        <span class="delete-btn"><i class="fa fa-trash action"></i></span>
                    </td>
                </tr>`);
            });
            // append files
            files.forEach(file => {
                let fileTypeIcon = {
                    "Text Document": "fa-file-alt",
                    "Compressed File": "fa-file-archive",
                    "JSON Source File": "fa-file-code",
                    "JavaScript File": "fa-file-code",
                    "PDF File": "fa-file-pdf",
                    "PNG File": "fa-file-image",
                    "JPG File": "fa-file-image",
                    "WEBP File": "fa-file-image",
                    "Microsoft Word Document": "fa-file-word",
                    "Microsoft Excel Document": "fa-file-excel",
                    "Microsoft PowerPoint Document": "fa-file-powerpoint"
                }
                $("tbody").append(`
                <tr>
                    <td>
                        <i class="fas ${fileTypeIcon[file.type] || 'fa-file'}"></i>
                        <a href="#" data-type="file" class="open">
                        ${file.name}
                        </a>
                    </td>
                    <td>${file.type}</td>
                    <td>${file.size/8} KB</td>
                    <td>${file.lastModified}</td>
                    <td>
                        <span><i class="fa fa-download action"></i></span>
                        <span><i class="fa fa-edit action"></i></span>
                        <span class="delete-btn"><i class="fa fa-trash action"></i></span>
                    </td>
                </tr>`);
            });
        })
        .catch(err => {
            message("Lỗi", "Đọc thư mục thất bại");
            console.log(err);
        });
}
// Add the following code if you want the name of the file appear on select
$(".custom-file-input").on("change", function () {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});
// new file or folder
$("#nfilesubmit").click(function () {
    let title = $("#nfilename").val(),
        content = $("#nfilecontent").val();
    fetch("/createTxt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.stat) {
                readDirectory();
            }
            message("Thông báo", data.message);
        })
        .catch(err => {
            message("Lỗi", "Tạo tập tin thất bại");
            console.log(err);
        });
});
$("#ndirsubmit").click(function () {
    let title = $("#ndirname").val();
    fetch("/createFolder", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.stat) {
                readDirectory();
            }
            message("Thông báo", data.message);
        })
        .catch(err => {
            message("Lỗi", "Tạo thư mục thất bại");
            console.log(err);
        })
});

$(document).ready(function () {
    // fetch all files and folders in 'home' folder
    readDirectory();

    $("#confirm-delete .btn-danger").click(function () {
        let item = $("#confirm-delete").data("item"),
            isDir = item.includes(".");
        var url = isDir ? "/deleteDir" : "/deleteFile";
        fetch(`/delete/${item}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.stat) {
                    readDirectory();
                }
                message("Thông báo", data.message);
            })
            .catch(err => {
                message("Lỗi", "Xóa thất bại");
                console.log(err);
            });
    });
    $("#upload-btn").click(function(e) {
        var formData = new FormData();
        formData.append('file', $('#customFile')[0].files[0]);
        console.log(formData);
        // show progress bar
        $(".progress").show();
        var progressBar = $('.progress .progress-bar');
        progressBar.css("width", "0%").attr('aria-valuenow', 0);
        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            xhr: function() {
                var xhr = $.ajaxSettings.xhr();
                xhr.upload.onprogress = function(e) {
                    if (e.lengthComputable) {
                        var percentComplete = Math.round((e.loaded / e.total) * 100);
                        progressBar.css('width', percentComplete + '%').attr('aria-valuenow', percentComplete);
                    }
                };
                return xhr;
            },
            success: function(data) {
                console.log(data);
                if (data.stat == 'success') {
                    message("Thông báo", data.message);
                } else {
                    message("Lỗi", data.message);
                }
                // hide progress bar
                $(".progress").hide();
            },
            error: function() {
                message("Lỗi", "Upload thất bại");
                // progress bar turn red
                progressBar.find('.progress-bar').addClass('bg-danger');
            }
        });
    });
    $("#confirm-rename .btn-primary").click(function () {
        let oldName = $("#confirm-rename").data("item"),
            type = $("#confirm-rename").data("type"),
            newName = $("#confirm-rename input").val();
        fetch(`/rename`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ oldName, newName, type })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.stat) {
                    readDirectory();
                }
                message("Thông báo", data.message);
            })
            .catch(err => {
                message("Lỗi", "Đổi tên thất bại");
                console.log(err);
            });
    });

    $("#search").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#body-box table tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

// add click event to all folders and files after they are loaded
$(document).on("click", ".fa-trash", function (e) {
    let file = $(this).closest("tr").find("a")[0],
        type = $(file).data("type");
        fileName = file.innerText;
    if (type === "dir") {
        $("#del-type").text("thư mục")
    } else {
        $("#del-type").text("tập tin")
    }
    $("#confirm-delete").data("item", fileName);
    $("#confirm-delete .modal-body strong").text(fileName);
    $("#confirm-delete").modal("show");
});
$(document).on("click", ".fa-edit", function (e) {
    let file = $(this).closest("tr").find("a")[0],
        type = $(file).data("type");
        fileName = file.innerText.trim();
    if (type === "dir") {
        $("#edit-type").text("thư mục")
    } else {
        $("#edit-type").text("tập tin")
    }
    $("#confirm-rename").data("item", fileName);
    $("#confirm-rename").data("type", type);
    $("#confirm-rename .modal-body strong").text(fileName);
    $("#confirm-rename input").val(fileName);
    $("#confirm-rename").modal("show");
});
$(document).on("click", ".fa-download", function (e) {
    let file = $(this).closest("tr").find("a")[0],
        type = $(file).data("type");
        fileName = file.innerText;
    
    fetch(`/download`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ item: fileName, type })
    })
        .then(res => res.blob())
        .then(blob => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                if (type === "dir") {
                    a.download = `${fileName}.zip`;
                } else {
                    a.download = fileName;
                }
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
        .catch(err => {
            message("Lỗi", "Tải xuống thất bại");
            console.log(err);
        });
});

function toggleDirandFileDisplay() {
    $("#body-box table").toggle();
    $("#body-box .content-box").toggle();
    if ($("#body-box .content-box").is(":visible")) {
        // disable all buttons
        $("tbody").empty();
        $(".btn-group .btn").prop("disabled", true);
        $(".btn-group .btn").prop("title", "Không thể thực hiện thao tác này ở chế độ xem nội dung!")
    } else {
        // enable all buttons
        $("#body-box .content-box").empty();
        $(".btn-group .btn").prop("disabled", false);
        $(".btn-group .btn").prop("title", "")
    }
}

$(document).on("click", ".back-par", function (e) {
    e.preventDefault();
    let id = $(this).data("id"),
        type = $(this).data("type");
    if (type === "file"){
        $("#body-box .content-box").empty();
        $("#body-box .content-box").removeClass("d-flex justify-content-center");
        toggleDirandFileDisplay();
    }
    $("tbody").empty();
    $.ajax({
        url: `/back/${id}`,
        type: "POST",
        success: function (data) {
            console.log(data);
            readDirectory();
        },
        error: function (err) {
            console.log(err);
        }
    });
});

$(document).on("click", ".open", function (e) {
    e.preventDefault();
    let type = $(this).data("type"),
        item = $(this).text().trim(),
        ext = item.split(".")[1];
    let isImg = ext === 'png' || ext === 'jpg' || ext === 'webp' || ext === 'jpeg' || ext === 'gif' || ext === 'svg' || ext === 'bmp';
    
    console.log(type, item);
    if (type === "dir") {
        readDirectory(item);
    } else {
        fetch("/redirect", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ itemName: item, type })
        })
            .then(res => res.json())
            .then(data => {
                let path = ["Home", ...data.path],
                    content = data.content;
                toggleDirandFileDisplay();
                $("#path-todir").empty();
                if (isImg) {
                    $("#body-box .content-box").append(`<img src="data:${data.type};base64,${data.content}" alt="${item}" class="img-fluid">`);
                    $("#body-box .content-box").addClass("d-flex justify-content-center");
                } else{
                    if (data.stat === "err"){
                        $("#body-box .content-box").html(`<strong class="text-danger">${content}</strong>`)
                    } else
                        $("#body-box .content-box").text(content);
                }
                for (let i = 0; i < path.length-1; i++) {
                    $("#path-todir").append(`<li class="breadcrumb-item"><a href="#" data-type="file" data-id="${i-path.length+1}" class="back-par">${path[i]}</a></li>`);
                }
                $("#path-todir").append(`<li class="breadcrumb-item active" aria-current="page" title="Current file">${path[path.length-1]}</li>`);    
            })
            .catch(err => {
                message("Lỗi", "Mở tập tin thất bại")
                console.log(err);
            });
    }
});