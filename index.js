import Realm from 'realm'


const openAndCloseWithSchema = async (schema) => {
  let realm
  try {
    console.log("Opening realm")
    realm = await Realm.open({schema})
    .catch((e) => {
      console.error("Cought rejection error")
      console.error(e)
    })
  } catch (e) {
    // >>> OBSERVE BUG HERE <<<
    // Expected this error to be delivered via the promise rejection
    console.error("Cought thrown error")
    console.error(e)
  }
  if (realm) {
    console.log("Closing realm")
    realm.close()
  }
  return realm
}

const runTest = async () => {
  class Model {}
  Model.schema =  {
    name: 'Model',
    primaryKey: 'id',
    properties: {
      id: 'int',
      name: 'string',
    }
  }
  await openAndCloseWithSchema([Model])

  // update model schema and add `description`
  Model.schema =  {
    name: 'Model',
    primaryKey: 'id',
    properties: {
      id: 'int',
      name: 'string',
      description: 'string',
    }
  }
  await openAndCloseWithSchema([Model])
}

runTest().then(() => {
  console.log("Exiting")
  // importing Realm prevents the process from ending by itself
  // See https://github.com/realm/realm-js/issues/1387
  process.exit(0)
})
