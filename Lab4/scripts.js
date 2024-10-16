// Helper function to process student data
function processStudentData(data) {
    return data.map(student => {
        const [name, surname] = student.name.split(' ');
        return { name, surname, id: student.id };
    });
}

// Helper function to display data in a table
function displayData(data) {
    const table = document.createElement('table');
    const header = table.createTHead().insertRow();
    ['Name', 'Surname', 'ID'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        header.appendChild(th);
    });

    const tbody = table.createTBody();
    data.forEach(student => {
        const row = tbody.insertRow();
        ['name', 'surname', 'id'].forEach(prop => {
            const cell = row.insertCell();
            cell.textContent = student[prop];
        });
    });

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    resultDiv.appendChild(table);
}

// 1. XMLHttpRequest used synchronously
function fetchSynchronously() {
    let allData = [];

    function fetchFile(url) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send();
        return JSON.parse(xhr.responseText);
    }

    const reference = fetchFile('data/reference.json');
    const data1 = fetchFile(`data/${reference.data_location}`);
    allData = allData.concat(processStudentData(data1.data));

    const data2 = fetchFile(`data/${data1.data_location}`);
    allData = allData.concat(processStudentData(data2.data));

    const data3 = fetchFile('data/data3.json');
    allData = allData.concat(processStudentData(data3.data));

    displayData(allData);
}

// 2. XMLHttpRequest used asynchronously with callbacks
function fetchAsynchronously() {
    let allData = [];

    function fetchFile(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    }

    fetchFile('data/reference.json', function(reference) {
        fetchFile(`data/${reference.data_location}`, function(data1) {
            allData = allData.concat(processStudentData(data1.data));
            fetchFile(`data/${data1.data_location}`, function(data2) {
                allData = allData.concat(processStudentData(data2.data));
                fetchFile('data/data3.json', function(data3) {
                    allData = allData.concat(processStudentData(data3.data));
                    displayData(allData);
                });
            });
        });
    });
}

// 3. fetch() and promises
function fetchWithPromises() {
    let allData = [];

    fetch('data/reference.json')
        .then(response => response.json())
        .then(reference => fetch(`data/${reference.data_location}`))
        .then(response => response.json())
        .then(data1 => {
            allData = allData.concat(processStudentData(data1.data));
            return fetch(`data/${data1.data_location}`);
        })
        .then(response => response.json())
        .then(data2 => {
            allData = allData.concat(processStudentData(data2.data));
            return fetch('data/data3.json');
        })
        .then(response => response.json())
        .then(data3 => {
            allData = allData.concat(processStudentData(data3.data));
            displayData(allData);
        })
        .catch(error => console.error('Error:', error));
}

// Event listeners for buttons
document.getElementById('syncBtn').addEventListener('click', fetchSynchronously);
document.getElementById('asyncBtn').addEventListener('click', fetchAsynchronously);
document.getElementById('promiseBtn').addEventListener('click', fetchWithPromises);