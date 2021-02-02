function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        users,
        spells
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE spells_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('users_id_seq', 0)`),
        trx.raw(`SELECT setval('spells_id_seq', 0)`),
      ])
    )
  )
}

module.exports = {
  cleanTables,
}