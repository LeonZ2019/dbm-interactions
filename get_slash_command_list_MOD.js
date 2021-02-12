module.exports = {
  name: 'Get Slash Command List',
  section: 'Interactions',

  subtitle (data) {
    return `From ${(data.isGlobal) ? 'Global' : 'Server'}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Slash Command List'])
  },

  fields: ['category', 'varName', 'info', 'storage', 'varName2'],

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
    </div>`
  },

  init () {
    const { glob, document } = this
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

  action (cache) {
    const data = cache.actions[cache.index]
    let guild
    if (!data.isGlobal) guild = this.getServer(parseInt(data.server), this.evalMessage(data.varName, cache), cache)
    const slashCommands = await this.client.interactionClient.fetchCommands(guild)
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    this.storeValue(slashCommands, storage, varName, cache)
    this.callNextAction(cache)
  },

  mod () {}

}
