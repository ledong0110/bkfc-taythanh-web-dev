module.exports = {
    convertRole: function (id) {
        const role = ['User','Content Creator', 'Knownledge Provider', 'Moderator'];
        return role[id];
    },
    getRandom: function(arr, n) {
        if (n > arr.length)
            n = arr.length;
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }
}