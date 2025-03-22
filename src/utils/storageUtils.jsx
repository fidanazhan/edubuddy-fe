export function formatStorage(bytes) {
    if (bytes >= 1_073_741_824) { // 1 GB
        return (bytes / 1_073_741_824).toFixed(2) + ' GB';
    } else if (bytes >= 1_048_576) { // 1 MB
        return (bytes / 1_048_576).toFixed(2) + ' MB';
    } else if (bytes >= 1024) { // 1 KB
        return (bytes / 1024).toFixed(2) + ' KB';
    } else {
        return bytes + ' B';
    }
}