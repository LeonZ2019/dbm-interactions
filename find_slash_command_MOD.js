module.exports = {
  name: 'Find Slash Command',
  section: 'Interactions',

  subtitle (data) {
    const options = ['Name with Match Case', 'Name', 'ID']
    return `Find ${(data.isGlobal) ? 'Global' : 'Server'} Slash Command with option ${options[data.info]} is ${data.search}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Slash Command'])
  },

  fields: ['isGlobal', 'server', 'varName', 'info', 'search', 'storage', 'varName', 'iftrue', 'iftrueVal', 'iffalse', 'iffalseVal'],

  html (isEvent, data) {
    return `
  <div>
    <div style="float: left; width: 35%;">
      Is Global:
      <select id="isGlobal" class="round" onchange="glob.isGlobal(this)">
        <option value=true>True</options>
        <option value=false>False</options>
      </select>
    </div>
  </div><br><br><br>
  <div id="isGlobalPlaceHolder" stlye="display: none;">
    <div style="float: left; width: 35%;">
      Source Server:<br>
      <select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
        ${data.servers[isEvent ? 1 : 0]}
      </select>
    </div>
    <div id="varNameContainer" style="display: none; float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList"><br>
    </div>
  </div><br><br><br>
  <div>
    <div style="float: left; width: 40%;">
      Source Field:<br>
      <select id="info" class="round">
        <option value="0" selected>Slash Command Name (Match Case)</option>
        <option value="1" selected>Slash Command Name</option>
        <option value="2">Slash Command ID</option>
      </select>
    </div>
    <div style="float: right; width: 55%;">
      Search Value:<br>
      <input id="search" class="round" type="text">
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Store In:<br>
      <select id="storage" class="round">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text">
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    ${data.conditions[0]}
  </div>`
  },

  init () {
    const { glob, document } = this
    const conditions = ['iffalse', 'iftrue']
    const conditionsText = ["If Command Wasn't Found:<br>", "If Command Found:<br>"]
    for (let c = 0; c < conditions.length; c++) {
      const option = document.createElement('OPTION')
      option.value = '4'
      option.text = 'Jump to Anchor'
      const element = document.getElementById(conditions[c])
      element.innerHTML = conditionsText[c]
      element.add(option)
    }
    const onChangeEvent = function (value, type) {
      const elementIds = { true: ['iftrueName', 'iftrueContainer'], false: ['iffalseName', 'iffalseContainer'] }
      switch (parseInt(value)) {
        case 0:
        case 1:
          document.getElementById(elementIds[type][1]).style.display = 'none'
          break
        case 2:
          document.getElementById(elementIds[type][0]).innerHTML = 'Action Number'
          document.getElementById(elementIds[type][1]).style.display = null
          break
        case 3:
          document.getElementById(elementIds[type][0]).innerHTML = 'Number of Actions to Skip'
          document.getElementById(elementIds[type][1]).style.display = null
          break
        case 4:
          document.getElementById(elementIds[type][0]).innerHTML = 'Anchor ID'
          document.getElementById(elementIds[type][1]).style.display = null
          break
      }
    }
    glob.onChangeTrue = (event) => onChangeEvent(event.value, 'true')
    glob.onChangeFalse = (event) => onChangeEvent(event.value, 'false')
    glob.onChangeTrue(document.getElementById('iftrue'))
    glob.onChangeFalse(document.getElementById('iffalse'))
    glob.isGlobal = (event) => {
      switch(parseInt(event.value)) {
        case "true": // ?
          document.getElementById('isGlobalPlaceHolder').style.display = 'none'
          break
        case "false": // ? or case false?
          document.getElementById('isGlobalPlaceHolder').style.display = null
          break
      }
    }
    glob.isGlobal(document.getElementById('isGlobal'))
  },

  async action (cache) {
    const data = cache.actions[cache.index]
    let guild
    if (!data.isGlobal) guild = this.getServer(parseInt(data.server), this.evalMessage(data.varName, cache), cache)
    const info = parseInt(data.info)
    const search = this.evalMessage(data.search, cache)
    const slashCommands = await this.client.interactionClient.fetchCommands(guild)
    let cmd
    switch (info) {
      case 0:
        cmd = slashCommands.find(cmd => cmd.name === search)
        break
      case 1:
        cmd = slashCommands.find(cmd => cmd.name.toLowerCase() === search.toLowerCase())
        break
      case 2:
        cmd = slashCommands.find(cmd => cmd.id === parseInt(search))
        break
    }
    if (cmd) {
      const storage = parseInt(data.storage)
      const varName = this.evalMessage(data.varName, cache)
      this.storeValue(result, storage, varName, cache)
    }
    this.executeResults(!!cmd, data, cache)
  },

  mod () {}
}
