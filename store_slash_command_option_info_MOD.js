module.exports = {
  name: 'Store Slash Command Option Info',
  section: 'Interactions',

  subtitle (data) {
    const info = ['Option Type', 'Option Name', 'Option Description', 'Is Option Required?', 'Option Choices', "Option's Options (Sub Command Only)"]
    return `${info[parseInt(data.info)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const dataTypes = ['Option Type', 'Option Name', 'Option Description', 'Is Option Required?', 'Option Choices', "Option's Options (Sub Command Only)"]
    return ([data.varName2, dataTypes[parseInt(data.info)]])
  },

  fields: ['sourceOption', 'varName', 'info', 'storage', 'varName2'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Slash Command Option:<br>
    <select id="sourceOption" class="round" onchange="glob.refreshVariableList(this)">
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
      <option value="0">Option Type</option>
      <option value="1">Option Name</option>
      <option value="2">Option Description</option>
      <option value="3">Is Option Required?</option>
      <option value="4">Option Choices</option>
      <option value="5">Option's Options (Sub Command Only)</option>
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
    const sourceOption = parseInt(data.sourceOption)
    const varName = this.evalMessage(data.varName, cache)
    const info = parseInt(data.info)
    const option = this.getVariable(sourceOption, varName, cache)
    let result
    switch (info) {
      case 0:
        result = ['Not Exist Type','Sub Command', 'Sub Command Group', 'String', 'Integer', 'Boolean', 'User', 'Channel', 'Role'][option.type]
        break
      case 1:
        result = option.name
        break
      case 2:
        result = option.description
        break
      case 3:
        result = option.required
        break
      case 4:
        result = option.choices
        break
      case 5:
        if ([1, 2].includes(option.type)) result = option.options
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
