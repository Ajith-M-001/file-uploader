const form = document.querySelector("form"),
    fileInput = form.querySelector(".file-input"),
    progressArea = document.querySelector(".progress-area"),
    fileTitle = document.querySelector(".progress-area .details .name"),
    uploadArea = document.querySelector(".uploaded-area");

form.addEventListener("click", () => {
    fileInput.click();
});

fileInput.onchange = ({ target }) => {
    let file = target.files[0];//getting file and [0] this means if user has selected multiople files then get first one only
    if (file) {
        let fileName = file.name;// getting selected file name
        if (fileName.length >= 12) { // if file name is greater the n 12 ,then split the name and add ... .
            let splitName = fileName.split('.');
            fileName = splitName[0].substring(0, 12) + "... ." + splitName[1];
        }
        uploadFile(fileName); //calling uploadFile with passing file name as an argument
    }
}
// fileTitle.innerText = `${fileName} • uploading..`;

function uploadFile(name) {
    let xhr = new XMLHttpRequest(); //creating new xml obj (AJAX)
    xhr.open("POST", "php/upload.php");// sending post request to the specified URL/file
    xhr.upload.addEventListener("progress", ({ loaded, total }) => {
        let fileloaded = Math.floor((loaded / total) * 100);// getting percentage of loaded file size 
        let fileTotal = Math.floor(total / 1000);//getting file size in KB from Bytes
        let fileSize;
        (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024 * 1024)).toFixed(2) + "MB";
        let progressHTML = `<li class="row">
                <i class="fas fa-file-alt"></i>
                <div class="content">
                    <div class="details">
                        <span class="name">${name} • uploading</span>
                        <span class="percent">${fileloaded}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${fileloaded}%"></div>
                    </div>
                </div>
                </li>`;
        uploadArea.classList.add("onprogress");
        progressArea.innerHTML = progressHTML;
        if (loaded == total) {
            progressArea.innerHTML = "";
            let uploadedHTML = `
                        <li class="row">
                                <div class="content">
                                    <i class="fas fa-file-alt"></i>
                                    <div class="details">
                                        <span class="name">${name} • uploaded</span>
                                        <span class="size">${fileSize}</span>
                                    </div>
                                </div>
                                <i class="fas fa-check"></i>
                        </li>`;
            uploadArea.classList.remove("onprogress");
            uploadArea.insertAdjacentHTML("afterbegin", uploadedHTML)
        }
    });
    let formData = new FormData(form);//formData is am object to easily send form data
    xhr.send(formData); //sending form data to php
}