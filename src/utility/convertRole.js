module.exports = {
    convertRole: function (id) {
        const role = ['User','Content Creator', 'Knownledge Provider', 'Moderator'];
        return role[id];
    },
}