export const camelize = function(str) {
    //console.log("Camelize(" + str + ")");
    return str.split(' ').map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('');
}