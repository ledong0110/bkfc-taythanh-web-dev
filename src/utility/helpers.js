module.exports = {
    sum: (a, b) => a + b,
    equal: (a, b) => a == b,
    json: (ob) => JSON.stringify(ob),
    or: (a, b) => a || b,
    include: (usrs, id) => usrs.includes(id),
    and: (a, b) => a && b,
};
