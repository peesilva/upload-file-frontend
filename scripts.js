document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function() {
    document.getElementById('sendButton').style.display = 'block';
});

document.getElementById('sendButton').addEventListener('click', function() {
    uploadFile();
});

function uploadFile() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    if (!file) return;

    var formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:8080/api/integracao/aws-s3/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            displayAlert('success', 'File uploaded successfully.');
        } else if (response.status === 413) {
            displayAlert('danger', 'O tamanho do arquivo é maior que o permitido.');
        } else {
            throw new Error('Failed to upload file.');
        }
    })
    .catch(error => {
        if (error.message === 'Failed to fetch') {
            displayAlert('danger', 'O tamanho do arquivo é maior que o permitido.');
        } else {
            displayAlert('danger', error.message);
        }
    });
}

function displayAlert(type, message) {
    var alertContainer = document.getElementById('alertContainer');
    var alert = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `;
    alertContainer.innerHTML += alert;

    setTimeout(function() {
        var alerts = alertContainer.getElementsByClassName('alert');
        if (alerts.length > 0) {
            alerts[0].remove(); // Remove oalerta mais antigo
        }
    }, 5000); //(5 segundos)
}