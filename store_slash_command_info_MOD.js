module.exports = {
  name: 'Store Slash Command Info',
  section: 'Interactions',

  subtitle (data) {
    const info = ['Slash Command ID', 'Slash Command Name', 'Slash Command Description', 'Slash Command Options', 'Slash Command Created At']
    return `${info[parseInt(data.info)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const dataTypes = ['Slash Command ID', 'Slash Command Name', 'Slash Command Description', 'Slash Command Options', 'Slash Command Created At']
    return ([data.varName2, dataTypes[parseInt(data.info)]])
  },

  fields: ['sourceSlashCmd', 'varName', 'info', 'storage', 'varName2'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Slash Command:<br>
    <select id="sourceSlashCmd" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div>
  <div style="padding-top: 8px; width: 70%;">
    Source Info:<br>
    <select id="info" class="round">
      <option value="0">Slash Command ID</option>
      <option value="1">Slash Command Name</option>
      <option value="2">Slash Command Description</option>
      <option value="3">Slash Command Options</option>
      <option value="4">Slash Command Created At</option>
    </select>
  </div>
</div><br>
<div>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text">
  </div>
</div>`
  },

  init () {
    const { glob, document } = this
    glob.refreshVariableList(document.getElementById('sourceSlashCmd'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const sourceSlashCmd = parseInt(data.sourceSlashCmd)
    const varName = this.evalMessage(data.varName, cache)
    const info = parseInt(data.info)
    const slashCmd = this.getVariable(slashCmd, varName, cache)
    let result
    switch (info) {
      case 0:
        result = slashCmd.id
        break
      case 1:
        result = slashCmd.name
        break
      case 2:
        result = slashCmd.description
        break
      case 3:
        result = slashCmd.options
        break
      case 4:
        result = slashCmd.createdTimestamp
        break
    }
    if (result) {
      const storage = parseInt(data.storage)
      const varName2 = this.evalMessage(data.varName2, cache)
      this.storeValue(result, storage, varName2, cache)
    }
    this.callNextAction(cache)
  },

  mod () {}

}
