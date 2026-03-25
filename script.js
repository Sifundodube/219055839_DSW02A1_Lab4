const expected = document.getElementById('expected');
const actual = document.getElementById('actual');
const compareBtn = document.getElementById('compare-btn');
const clearBtn = document.getElementById('clear-btn');
const result = document.getElementById('result');

function compare() {
    const expLines = expected.value.split(/\r?\n/);
    const actLines = actual.value.split(/\r?\n/);
    
    if (expected.value.trim() === '' && actual.value.trim() === '') {
        result.innerHTML = '<li>Please enter text in both text areas.</li>';
        result.className = '';
        return;
    }
    
    result.innerHTML = '';
    const differences = [];
    const maxLen = Math.max(expLines.length, actLines.length);
    
    for (let i = 0; i < maxLen; i++) {
        const expLine = i < expLines.length ? expLines[i] : '';
        const actLine = i < actLines.length ? actLines[i] : '';
        if (expLine !== actLine) {
            differences.push(`Line ${i + 1}: Expected "${expLine}" vs Actual "${actLine}"`);
        }
    }
    
    if (differences.length > 0 || expLines.length !== actLines.length) {
        result.className = 'change';
        let html = '<ol id="differences"><li>Texts are different</li>';
        if (expLines.length !== actLines.length) {
            html += `<li>Number of lines differs: Expected has ${expLines.length} line(s), Actual has ${actLines.length} line(s).</li>`;
        }
        differences.forEach(diff => { html += `<li>${diff}</li>`; });
        html += '</ol>';
        result.innerHTML = html;
    } else {
        result.className = 'nochange';
        result.innerHTML = '<li>No differences found</li>';
    }
}

function clearAll() {
    expected.value = '';
    actual.value = '';
    result.innerHTML = '';
    result.className = '';
}

compareBtn.onclick = compare;
clearBtn.onclick = clearAll;